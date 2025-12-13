package readiness

import "github.com/google/uuid"

type CreateUserReadinessRequest struct {
	UserID              uuid.UUID `json:"userId" validate:"required"`
	Section             string    `json:"section" validate:"required,oneof=PU PPU PBM PK LBI LBE PM"`
	ReadinessPercentage float64   `json:"readinessPercentage"`
	PredictedScoreLow   int       `json:"predictedScoreLow"`
	PredictedScoreHigh  int       `json:"predictedScoreHigh"`
}

type BulkCreateUserReadinessRequest struct {
	UserID    uuid.UUID                    `json:"userId" validate:"required"`
	Readiness []CreateUserReadinessRequest `json:"readiness" validate:"required,dive"`
}
