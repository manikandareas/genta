package repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/manikandareas/genta/internal/errs"
	"github.com/manikandareas/genta/internal/model/session"
	"github.com/manikandareas/genta/internal/server"
)

type SessionRepository struct {
	server *server.Server
}

func NewSessionRepository(server *server.Server) *SessionRepository {
	return &SessionRepository{server: server}
}

// Create creates a new study session
func (r *SessionRepository) Create(ctx context.Context, sess *session.Session) error {
	stmt := `
		INSERT INTO user_study_sessions (
			id, user_id, started_at, section,
			questions_attempted, questions_correct
		) VALUES (
			@id, @user_id, @started_at, @section,
			@questions_attempted, @questions_correct
		)
	`

	args := pgx.NamedArgs{
		"id":                  sess.ID,
		"user_id":             sess.UserID,
		"started_at":          sess.StartedAt,
		"section":             sess.Section,
		"questions_attempted": sess.QuestionsAttempted,
		"questions_correct":   sess.QuestionsCorrect,
	}

	_, err := r.server.DB.Pool.Exec(ctx, stmt, args)
	if err != nil {
		return fmt.Errorf("failed to create session: %w", err)
	}

	return nil
}

// GetByID retrieves a session by its ID
func (r *SessionRepository) GetByID(ctx context.Context, sessionID string) (*session.Session, error) {
	stmt := `
		SELECT id, user_id, started_at, ended_at, duration_minutes,
			questions_attempted, questions_correct, accuracy_in_session,
			section, created_at, updated_at
		FROM user_study_sessions
		WHERE id = @id
	`

	rows, err := r.server.DB.Pool.Query(ctx, stmt, pgx.NamedArgs{"id": sessionID})
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}

	sess, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[session.Session])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errs.NewNotFoundError("session not found", false, nil)
		}
		return nil, fmt.Errorf("failed to collect row: %w", err)
	}

	return &sess, nil
}

// GetByIDAndUserID retrieves a session by ID and user ID (for ownership check)
func (r *SessionRepository) GetByIDAndUserID(ctx context.Context, sessionID string, userID uuid.UUID) (*session.Session, error) {
	stmt := `
		SELECT id, user_id, started_at, ended_at, duration_minutes,
			questions_attempted, questions_correct, accuracy_in_session,
			section, created_at, updated_at
		FROM user_study_sessions
		WHERE id = @id AND user_id = @user_id
	`

	args := pgx.NamedArgs{
		"id":      sessionID,
		"user_id": userID,
	}

	rows, err := r.server.DB.Pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}

	sess, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[session.Session])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errs.NewNotFoundError("session not found", false, nil)
		}
		return nil, fmt.Errorf("failed to collect row: %w", err)
	}

	return &sess, nil
}

// List retrieves sessions for a user with pagination
func (r *SessionRepository) List(ctx context.Context, userID uuid.UUID, req *session.ListSessionsRequest) ([]session.Session, int, error) {
	offset := (req.Page - 1) * req.Limit
	args := pgx.NamedArgs{
		"user_id": userID,
		"limit":   req.Limit,
		"offset":  offset,
	}

	// Count total
	countStmt := `SELECT COUNT(*) FROM user_study_sessions WHERE user_id = @user_id`
	var total int
	err := r.server.DB.Pool.QueryRow(ctx, countStmt, args).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count sessions: %w", err)
	}

	// Get sessions
	stmt := `
		SELECT id, user_id, started_at, ended_at, duration_minutes,
			questions_attempted, questions_correct, accuracy_in_session,
			section, created_at, updated_at
		FROM user_study_sessions
		WHERE user_id = @user_id
		ORDER BY started_at DESC
		LIMIT @limit OFFSET @offset
	`

	rows, err := r.server.DB.Pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to execute query: %w", err)
	}

	sessions, err := pgx.CollectRows(rows, pgx.RowToStructByName[session.Session])
	if err != nil {
		return nil, 0, fmt.Errorf("failed to collect rows: %w", err)
	}

	return sessions, total, nil
}

// End ends a session by setting ended_at and calculating duration/accuracy
func (r *SessionRepository) End(ctx context.Context, sessionID string, userID uuid.UUID) (*session.Session, error) {
	now := time.Now()

	// First get the session to calculate duration
	sess, err := r.GetByIDAndUserID(ctx, sessionID, userID)
	if err != nil {
		return nil, err
	}

	// Check if already ended
	if sess.EndedAt != nil {
		return nil, errs.NewBadRequestError("session already ended", false, nil, nil, nil)
	}

	// Calculate duration in minutes
	durationMinutes := int16(now.Sub(sess.StartedAt).Minutes())

	// Calculate accuracy
	var accuracy *float64
	if sess.QuestionsAttempted > 0 {
		acc := float64(sess.QuestionsCorrect) / float64(sess.QuestionsAttempted)
		accuracy = &acc
	}

	stmt := `
		UPDATE user_study_sessions
		SET ended_at = @ended_at,
			duration_minutes = @duration_minutes,
			accuracy_in_session = @accuracy_in_session,
			updated_at = @updated_at
		WHERE id = @id AND user_id = @user_id
		RETURNING id, user_id, started_at, ended_at, duration_minutes,
			questions_attempted, questions_correct, accuracy_in_session,
			section, created_at, updated_at
	`

	args := pgx.NamedArgs{
		"id":                  sessionID,
		"user_id":             userID,
		"ended_at":            now,
		"duration_minutes":    durationMinutes,
		"accuracy_in_session": accuracy,
		"updated_at":          now,
	}

	rows, err := r.server.DB.Pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, fmt.Errorf("failed to end session: %w", err)
	}

	updatedSess, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[session.Session])
	if err != nil {
		return nil, fmt.Errorf("failed to collect row: %w", err)
	}

	return &updatedSess, nil
}

// UpdateStats updates session statistics (called after each attempt)
func (r *SessionRepository) UpdateStats(ctx context.Context, sessionID string, isCorrect bool) error {
	correctIncrement := 0
	if isCorrect {
		correctIncrement = 1
	}

	stmt := `
		UPDATE user_study_sessions
		SET questions_attempted = questions_attempted + 1,
			questions_correct = questions_correct + @correct_increment,
			updated_at = @updated_at
		WHERE id = @id
	`

	args := pgx.NamedArgs{
		"id":                sessionID,
		"correct_increment": correctIncrement,
		"updated_at":        time.Now(),
	}

	_, err := r.server.DB.Pool.Exec(ctx, stmt, args)
	if err != nil {
		return fmt.Errorf("failed to update session stats: %w", err)
	}

	return nil
}
