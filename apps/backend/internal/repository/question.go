package repository

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/manikandareas/genta/internal/errs"
	"github.com/manikandareas/genta/internal/model/question"
	"github.com/manikandareas/genta/internal/server"
)

type QuestionRepository struct {
	server *server.Server
}

func NewQuestionRepository(server *server.Server) *QuestionRepository {
	return &QuestionRepository{server: server}
}

// GetByID retrieves a question by its ID
func (r *QuestionRepository) GetByID(ctx context.Context, questionID string) (*question.Question, error) {
	stmt := `
		SELECT id, question_bank_id, section, sub_type, 
			difficulty_irt, discrimination, guessing_param,
			text, option_a, option_b, option_c, option_d, option_e, correct_answer,
			explanation, explanation_en, strategy_tip, related_concept, solution_steps,
			is_active, attempt_count, correct_rate, avg_time_seconds,
			created_at, updated_at, deleted_at
		FROM questions 
		WHERE id = @id AND deleted_at IS NULL AND is_active = true
	`

	rows, err := r.server.DB.Pool.Query(ctx, stmt, pgx.NamedArgs{"id": questionID})
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}

	q, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[question.Question])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errs.NewNotFoundError("question not found", false, nil)
		}
		return nil, fmt.Errorf("failed to collect row: %w", err)
	}

	return &q, nil
}

// List retrieves questions with optional filtering and pagination
func (r *QuestionRepository) List(ctx context.Context, req *question.ListQuestionsRequest) ([]question.Question, int, error) {
	offset := (req.Page - 1) * req.Limit

	// Use separate queries for with/without section filter to avoid dynamic SQL
	if req.Section != nil {
		return r.listWithSection(ctx, *req.Section, req.Limit, offset)
	}
	return r.listAll(ctx, req.Limit, offset)
}

// listWithSection retrieves questions filtered by section
func (r *QuestionRepository) listWithSection(ctx context.Context, section string, limit, offset int) ([]question.Question, int, error) {
	args := pgx.NamedArgs{
		"section": section,
		"limit":   limit,
		"offset":  offset,
	}

	// Count total
	var total int
	countStmt := `SELECT COUNT(*) FROM questions WHERE deleted_at IS NULL AND is_active = true AND section = @section`
	err := r.server.DB.Pool.QueryRow(ctx, countStmt, args).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count questions: %w", err)
	}

	// Get questions
	stmt := `
		SELECT id, question_bank_id, section, sub_type, 
			difficulty_irt, discrimination, guessing_param,
			text, option_a, option_b, option_c, option_d, option_e, correct_answer,
			explanation, explanation_en, strategy_tip, related_concept, solution_steps,
			is_active, attempt_count, correct_rate, avg_time_seconds,
			created_at, updated_at, deleted_at
		FROM questions 
		WHERE deleted_at IS NULL AND is_active = true AND section = @section
		ORDER BY created_at DESC
		LIMIT @limit OFFSET @offset
	`

	rows, err := r.server.DB.Pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to execute query: %w", err)
	}

	questions, err := pgx.CollectRows(rows, pgx.RowToStructByName[question.Question])
	if err != nil {
		return nil, 0, fmt.Errorf("failed to collect rows: %w", err)
	}

	return questions, total, nil
}

// listAll retrieves all questions without section filter
func (r *QuestionRepository) listAll(ctx context.Context, limit, offset int) ([]question.Question, int, error) {
	args := pgx.NamedArgs{
		"limit":  limit,
		"offset": offset,
	}

	// Count total
	var total int
	countStmt := `SELECT COUNT(*) FROM questions WHERE deleted_at IS NULL AND is_active = true`
	err := r.server.DB.Pool.QueryRow(ctx, countStmt).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count questions: %w", err)
	}

	// Get questions
	stmt := `
		SELECT id, question_bank_id, section, sub_type, 
			difficulty_irt, discrimination, guessing_param,
			text, option_a, option_b, option_c, option_d, option_e, correct_answer,
			explanation, explanation_en, strategy_tip, related_concept, solution_steps,
			is_active, attempt_count, correct_rate, avg_time_seconds,
			created_at, updated_at, deleted_at
		FROM questions 
		WHERE deleted_at IS NULL AND is_active = true
		ORDER BY created_at DESC
		LIMIT @limit OFFSET @offset
	`

	rows, err := r.server.DB.Pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to execute query: %w", err)
	}

	questions, err := pgx.CollectRows(rows, pgx.RowToStructByName[question.Question])
	if err != nil {
		return nil, 0, fmt.Errorf("failed to collect rows: %w", err)
	}

	return questions, total, nil
}

// GetNextForUser retrieves the next question for adaptive learning
// It selects a question the user hasn't attempted recently, matching their skill level
func (r *QuestionRepository) GetNextForUser(ctx context.Context, userID string, section string) (*question.Question, error) {
	// Get user's current theta (skill level) for adaptive selection
	// For now, use a simpler approach: get a random question from the section
	// that the user hasn't attempted in the last 24 hours
	stmt := `
		SELECT q.id, q.question_bank_id, q.section, q.sub_type, 
			q.difficulty_irt, q.discrimination, q.guessing_param,
			q.text, q.option_a, q.option_b, q.option_c, q.option_d, q.option_e, q.correct_answer,
			q.explanation, q.explanation_en, q.strategy_tip, q.related_concept, q.solution_steps,
			q.is_active, q.attempt_count, q.correct_rate, q.avg_time_seconds,
			q.created_at, q.updated_at, q.deleted_at
		FROM questions q
		WHERE q.section = @section 
			AND q.deleted_at IS NULL 
			AND q.is_active = true
			AND q.id NOT IN (
				SELECT a.question_id 
				FROM attempts a 
				WHERE a.user_id = @user_id::uuid 
					AND a.created_at > NOW() - INTERVAL '24 hours'
			)
		ORDER BY RANDOM()
		LIMIT 1
	`

	args := pgx.NamedArgs{
		"section": section,
		"user_id": userID,
	}

	rows, err := r.server.DB.Pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}

	q, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[question.Question])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			// Fallback: get any random question from section if all were attempted
			return r.getRandomFromSection(ctx, section)
		}
		return nil, fmt.Errorf("failed to collect row: %w", err)
	}

	return &q, nil
}

// getRandomFromSection gets a random question from a section (fallback)
func (r *QuestionRepository) getRandomFromSection(ctx context.Context, section string) (*question.Question, error) {
	stmt := `
		SELECT id, question_bank_id, section, sub_type, 
			difficulty_irt, discrimination, guessing_param,
			text, option_a, option_b, option_c, option_d, option_e, correct_answer,
			explanation, explanation_en, strategy_tip, related_concept, solution_steps,
			is_active, attempt_count, correct_rate, avg_time_seconds,
			created_at, updated_at, deleted_at
		FROM questions 
		WHERE section = @section AND deleted_at IS NULL AND is_active = true
		ORDER BY RANDOM()
		LIMIT 1
	`

	rows, err := r.server.DB.Pool.Query(ctx, stmt, pgx.NamedArgs{"section": section})
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}

	q, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[question.Question])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errs.NewNotFoundError("no questions available for this section", false, nil)
		}
		return nil, fmt.Errorf("failed to collect row: %w", err)
	}

	return &q, nil
}
