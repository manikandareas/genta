package analytics

import (
	"github.com/go-playground/validator/v10"
)

// === Request DTOs ===

// GetProgressRequest represents query params for getting progress analytics
type GetProgressRequest struct {
	Days    int    `query:"days" validate:"omitempty,oneof=7 30 90"`
	Section string `query:"section" validate:"omitempty,oneof=PU PPU PBM PK LBI LBE PM"`
}

func (r *GetProgressRequest) Validate() error {
	validate := validator.New()
	return validate.Struct(r)
}

// SetDefaults sets default values for the request
func (r *GetProgressRequest) SetDefaults() {
	if r.Days == 0 {
		r.Days = 7
	}
}

// === Response DTOs ===

// AccuracyTrendResponse represents a single point in accuracy trend
type AccuracyTrendResponse struct {
	Date     string  `json:"date"`
	Accuracy float64 `json:"accuracy"`
	Attempts int     `json:"attempts"`
}

// SectionBreakdownResponse represents accuracy breakdown for a section
type SectionBreakdownResponse struct {
	Section        string  `json:"section"`
	SectionName    string  `json:"section_name"`
	Attempts       int     `json:"attempts"`
	Correct        int     `json:"correct"`
	Accuracy       float64 `json:"accuracy"`
	AvgTimeSeconds float64 `json:"avg_time_seconds"`
}

// ProgressResponse represents the API response for progress analytics
type ProgressResponse struct {
	PeriodDays              int                        `json:"period_days"`
	TotalQuestionsAttempted int                        `json:"total_questions_attempted"`
	TotalCorrect            int                        `json:"total_correct"`
	AverageAccuracy         float64                    `json:"average_accuracy"`
	AccuracyTrend           []AccuracyTrendResponse    `json:"accuracy_trend"`
	SectionBreakdown        []SectionBreakdownResponse `json:"section_breakdown"`
	ImprovementThisWeek     float64                    `json:"improvement_this_week"`
}

// === Converters ===

// ToResponse converts ProgressAnalytics to ProgressResponse
func (p *ProgressAnalytics) ToResponse() ProgressResponse {
	resp := ProgressResponse{
		PeriodDays:              p.PeriodDays,
		TotalQuestionsAttempted: p.TotalQuestionsAttempted,
		TotalCorrect:            p.TotalCorrect,
		AverageAccuracy:         p.AverageAccuracy,
		ImprovementThisWeek:     p.ImprovementThisWeek,
		AccuracyTrend:           make([]AccuracyTrendResponse, 0, len(p.AccuracyTrend)),
		SectionBreakdown:        make([]SectionBreakdownResponse, 0, len(p.SectionBreakdown)),
	}

	// Convert accuracy trend
	for _, trend := range p.AccuracyTrend {
		resp.AccuracyTrend = append(resp.AccuracyTrend, AccuracyTrendResponse{
			Date:     trend.Date.Format("2006-01-02"),
			Accuracy: trend.Accuracy,
			Attempts: trend.Attempts,
		})
	}

	// Convert section breakdown
	for _, section := range p.SectionBreakdown {
		resp.SectionBreakdown = append(resp.SectionBreakdown, SectionBreakdownResponse{
			Section:        section.Section,
			SectionName:    section.SectionName,
			Attempts:       section.Attempts,
			Correct:        section.Correct,
			Accuracy:       section.Accuracy,
			AvgTimeSeconds: section.AvgTimeSeconds,
		})
	}

	return resp
}

// ToSectionBreakdownResponse converts SectionBreakdown to SectionBreakdownResponse
func (s *SectionBreakdown) ToResponse() SectionBreakdownResponse {
	return SectionBreakdownResponse{
		Section:        s.Section,
		SectionName:    s.SectionName,
		Attempts:       s.Attempts,
		Correct:        s.Correct,
		Accuracy:       s.Accuracy,
		AvgTimeSeconds: s.AvgTimeSeconds,
	}
}
