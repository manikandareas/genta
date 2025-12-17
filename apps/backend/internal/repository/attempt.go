package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/manikandareas/genta/internal/errs"
	"github.com/manikandareas/genta/internal/model/attempt"
	"github.com/manikandareas/genta/internal/model/question"
	"github.com/manikandareas/genta/internal/server"
)

type AttemptRepository struct {
	server *server.Server
}

func NewAttemptRepository(server *server.Server) *AttemptRepository {
	return &AttemptRepository{server: server}
}

// Create inserts a new attempt record
func (r *AttemptRepository) Create(ctx context.Context, a *attempt.Attempt) (*attempt.Attempt, error) {
	stmt := `
		INSERT INTO attempts (
			id, user_id, question_id, session_id,
			selected_answer, is_correct, time_spent_seconds,
			user_theta_before, user_theta_after, theta_change,
			feedback_generated, attempt_number_in_session, created_at
		) VALUES (
			@id, @user_id, @question_id, @session_id,
			@selected_answer, @is_correct, @time_spent_seconds,
			@user_theta_before, @user_theta_after, @theta_change,
			@feedback_generated, @attempt_number_in_session, NOW()
		)
		RETURNING id, user_id, question_id, session_id,
			selected_answer, is_correct, time_spent_seconds,
			user_theta_before, user_theta_after, theta_change,
			feedback_generated, feedback_model_used, feedback_generation_ms,
			feedback_helpful, attempt_number_in_session, created_at, deleted_at
	`

	args := pgx.NamedArgs{
		"id":                        a.ID,
		"user_id":                   a.UserID,
		"question_id":               a.QuestionID,
		"session_id":                a.SessionID,
		"selected_answer":           a.SelectedAnswer,
		"is_correct":                a.IsCorrect,
		"time_spent_seconds":        a.TimeSpentSeconds,
		"user_theta_before":         a.UserThetaBefore,
		"user_theta_after":          a.UserThetaAfter,
		"theta_change":              a.ThetaChange,
		"feedback_generated":        a.FeedbackGenerated,
		"attempt_number_in_session": a.AttemptNumberInSession,
	}

	rows, err := r.server.DB.Pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, fmt.Errorf("failed to create attempt: %w", err)
	}

	created, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[attempt.Attempt])
	if err != nil {
		return nil, fmt.Errorf("failed to collect created attempt: %w", err)
	}

	return &created, nil
}

// GetByID retrieves an attempt by ID
func (r *AttemptRepository) GetByID(ctx context.Context, attemptID string) (*attempt.Attempt, error) {
	stmt := `
		SELECT id, user_id, question_id, session_id,
			selected_answer, is_correct, time_spent_seconds,
			user_theta_before, user_theta_after, theta_change,
			feedback_generated, feedback_model_used, feedback_generation_ms,
			feedback_helpful, attempt_number_in_session, created_at, deleted_at
		FROM attempts 
		WHERE id = @id AND deleted_at IS NULL
	`

	rows, err := r.server.DB.Pool.Query(ctx, stmt, pgx.NamedArgs{"id": attemptID})
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}

	a, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[attempt.Attempt])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errs.NewNotFoundError("attempt not found", false, nil)
		}
		return nil, fmt.Errorf("failed to collect row: %w", err)
	}

	return &a, nil
}

// GetByIDWithDetails retrieves an attempt with question and feedback joined
func (r *AttemptRepository) GetByIDWithDetails(ctx context.Context, attemptID string, userID uuid.UUID) (*attempt.Attempt, error) {
	// First get the attempt
	a, err := r.GetByID(ctx, attemptID)
	if err != nil {
		return nil, err
	}

	// Verify ownership
	if a.UserID != userID {
		return nil, errs.NewForbiddenError("you don't have permission to access this attempt", false)
	}

	// Get question details
	questionStmt := `
		SELECT id, text, option_a, option_b, option_c, option_d, option_e, 
			correct_answer, explanation
		FROM questions 
		WHERE id = @question_id
	`

	questionRows, err := r.server.DB.Pool.Query(ctx, questionStmt, pgx.NamedArgs{"question_id": a.QuestionID})
	if err != nil {
		return nil, fmt.Errorf("failed to get question: %w", err)
	}

	q, err := pgx.CollectOneRow(questionRows, pgx.RowToStructByName[struct {
		ID            uuid.UUID `db:"id"`
		Text          string    `db:"text"`
		OptionA       string    `db:"option_a"`
		OptionB       string    `db:"option_b"`
		OptionC       string    `db:"option_c"`
		OptionD       string    `db:"option_d"`
		OptionE       string    `db:"option_e"`
		CorrectAnswer string    `db:"correct_answer"`
		Explanation   *string   `db:"explanation"`
	}])
	if err == nil {
		a.Question = &question.Question{
			ID:            q.ID,
			Text:          q.Text,
			OptionA:       q.OptionA,
			OptionB:       q.OptionB,
			OptionC:       q.OptionC,
			OptionD:       q.OptionD,
			OptionE:       q.OptionE,
			CorrectAnswer: q.CorrectAnswer,
			Explanation:   q.Explanation,
		}
	}

	// Get feedback from attempt_feedback table if exists
	feedbackStmt := `
		SELECT id, attempt_id, feedback_text, feedback_lang,
			feedback_quality_rating, is_helpful, helpful_rating,
			model_used, prompt_version, generation_time_ms,
			token_count_input, token_count_output, created_at, updated_at
		FROM attempt_feedback 
		WHERE attempt_id = @attempt_id
	`

	feedbackRows, err := r.server.DB.Pool.Query(ctx, feedbackStmt, pgx.NamedArgs{"attempt_id": attemptID})
	if err == nil {
		f, err := pgx.CollectOneRow(feedbackRows, pgx.RowToStructByName[attempt.AttemptFeedback])
		if err == nil {
			a.Feedback = &f
		}
	}

	return a, nil
}

