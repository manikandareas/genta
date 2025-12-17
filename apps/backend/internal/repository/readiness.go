package repository

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/manikandareas/genta/internal/errs"
	"github.com/manikandareas/genta/internal/model/readiness"
	"github.com/manikandareas/genta/internal/server"
)

type ReadinessRepository struct {
	server *server.Server
}

func NewReadinessRepository(server *server.Server) *ReadinessRepository {
	return &ReadinessRepository{server: server}
}

// CreateInitialReadiness creates default readiness records for all sections
func (r *ReadinessRepository) CreateInitialReadiness(ctx context.Context, userID uuid.UUID) ([]readiness.UserReadiness, error) {
	sections := readiness.DefaultSections()
	defaultReadiness := readiness.NewDefaultSectionReadiness()

	batch := &pgx.Batch{}
	stmt := `
		INSERT INTO user_readiness (user_id, section, readiness_percentage, predicted_score_low, predicted_score_high)
		VALUES (@user_id, @section, @readiness_percentage, @predicted_score_low, @predicted_score_high)
		ON CONFLICT (user_id, section) DO UPDATE SET
			readiness_percentage = EXCLUDED.readiness_percentage,
			predicted_score_low = EXCLUDED.predicted_score_low,
			predicted_score_high = EXCLUDED.predicted_score_high,
			last_updated = NOW()
		RETURNING *
	`

	for _, section := range sections {
		args := pgx.NamedArgs{
			"user_id":              userID,
			"section":              section,
			"readiness_percentage": defaultReadiness.ReadinessPercentage,
			"predicted_score_low":  defaultReadiness.PredictedScoreLow,
			"predicted_score_high": defaultReadiness.PredictedScoreHigh,
		}
		batch.Queue(stmt, args)
	}

	results := r.server.DB.Pool.SendBatch(ctx, batch)
	defer results.Close()

	var createdReadiness []readiness.UserReadiness
	for range sections {
		rows, err := results.Query()
		if err != nil {
			return nil, fmt.Errorf("failed to execute batch query: %w", err)
		}

		ur, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[readiness.UserReadiness])
		if err != nil {
			return nil, fmt.Errorf("failed to collect row: %w", err)
		}
		createdReadiness = append(createdReadiness, ur)
	}

	return createdReadiness, nil
}

// GetUserReadiness retrieves all readiness records for a user
func (r *ReadinessRepository) GetUserReadiness(ctx context.Context, userID uuid.UUID) ([]readiness.UserReadiness, error) {
	stmt := `SELECT * FROM user_readiness WHERE user_id = @user_id ORDER BY section`

	rows, err := r.server.DB.Pool.Query(ctx, stmt, pgx.NamedArgs{"user_id": userID})
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}

	userReadiness, err := pgx.CollectRows(rows, pgx.RowToStructByName[readiness.UserReadiness])
	if err != nil {
		return nil, fmt.Errorf("failed to collect rows: %w", err)
	}

	return userReadiness, nil
}

// GetBySection retrieves readiness for a specific section
func (r *ReadinessRepository) GetBySection(ctx context.Context, userID uuid.UUID, section string) (*readiness.UserReadiness, error) {
	stmt := `
		SELECT * FROM user_readiness
		WHERE user_id = @user_id AND section = @section
	`

	args := pgx.NamedArgs{
		"user_id": userID,
		"section": section,
	}

	rows, err := r.server.DB.Pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}

	ur, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[readiness.UserReadiness])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errs.NewNotFoundError("readiness not found for section", false, nil)
		}
		return nil, fmt.Errorf("failed to collect row: %w", err)
	}

	return &ur, nil
}

// GetWithStats retrieves readiness with computed stats (avg time, last practiced)
func (r *ReadinessRepository) GetWithStats(ctx context.Context, userID uuid.UUID, section string) (*readiness.UserReadinessWithStats, error) {
	stmt := `
		SELECT 
			ur.*,
			(
				SELECT AVG(a.time_spent_seconds)::DECIMAL(10,2)
				FROM attempts a
				JOIN questions q ON a.question_id = q.id
				WHERE a.user_id = ur.user_id AND q.section = ur.section
			) as avg_time_seconds,
			(
				SELECT MAX(a.created_at)
				FROM attempts a
				JOIN questions q ON a.question_id = q.id
				WHERE a.user_id = ur.user_id AND q.section = ur.section
			) as last_practiced
		FROM user_readiness ur
		WHERE ur.user_id = @user_id AND ur.section = @section
	`

	args := pgx.NamedArgs{
		"user_id": userID,
		"section": section,
	}

	rows, err := r.server.DB.Pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}

	ur, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[readiness.UserReadinessWithStats])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errs.NewNotFoundError("readiness not found for section", false, nil)
		}
		return nil, fmt.Errorf("failed to collect row: %w", err)
	}

	return &ur, nil
}

