package readiness

import (
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

// === Request DTOs ===

// GetUserReadinessRequest represents path/query params for getting user readiness
type GetUserReadinessRequest struct {
	Section string `param:"section" validate:"omitempty,oneof=PU PPU PBM PK LBI LBE PM"`
}

func (r *GetUserReadinessRequest) Validate() error {
	validate := validator.New()
	return validate.Struct(r)
}

// GetSectionReadinessRequest represents path params for getting section-specific readiness
type GetSectionReadinessRequest struct {
	Section string `param:"section" validate:"required,oneof=PU PPU PBM PK LBI LBE PM"`
}

func (r *GetSectionReadinessRequest) Validate() error {
	validate := validator.New()
	return validate.Struct(r)
}

// CreateUserReadinessRequest represents the request body for creating readiness record
type CreateUserReadinessRequest struct {
	UserID              uuid.UUID `json:"userId" validate:"required"`
	Section             string    `json:"section" validate:"required,oneof=PU PPU PBM PK LBI LBE PM"`
	ReadinessPercentage float64   `json:"readinessPercentage"`
	PredictedScoreLow   int       `json:"predictedScoreLow"`
	PredictedScoreHigh  int       `json:"predictedScoreHigh"`
}

func (r *CreateUserReadinessRequest) Validate() error {
	validate := validator.New()
	return validate.Struct(r)
}

// BulkCreateUserReadinessRequest represents bulk creation of readiness records
type BulkCreateUserReadinessRequest struct {
	UserID    uuid.UUID                    `json:"userId" validate:"required"`
	Readiness []CreateUserReadinessRequest `json:"readiness" validate:"required,dive"`
}

func (r *BulkCreateUserReadinessRequest) Validate() error {
	validate := validator.New()
	return validate.Struct(r)
}

// UpdateUserReadinessRequest represents the request body for updating readiness
type UpdateUserReadinessRequest struct {
	TargetTheta *float64 `json:"target_theta" validate:"omitempty,min=-3,max=3"`
}

func (r *UpdateUserReadinessRequest) Validate() error {
	validate := validator.New()
	return validate.Struct(r)
}

// === Response DTOs ===

// ReadinessResponse represents the API response for a single section readiness
type ReadinessResponse struct {
	Section string `json:"section"`

	// Accuracy metrics
	OverallAccuracy float64 `json:"overall_accuracy"`
	RecentAccuracy  float64 `json:"recent_accuracy"`

	// Readiness metrics
	ReadinessPercentage float64 `json:"readiness_percentage"`
	CurrentTheta        float64 `json:"current_theta"`
	TargetTheta         float64 `json:"target_theta"`

	// Predictions
	PredictedScoreLow  int     `json:"predicted_score_low"`
	PredictedScoreHigh int     `json:"predicted_score_high"`
	DaysToReady        *int    `json:"days_to_ready,omitempty"`
	ReadyByDate        *string `json:"ready_by_date,omitempty"`

	// Progress stats
	TotalAttempts          int      `json:"total_attempts"`
	TotalCorrect           int      `json:"total_correct"`
	ImprovementRatePerWeek *float64 `json:"improvement_rate_per_week,omitempty"`

	// Activity
	AvgTimeSeconds *float64 `json:"avg_time_seconds,omitempty"`
	LastPracticed  *string  `json:"last_practiced,omitempty"`
}

// ReadinessOverviewResponse represents overall readiness across all sections
type ReadinessOverviewResponse struct {
	OverallReadiness    float64                      `json:"overall_readiness"`
	TotalAttempts       int                          `json:"total_attempts"`
	TotalCorrect        int                          `json:"total_correct"`
	OverallAccuracy     float64                      `json:"overall_accuracy"`
	SectionReadiness    map[string]ReadinessResponse `json:"section_readiness"`
	TPSReadiness        float64                      `json:"tps_readiness"`
	LiterasiReadiness   float64                      `json:"literasi_readiness"`
	WeakestSection      *string                      `json:"weakest_section,omitempty"`
	StrongestSection    *string                      `json:"strongest_section,omitempty"`
	RecommendedPractice *string                      `json:"recommended_practice,omitempty"`
}

// SectionDetailResponse represents detailed readiness for a specific section
type SectionDetailResponse struct {
	ReadinessResponse

	// Subtype breakdown
	SubtypeBreakdown []SubtypeAccuracyResponse `json:"subtype_breakdown,omitempty"`

	// Trend data (last 30 days)
	AccuracyTrend []AccuracyTrendPoint `json:"accuracy_trend,omitempty"`

	// Next steps recommendation
	NextSteps *NextStepsResponse `json:"next_steps,omitempty"`
}

// SubtypeAccuracyResponse represents accuracy for a question subtype
type SubtypeAccuracyResponse struct {
	SubType       string  `json:"sub_type"`
	TotalAttempts int     `json:"total_attempts"`
	CorrectCount  int     `json:"correct_count"`
	Accuracy      float64 `json:"accuracy"`
	IsWeakArea    bool    `json:"is_weak_area"`
}

// AccuracyTrendPoint represents a single point in accuracy trend
type AccuracyTrendPoint struct {
	Date     string  `json:"date"`
	Accuracy float64 `json:"accuracy"`
	Attempts int     `json:"attempts"`
}

// NextStepsResponse represents recommendations for the user
type NextStepsResponse struct {
	IsReady                 bool    `json:"is_ready"`
	Message                 string  `json:"message"`
	EstimatedCompletionDate *string `json:"estimated_completion_date,omitempty"`
	SuggestedDailyPractice  *int    `json:"suggested_daily_practice,omitempty"`
}

// === Converters ===

// ToResponse converts UserReadiness to ReadinessResponse
func (r *UserReadiness) ToResponse() ReadinessResponse {
	resp := ReadinessResponse{
		Section:            r.Section,
		TotalAttempts:      r.TotalAttemptsCount,
		TotalCorrect:       r.TotalCorrectCount,
		PredictedScoreLow:  500, // default
		PredictedScoreHigh: 550, // default
	}

	// Handle nullable fields
	if r.OverallAccuracy != nil {
		resp.OverallAccuracy = *r.OverallAccuracy
	}
	if r.RecentAccuracy != nil {
		resp.RecentAccuracy = *r.RecentAccuracy
	}
	if r.ReadinessPercentage != nil {
		resp.ReadinessPercentage = *r.ReadinessPercentage
	}
	if r.CurrentTheta != nil {
		resp.CurrentTheta = *r.CurrentTheta
	}
	if r.TargetTheta != nil {
		resp.TargetTheta = *r.TargetTheta
	} else {
		resp.TargetTheta = 0.5 // default target
	}
	if r.PredictedScoreLow != nil {
		resp.PredictedScoreLow = *r.PredictedScoreLow
	}
	if r.PredictedScoreHigh != nil {
		resp.PredictedScoreHigh = *r.PredictedScoreHigh
	}
	if r.DaysToReady != nil {
		resp.DaysToReady = r.DaysToReady
	}
	if r.ReadyByDate != nil {
		date := r.ReadyByDate.Format("2006-01-02")
		resp.ReadyByDate = &date
	}
	if r.ImprovementRatePerWeek != nil {
		resp.ImprovementRatePerWeek = r.ImprovementRatePerWeek
	}

	return resp
}

// ToResponseWithStats converts UserReadinessWithStats to ReadinessResponse
func (r *UserReadinessWithStats) ToResponse() ReadinessResponse {
	resp := r.UserReadiness.ToResponse()

	if r.AvgTimeSeconds != nil {
		resp.AvgTimeSeconds = r.AvgTimeSeconds
	}
	if r.LastPracticed != nil {
		lastPracticed := r.LastPracticed.Format("2006-01-02T15:04:05Z")
		resp.LastPracticed = &lastPracticed
	}

	return resp
}

// ToSubtypeResponse converts SubtypeAccuracy to SubtypeAccuracyResponse
func (s *SubtypeAccuracy) ToResponse() SubtypeAccuracyResponse {
	return SubtypeAccuracyResponse{
		SubType:       s.SubType,
		TotalAttempts: s.TotalAttempts,
		CorrectCount:  s.CorrectCount,
		Accuracy:      s.Accuracy,
		IsWeakArea:    s.Accuracy < 0.6, // Consider weak if below 60%
	}
}
