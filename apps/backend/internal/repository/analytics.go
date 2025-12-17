package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/manikandareas/genta/internal/model/analytics"
	"github.com/manikandareas/genta/internal/server"
)

type AnalyticsRepository struct {
	server *server.Server
}

func NewAnalyticsRepository(server *server.Server) *AnalyticsRepository {
	return &AnalyticsRepository{server: server}
}

// GetProgressAnalytics retrieves progress analytics for a user within a time period
func (r *AnalyticsRepository) GetProgressAnalytics(ctx context.Context, userID uuid.UUID, days int, section string) (*analytics.ProgressAnalytics, error) {
	startDate := time.Now().AddDate(0, 0, -days)

	// Get total stats
	totalStats, err := r.getTotalStats(ctx, userID, startDate, section)
	if err != nil {
		return nil, err
	}

	// Get accuracy trend
	accuracyTrend, err := r.getAccuracyTrend(ctx, userID, startDate, section)
	if err != nil {
		return nil, err
	}

	// Get section breakdown
	sectionBreakdown, err := r.getSectionBreakdown(ctx, userID, startDate, section)
	if err != nil {
		return nil, err
	}

	// Calculate improvement this week
	improvement, err := r.calculateWeeklyImprovement(ctx, userID, section)
	if err != nil {
		return nil, err
	}

	return &analytics.ProgressAnalytics{
		PeriodDays:              days,
		TotalQuestionsAttempted: totalStats.TotalAttempts,
		TotalCorrect:            totalStats.TotalCorrect,
		AverageAccuracy:         totalStats.AverageAccuracy,
		AccuracyTrend:           accuracyTrend,
		SectionBreakdown:        sectionBreakdown,
		ImprovementThisWeek:     improvement,
	}, nil
}

type totalStatsResult struct {
	TotalAttempts   int
	TotalCorrect    int
	AverageAccuracy float64
}

func (r *AnalyticsRepository) getTotalStats(ctx context.Context, userID uuid.UUID, startDate time.Time, section string) (*totalStatsResult, error) {
	stmt := `
		SELECT 
			COUNT(*) as total_attempts,
			COALESCE(SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END), 0) as total_correct,
			COALESCE(AVG(CASE WHEN a.is_correct THEN 1.0 ELSE 0.0 END), 0) as average_accuracy
		FROM attempts a
		JOIN questions q ON a.question_id = q.id
		WHERE a.user_id = @user_id 
			AND a.created_at >= @start_date
			AND a.deleted_at IS NULL
	`

	args := pgx.NamedArgs{
		"user_id":    userID,
		"start_date": startDate,
	}

	if section != "" {
		stmt += " AND q.section = @section"
		args["section"] = section
	}

	var result totalStatsResult
	err := r.server.DB.Pool.QueryRow(ctx, stmt, args).Scan(
		&result.TotalAttempts,
		&result.TotalCorrect,
		&result.AverageAccuracy,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to get total stats: %w", err)
	}

	return &result, nil
}

func (r *AnalyticsRepository) getAccuracyTrend(ctx context.Context, userID uuid.UUID, startDate time.Time, section string) ([]analytics.DailyAccuracy, error) {
	stmt := `
		SELECT 
			DATE(a.created_at) as date,
			COALESCE(AVG(CASE WHEN a.is_correct THEN 1.0 ELSE 0.0 END), 0) as accuracy,
			COUNT(*) as attempts
		FROM attempts a
		JOIN questions q ON a.question_id = q.id
		WHERE a.user_id = @user_id 
			AND a.created_at >= @start_date
			AND a.deleted_at IS NULL
	`

	args := pgx.NamedArgs{
		"user_id":    userID,
		"start_date": startDate,
	}

	if section != "" {
		stmt += " AND q.section = @section"
		args["section"] = section
	}

	stmt += `
		GROUP BY DATE(a.created_at)
		ORDER BY DATE(a.created_at) ASC
	`

	rows, err := r.server.DB.Pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, fmt.Errorf("failed to get accuracy trend: %w", err)
	}
	defer rows.Close()

	var trend []analytics.DailyAccuracy
	for rows.Next() {
		var item analytics.DailyAccuracy
		if err := rows.Scan(&item.Date, &item.Accuracy, &item.Attempts); err != nil {
			return nil, fmt.Errorf("failed to scan accuracy trend row: %w", err)
		}
		trend = append(trend, item)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating accuracy trend rows: %w", err)
	}

	return trend, nil
}

