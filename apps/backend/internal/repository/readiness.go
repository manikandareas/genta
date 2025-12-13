package repository

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/manikandareas/genta/internal/model/readiness"
	"github.com/manikandareas/genta/internal/server"
)

type ReadinessRepository struct {
	server *server.Server
}

func NewReadinessRepository(server *server.Server) *ReadinessRepository {
	return &ReadinessRepository{server: server}
}

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