// UpdateFeedbackRating updates is_helpful in both attempt_feedback and attempts tables
func (r *AttemptRepository) UpdateFeedbackRating(ctx context.Context, attemptID string, userID uuid.UUID, isHelpful bool) error {
	// First verify the attempt belongs to the user
	verifyStmt := `SELECT user_id FROM attempts WHERE id = @attempt_id AND deleted_at IS NULL`
	var ownerID uuid.UUID
	err := r.server.DB.Pool.QueryRow(ctx, verifyStmt, pgx.NamedArgs{"attempt_id": attemptID}).Scan(&ownerID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return errs.NewNotFoundError("attempt not found", false, nil)
		}
		return fmt.Errorf("failed to verify attempt ownership: %w", err)
	}

	if ownerID != userID {
		return errs.NewForbiddenError("you don't have permission to rate this feedback", false)
	}

	// Start transaction to update both tables
	tx, err := r.server.DB.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	// Update attempt_feedback table (source of truth)
	feedbackStmt := `
		UPDATE attempt_feedback 
		SET is_helpful = @is_helpful, updated_at = NOW()
		WHERE attempt_id = @attempt_id
	`
	result, err := tx.Exec(ctx, feedbackStmt, pgx.NamedArgs{
		"attempt_id": attemptID,
		"is_helpful": isHelpful,
	})
	if err != nil {
		return fmt.Errorf("failed to update attempt_feedback: %w", err)
	}

	if result.RowsAffected() == 0 {
		return errs.NewNotFoundError("feedback not found for this attempt", false, nil)
	}

	// Sync to attempts table (denormalized copy)
	attemptStmt := `
		UPDATE attempts 
		SET feedback_helpful = @is_helpful
		WHERE id = @attempt_id
	`
	_, err = tx.Exec(ctx, attemptStmt, pgx.NamedArgs{
		"attempt_id": attemptID,
		"is_helpful": isHelpful,
	})
	if err != nil {
		return fmt.Errorf("failed to sync feedback_helpful to attempts: %w", err)
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

// CreateFeedback inserts a new feedback record into attempt_feedback table
func (r *AttemptRepository) CreateFeedback(ctx context.Context, f *attempt.AttemptFeedback) (*attempt.AttemptFeedback, error) {
	stmt := `
		INSERT INTO attempt_feedback (
			id, attempt_id, feedback_text, feedback_lang,
			model_used, prompt_version, generation_time_ms,
			token_count_input, token_count_output, created_at, updated_at
		) VALUES (
			@id, @attempt_id, @feedback_text, @feedback_lang,
			@model_used, @prompt_version, @generation_time_ms,
			@token_count_input, @token_count_output, NOW(), NOW()
		)
		RETURNING id, attempt_id, feedback_text, feedback_lang,
			feedback_quality_rating, is_helpful, helpful_rating,
			model_used, prompt_version, generation_time_ms,
			token_count_input, token_count_output, created_at, updated_at
	`

	args := pgx.NamedArgs{
		"id":                 f.ID,
		"attempt_id":         f.AttemptID,
		"feedback_text":      f.FeedbackText,
		"feedback_lang":      f.FeedbackLang,
		"model_used":         f.ModelUsed,
		"prompt_version":     f.PromptVersion,
		"generation_time_ms": f.GenerationTimeMs,
		"token_count_input":  f.TokenCountInput,
		"token_count_output": f.TokenCountOutput,
	}

	rows, err := r.server.DB.Pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, fmt.Errorf("failed to create feedback: %w", err)
	}

	created, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[attempt.AttemptFeedback])
	if err != nil {
		return nil, fmt.Errorf("failed to collect created feedback: %w", err)
	}

	return &created, nil
}

// MarkFeedbackGenerated updates the feedback fields on an attempt
func (r *AttemptRepository) MarkFeedbackGenerated(ctx context.Context, attemptID string, modelUsed string, generationMs int) error {
	stmt := `
		UPDATE attempts 
		SET feedback_generated = true, 
			feedback_model_used = @model_used,
			feedback_generation_ms = @generation_ms
		WHERE id = @id
	`
	_, err := r.server.DB.Pool.Exec(ctx, stmt, pgx.NamedArgs{
		"id":            attemptID,
		"model_used":    modelUsed,
		"generation_ms": generationMs,
	})
	if err != nil {
		return fmt.Errorf("failed to mark feedback generated: %w", err)
	}
	return nil
}

// UpdateQuestionStats updates question statistics after an attempt
func (r *AttemptRepository) UpdateQuestionStats(ctx context.Context, questionID uuid.UUID, isCorrect bool, timeSpent int16) error {
	stmt := `
		UPDATE questions 
		SET 
			attempt_count = COALESCE(attempt_count, 0) + 1,
			correct_rate = (
				(COALESCE(correct_rate, 0) * COALESCE(attempt_count, 0)) + @is_correct_int
			) / (COALESCE(attempt_count, 0) + 1),
			avg_time_seconds = (
				(COALESCE(avg_time_seconds, 0) * COALESCE(attempt_count, 0)) + @time_spent
			) / (COALESCE(attempt_count, 0) + 1),
			updated_at = NOW()
		WHERE id = @question_id
	`

	isCorrectInt := 0
	if isCorrect {
		isCorrectInt = 1
	}

	_, err := r.server.DB.Pool.Exec(ctx, stmt, pgx.NamedArgs{
		"question_id":    questionID,
		"is_correct_int": isCorrectInt,
		"time_spent":     timeSpent,
	})
	if err != nil {
		return fmt.Errorf("failed to update question stats: %w", err)
	}

	return nil
}