// GetAllWithStats retrieves all readiness records with computed stats
func (r *ReadinessRepository) GetAllWithStats(ctx context.Context, userID uuid.UUID) ([]readiness.UserReadinessWithStats, error) {
	stmt := `
		SELECT 
			ur.*,
			(
				SELECT AVG(a.time_spent_seconds)::DECIMAL(10,2)
				FROM attempts a
				JOIN questions q ON a.question_id = q.id
				WHERE a.user_id = ur.user_id AND q.section = ur.section
			) as avg_time_seconds,
			(
				SELECT MAX(a.created_at)
				FROM attempts a
				JOIN questions q ON a.question_id = q.id
				WHERE a.user_id = ur.user_id AND q.section = ur.section
			) as last_practiced
		FROM user_readiness ur
		WHERE ur.user_id = @user_id
		ORDER BY ur.section
	`

	rows, err := r.server.DB.Pool.Query(ctx, stmt, pgx.NamedArgs{"user_id": userID})
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}

	results, err := pgx.CollectRows(rows, pgx.RowToStructByName[readiness.UserReadinessWithStats])
	if err != nil {
		return nil, fmt.Errorf("failed to collect rows: %w", err)
	}

	return results, nil
}

// GetSubtypeAccuracy retrieves accuracy breakdown by question subtype for a section
func (r *ReadinessRepository) GetSubtypeAccuracy(ctx context.Context, userID uuid.UUID, section string) ([]readiness.SubtypeAccuracy, error) {
	stmt := `
		SELECT 
			q.sub_type,
			COUNT(a.id) as total_attempts,
			SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END) as correct_count
		FROM attempts a
		JOIN questions q ON a.question_id = q.id
		WHERE a.user_id = @user_id 
			AND q.section = @section
			AND q.sub_type IS NOT NULL
			AND a.deleted_at IS NULL
		GROUP BY q.sub_type
		ORDER BY q.sub_type
	`

	args := pgx.NamedArgs{
		"user_id": userID,
		"section": section,
	}

	rows, err := r.server.DB.Pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}

	results, err := pgx.CollectRows(rows, pgx.RowToStructByName[readiness.SubtypeAccuracy])
	if err != nil {
		return nil, fmt.Errorf("failed to collect rows: %w", err)
	}

	// Calculate accuracy for each subtype
	for i := range results {
		if results[i].TotalAttempts > 0 {
			results[i].Accuracy = float64(results[i].CorrectCount) / float64(results[i].TotalAttempts)
		}
	}

	return results, nil
}

// GetAccuracyTrend retrieves daily accuracy trend for last N days
func (r *ReadinessRepository) GetAccuracyTrend(ctx context.Context, userID uuid.UUID, section string, days int) ([]readiness.AccuracyTrendPoint, error) {
	stmt := `
		SELECT 
			DATE(a.created_at) as date,
			CASE 
				WHEN COUNT(a.id) > 0 
				THEN (SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END)::DECIMAL / COUNT(a.id))
				ELSE 0 
			END as accuracy,
			COUNT(a.id) as attempts
		FROM attempts a
		JOIN questions q ON a.question_id = q.id
		WHERE a.user_id = @user_id 
			AND q.section = @section
			AND a.created_at >= NOW() - INTERVAL '1 day' * @days
			AND a.deleted_at IS NULL
		GROUP BY DATE(a.created_at)
		ORDER BY DATE(a.created_at)
	`

	args := pgx.NamedArgs{
		"user_id": userID,
		"section": section,
		"days":    days,
	}

	rows, err := r.server.DB.Pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}

	// Custom scan for trend points
	var results []readiness.AccuracyTrendPoint
	for rows.Next() {
		var date time.Time
		var accuracy float64
		var attempts int

		if err := rows.Scan(&date, &accuracy, &attempts); err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}

		results = append(results, readiness.AccuracyTrendPoint{
			Date:     date.Format("2006-01-02"),
			Accuracy: accuracy,
			Attempts: attempts,
		})
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows error: %w", err)
	}

	return results, nil
}

