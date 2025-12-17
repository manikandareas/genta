package question

import (
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/manikandareas/genta/internal/model"
)

// === Request DTOs ===

// GetQuestionRequest represents path params for getting a question
type GetQuestionRequest struct {
	ID string `param:"id" validate:"required,uuid"`
}

func (r *GetQuestionRequest) Validate() error {
	validate := validator.New()
	return validate.Struct(r)
}

// ListQuestionsRequest represents query params for listing questions
type ListQuestionsRequest struct {
	Section       *string  `query:"section" validate:"omitempty,oneof=PU PPU PBM PK LBI LBE PM"`
	SubType       *string  `query:"sub_type" validate:"omitempty"`
	DifficultyMin *float64 `query:"difficulty_min" validate:"omitempty"`
	DifficultyMax *float64 `query:"difficulty_max" validate:"omitempty"`
	IsReviewed    *bool    `query:"is_reviewed" validate:"omitempty"`
	Page          int      `query:"page" validate:"min=1"`
	Limit         int      `query:"limit" validate:"min=1,max=100"`
}

func (r *ListQuestionsRequest) Validate() error {
	// Set defaults
	if r.Page == 0 {
		r.Page = 1
	}
	if r.Limit == 0 {
		r.Limit = 10
	}

	validate := validator.New()
	return validate.Struct(r)
}

// GetNextQuestionRequest represents query params for getting next question
type GetNextQuestionRequest struct {
	Section string `query:"section" validate:"required,oneof=PU PPU PBM PK LBI LBE PM"`
}

func (r *GetNextQuestionRequest) Validate() error {
	validate := validator.New()
	return validate.Struct(r)
}

// === Response DTOs ===

// QuestionResponse represents the API response for a question (without correct answer for practice)
type QuestionResponse struct {
	ID             uuid.UUID     `json:"id"`
	Section        model.Section `json:"section"`
	SubType        *string       `json:"sub_type"`
	Text           string        `json:"text"`
	Options        []string      `json:"options"`
	DifficultyIRT  *float64      `json:"difficulty_irt,omitempty"`
	Discrimination *float64      `json:"discrimination,omitempty"`
	AttemptCount   *int          `json:"attempt_count,omitempty"`
	CorrectRate    *float64      `json:"correct_rate,omitempty"`
	AvgTimeSeconds *int16        `json:"avg_time_seconds,omitempty"`
}

// QuestionDetailResponse includes correct answer and explanation (after answering)
type QuestionDetailResponse struct {
	QuestionResponse
	CorrectAnswer  string          `json:"correct_answer"`
	Explanation    *string         `json:"explanation"`
	ExplanationEn  *string         `json:"explanation_en,omitempty"`
	StrategyTip    *string         `json:"strategy_tip,omitempty"`
	SolutionSteps  *[]SolutionStep `json:"solution_steps,omitempty"`
	RelatedConcept *string         `json:"related_concept,omitempty"`
}

// === Converters ===

// ToResponse converts Question to QuestionResponse (hides correct answer)
func (q *Question) ToResponse() QuestionResponse {
	return QuestionResponse{
		ID:             q.ID,
		Section:        q.Section,
		SubType:        q.SubType,
		Text:           q.Text,
		Options:        []string{q.OptionA, q.OptionB, q.OptionC, q.OptionD, q.OptionE},
		DifficultyIRT:  q.DifficultyIRT,
		Discrimination: q.Discrimination,
		AttemptCount:   q.AttemptCount,
		CorrectRate:    q.CorrectRate,
		AvgTimeSeconds: q.AvgTimeSeconds,
	}
}

// ToDetailResponse converts Question to QuestionDetailResponse (includes answer)
func (q *Question) ToDetailResponse() QuestionDetailResponse {
	return QuestionDetailResponse{
		QuestionResponse: q.ToResponse(),
		CorrectAnswer:    q.CorrectAnswer,
		Explanation:      q.Explanation,
		ExplanationEn:    q.ExplanationEn,
		StrategyTip:      q.StrategyTip,
		SolutionSteps:    q.SolutionSteps,
		RelatedConcept:   q.RelatedConcept,
	}
}
