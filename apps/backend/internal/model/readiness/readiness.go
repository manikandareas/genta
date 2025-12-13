package readiness

import (
	"time"

	"github.com/google/uuid"
)

type UserReadiness struct {
	UserID  uuid.UUID `json:"userId" db:"user_id"`
	Section string    `json:"section" db:"section"`

	RecentAttemptsCount int      `json:"recentAttemptsCount" db:"recent_attempts_count"`
	RecentCorrectCount  int      `json:"recentCorrectCount" db:"recent_correct_count"`
	RecentAccuracy      *float64 `json:"recentAccuracy" db:"recent_accuracy"`

	TotalAttemptsCount int      `json:"totalAttemptsCount" db:"total_attempts_count"`
	TotalCorrectCount  int      `json:"totalCorrectCount" db:"total_correct_count"`
	OverallAccuracy    *float64 `json:"overallAccuracy" db:"overall_accuracy"`

	CurrentTheta        *float64 `json:"currentTheta" db:"current_theta"`
	TargetTheta         *float64 `json:"targetTheta" db:"target_theta"`
	ReadinessPercentage *float64 `json:"readinessPercentage" db:"readiness_percentage"`

	PredictedScoreLow  *int       `json:"predictedScoreLow" db:"predicted_score_low"`
	PredictedScoreHigh *int       `json:"predictedScoreHigh" db:"predicted_score_high"`
	ReadyByDate        *time.Time `json:"readyByDate" db:"ready_by_date"`

	ImprovementRatePerWeek *float64 `json:"improvementRatePerWeek" db:"improvement_rate_per_week"`
	DaysToReady            *int     `json:"daysToReady" db:"days_to_ready"`

	LastUpdated    *time.Time `json:"lastUpdated" db:"last_updated"`
	UpdatedByJobID *string    `json:"updatedByJobId" db:"updated_by_job_id"`
}

// SectionReadiness represents readiness data for API response
type SectionReadiness struct {
	ReadinessPercentage float64 `json:"readiness_percentage"`
	PredictedScoreLow   int     `json:"predicted_score_low"`
	PredictedScoreHigh  int     `json:"predicted_score_high"`
}

// InitialReadiness represents the initial readiness map for all sections
type InitialReadiness map[string]SectionReadiness

// DefaultSections returns all UTBK sections
func DefaultSections() []string {
	return []string{"PU", "PPU", "PBM", "PK", "LBI", "LBE", "PM"}
}

// NewDefaultSectionReadiness creates default readiness for a new user
func NewDefaultSectionReadiness() SectionReadiness {
	return SectionReadiness{
		ReadinessPercentage: 0,
		PredictedScoreLow:   500,
		PredictedScoreHigh:  550,
	}
}

// NewDefaultInitialReadiness creates default initial readiness for all sections
func NewDefaultInitialReadiness() InitialReadiness {
	readiness := make(InitialReadiness)
	for _, section := range DefaultSections() {
		readiness[section] = NewDefaultSectionReadiness()
	}
	return readiness
}
