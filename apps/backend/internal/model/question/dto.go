package question

import (
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
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
	Section *string `query:"section" validate:"omitempty,oneof=PU PPU PBM PK LBI LBE PM"`
	Page    int     `query:"page" validate:"min=1"`
	Limit   int     `query:"limit" validate:"min=1,max=100"`
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
	ID             uuid.UUID `json:"id"`
	Section        Section   `json:"section"`
	SubType        *string   `json:"subType"`
	DifficultyIRT  *float64  `json:"difficultyIrt,omitempty"`
	Text           string    `json:"text"`
	OptionA        string    `json:"optionA"`
	OptionB        string    `json:"optionB"`
	OptionC        string    `json:"optionC"`
	OptionD        string    `json:"optionD"`
	OptionE        string    `json:"optionE"`
	AvgTimeSeconds *int16    `json:"avgTimeSeconds,omitempty"`
}

// QuestionDetailResponse includes correct answer and explanation (after answering)
type QuestionDetailResponse struct {
	QuestionResponse
	CorrectAnswer  string          `json:"correctAnswer"`
	Explanation    *string         `json:"explanation"`
	ExplanationEn  *string         `json:"explanationEn,omitempty"`
	StrategyTip    *string         `json:"strategyTip,omitempty"`
	SolutionSteps  *[]SolutionStep `json:"solutionSteps,omitempty"`
	RelatedConcept *string         `json:"relatedConcept,omitempty"`
}

// === Converters ===

// ToResponse converts Question to QuestionResponse (hides correct answer)
func (q *Question) ToResponse() QuestionResponse {
	return QuestionResponse{
		ID:             q.ID,
		Section:        q.Section,
		SubType:        q.SubType,
		DifficultyIRT:  q.DifficultyIRT,
		Text:           q.Text,
		OptionA:        q.OptionA,
		OptionB:        q.OptionB,
		OptionC:        q.OptionC,
		OptionD:        q.OptionD,
		OptionE:        q.OptionE,
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