// UpdateReadiness updates readiness stats for a section (called after attempt)
func (r *ReadinessRepository) UpdateReadiness(ctx context.Context, userID uuid.UUID, section string) error {
	stmt := `
		UPDATE user_readiness
		SET 
			-- Update total stats from all attempts
			total_attempts_count = (
				SELECT COUNT(a.id)
				FROM attempts a
				JOIN questions q ON a.question_id = q.id
				WHERE a.user_id = @user_id AND q.section = @section AND a.deleted_at IS NULL
			),
			total_correct_count = (
				SELECT COALESCE(SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END), 0)
				FROM attempts a
				JOIN questions q ON a.question_id = q.id
				WHERE a.user_id = @user_id AND q.section = @section AND a.deleted_at IS NULL
			),
			overall_accuracy = (
				SELECT CASE 
					WHEN COUNT(a.id) > 0 
					THEN (SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END)::DECIMAL / COUNT(a.id))
					ELSE NULL 
				END
				FROM attempts a
				JOIN questions q ON a.question_id = q.id
				WHERE a.user_id = @user_id AND q.section = @section AND a.deleted_at IS NULL
			),
			-- Update recent stats (last 30 days)
			recent_attempts_count = (
				SELECT COUNT(a.id)
				FROM attempts a
				JOIN questions q ON a.question_id = q.id
				WHERE a.user_id = @user_id AND q.section = @section 
					AND a.created_at >= NOW() - INTERVAL '30 days'
					AND a.deleted_at IS NULL
			),
			recent_correct_count = (
				SELECT COALESCE(SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END), 0)
				FROM attempts a
				JOIN questions q ON a.question_id = q.id
				WHERE a.user_id = @user_id AND q.section = @section 
					AND a.created_at >= NOW() - INTERVAL '30 days'
					AND a.deleted_at IS NULL
			),
			recent_accuracy = (
				SELECT CASE 
					WHEN COUNT(a.id) > 0 
					THEN (SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END)::DECIMAL / COUNT(a.id))
					ELSE NULL 
				END
				FROM attempts a
				JOIN questions q ON a.question_id = q.id
				WHERE a.user_id = @user_id AND q.section = @section 
					AND a.created_at >= NOW() - INTERVAL '30 days'
					AND a.deleted_at IS NULL
			),
			last_updated = NOW()
		WHERE user_id = @user_id AND section = @section
	`

	args := pgx.NamedArgs{
		"user_id": userID,
		"section": section,
	}

	_, err := r.server.DB.Pool.Exec(ctx, stmt, args)
	if err != nil {
		return fmt.Errorf("failed to update readiness: %w", err)
	}

	return nil
}

// UpdateTargetTheta updates the target theta for a section
func (r *ReadinessRepository) UpdateTargetTheta(ctx context.Context, userID uuid.UUID, section string, targetTheta float64) error {
	stmt := `
		UPDATE user_readiness
		SET target_theta = @target_theta, last_updated = NOW()
		WHERE user_id = @user_id AND section = @section
	`

	args := pgx.NamedArgs{
		"user_id":      userID,
		"section":      section,
		"target_theta": targetTheta,
	}

	result, err := r.server.DB.Pool.Exec(ctx, stmt, args)
	if err != nil {
		return fmt.Errorf("failed to update target theta: %w", err)
	}

	if result.RowsAffected() == 0 {
		return errs.NewNotFoundError("readiness not found for section", false, nil)
	}

	return nil
}

// UpdateThetaAndReadiness updates current theta and recalculates readiness percentage
func (r *ReadinessRepository) UpdateThetaAndReadiness(ctx context.Context, userID uuid.UUID, section string, currentTheta float64) error {
	stmt := `
		UPDATE user_readiness
		SET 
			current_theta = @current_theta,
			readiness_percentage = CASE 
				WHEN target_theta IS NOT NULL AND target_theta != 0 
				THEN LEAST((@current_theta / target_theta) * 100, 100)
				ELSE 0 
			END,
			last_updated = NOW()
		WHERE user_id = @user_id AND section = @section
	`

	args := pgx.NamedArgs{
		"user_id":       userID,
		"section":       section,
		"current_theta": currentTheta,
	}

	_, err := r.server.DB.Pool.Exec(ctx, stmt, args)
	if err != nil {
		return fmt.Errorf("failed to update theta and readiness: %w", err)
	}

	return nil
}

// GetOverallStats retrieves aggregated stats across all sections
func (r *ReadinessRepository) GetOverallStats(ctx context.Context, userID uuid.UUID) (totalAttempts int, totalCorrect int, err error) {
	stmt := `
		SELECT 
			COALESCE(SUM(total_attempts_count), 0) as total_attempts,
			COALESCE(SUM(total_correct_count), 0) as total_correct
		FROM user_readiness
		WHERE user_id = @user_id
	`

	err = r.server.DB.Pool.QueryRow(ctx, stmt, pgx.NamedArgs{"user_id": userID}).Scan(&totalAttempts, &totalCorrect)
	if err != nil {
		return 0, 0, fmt.Errorf("failed to get overall stats: %w", err)
	}

	return totalAttempts, totalCorrect, nil
}