func (r *AnalyticsRepository) getSectionBreakdown(ctx context.Context, userID uuid.UUID, startDate time.Time, filterSection string) ([]analytics.SectionBreakdown, error) {
	stmt := `
		SELECT 
			q.section,
			COUNT(*) as attempts,
			COALESCE(SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END), 0) as correct,
			COALESCE(AVG(CASE WHEN a.is_correct THEN 1.0 ELSE 0.0 END), 0) as accuracy,
			COALESCE(AVG(a.time_spent_seconds), 0) as avg_time_seconds
		FROM attempts a
		JOIN questions q ON a.question_id = q.id
		WHERE a.user_id = @user_id 
			AND a.created_at >= @start_date
			AND a.deleted_at IS NULL
	`

	args := pgx.NamedArgs{
		"user_id":    userID,
		"start_date": startDate,
	}

	if filterSection != "" {
		stmt += " AND q.section = @section"
		args["section"] = filterSection
	}

	stmt += `
		GROUP BY q.section
		ORDER BY q.section ASC
	`

	rows, err := r.server.DB.Pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, fmt.Errorf("failed to get section breakdown: %w", err)
	}
	defer rows.Close()

	var breakdown []analytics.SectionBreakdown
	for rows.Next() {
		var item analytics.SectionBreakdown
		if err := rows.Scan(&item.Section, &item.Attempts, &item.Correct, &item.Accuracy, &item.AvgTimeSeconds); err != nil {
			return nil, fmt.Errorf("failed to scan section breakdown row: %w", err)
		}
		item.SectionName = analytics.GetSectionName(item.Section)
		breakdown = append(breakdown, item)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating section breakdown rows: %w", err)
	}

	return breakdown, nil
}

func (r *AnalyticsRepository) calculateWeeklyImprovement(ctx context.Context, userID uuid.UUID, section string) (float64, error) {
	// Compare this week's accuracy vs last week's accuracy
	stmt := `
		WITH this_week AS (
			SELECT COALESCE(AVG(CASE WHEN a.is_correct THEN 1.0 ELSE 0.0 END), 0) as accuracy
			FROM attempts a
			JOIN questions q ON a.question_id = q.id
			WHERE a.user_id = @user_id 
				AND a.created_at >= NOW() - INTERVAL '7 days'
				AND a.deleted_at IS NULL
	`

	args := pgx.NamedArgs{
		"user_id": userID,
	}

	if section != "" {
		stmt += " AND q.section = @section"
		args["section"] = section
	}

	stmt += `
		),
		last_week AS (
			SELECT COALESCE(AVG(CASE WHEN a.is_correct THEN 1.0 ELSE 0.0 END), 0) as accuracy
			FROM attempts a
			JOIN questions q ON a.question_id = q.id
			WHERE a.user_id = @user_id 
				AND a.created_at >= NOW() - INTERVAL '14 days'
				AND a.created_at < NOW() - INTERVAL '7 days'
				AND a.deleted_at IS NULL
	`

	if section != "" {
		stmt += " AND q.section = @section"
	}

	stmt += `
		)
		SELECT 
			COALESCE((SELECT accuracy FROM this_week), 0) - COALESCE((SELECT accuracy FROM last_week), 0) as improvement
	`

	var improvement float64
	err := r.server.DB.Pool.QueryRow(ctx, stmt, args).Scan(&improvement)
	if err != nil {
		return 0, fmt.Errorf("failed to calculate weekly improvement: %w", err)
	}

	// Convert to percentage and round to 1 decimal
	return float64(int(improvement*1000)) / 10, nil
}
