package attempt

import (
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/manikandareas/genta/internal/model/question"
)

// === Request DTOs ===

// CreateAttemptRequest represents the request body for creating an attempt
type CreateAttemptRequest struct {
	QuestionID       string `json:"question_id" validate:"required,uuid"`
	SelectedAnswer   string `json:"selected_answer" validate:"required,oneof=A B C D E"`
	TimeSpentSeconds int16  `json:"time_spent_seconds" validate:"required,min=1,max=600"`
	SessionID        string `json:"session_id" validate:"required,max=100"`
}

func (r *CreateAttemptRequest) Validate() error {
	validate := validator.New()
	return validate.Struct(r)
}

// GetAttemptRequest represents path params for getting an attempt
type GetAttemptRequest struct {
	AttemptID string `param:"attempt_id" validate:"required,uuid"`
}

func (r *GetAttemptRequest) Validate() error {
	validate := validator.New()
	return validate.Struct(r)
}

// UpdateFeedbackRatingRequest represents the request body for rating feedback
type UpdateFeedbackRatingRequest struct {
	AttemptID string `param:"attempt_id" validate:"required,uuid"`
	IsHelpful bool   `json:"is_helpful"`
}

func (r *UpdateFeedbackRatingRequest) Validate() error {
	validate := validator.New()
	return validate.Struct(r)
}

// === Response DTOs ===

// AttemptResponse represents the API response for an attempt (after submission)
type AttemptResponse struct {
	ID                uuid.UUID `json:"id"`
	QuestionID        uuid.UUID `json:"question_id"`
	SelectedAnswer    string    `json:"selected_answer"`
	IsCorrect         bool      `json:"is_correct"`
	TimeSpentSeconds  int16     `json:"time_spent_seconds"`
	UserThetaBefore   *float64  `json:"user_theta_before"`
	UserThetaAfter    *float64  `json:"user_theta_after"`
	ThetaChange       *float64  `json:"theta_change"`
	FeedbackGenerated bool      `json:"feedback_generated"`
	SessionID         *string   `json:"session_id"`
	CreatedAt         string    `json:"created_at"`
}

// AttemptDetailResponse includes question and feedback details
type AttemptDetailResponse struct {
	ID               uuid.UUID          `json:"id"`
	QuestionID       uuid.UUID          `json:"question_id"`
	SelectedAnswer   string             `json:"selected_answer"`
	CorrectAnswer    string             `json:"correct_answer"`
	IsCorrect        bool               `json:"is_correct"`
	TimeSpentSeconds int16              `json:"time_spent_seconds"`
	ThetaChange      *float64           `json:"theta_change"`
	CreatedAt        string             `json:"created_at"`
	Question         *QuestionInAttempt `json:"question,omitempty"`
	Feedback         *FeedbackResponse  `json:"feedback,omitempty"`
}

// QuestionInAttempt represents question data embedded in attempt response
type QuestionInAttempt struct {
	ID          uuid.UUID `json:"id"`
	Text        string    `json:"text"`
	Options     []string  `json:"options"`
	Explanation *string   `json:"explanation,omitempty"`
}

// FeedbackResponse represents feedback data in attempt response
type FeedbackResponse struct {
	ID               uuid.UUID `json:"id"`
	FeedbackText     string    `json:"feedback_text"`
	ModelUsed        string    `json:"model_used"`
	GenerationTimeMs *int      `json:"generation_time_ms"`
	IsHelpful        *bool     `json:"is_helpful,omitempty"`
}

// FeedbackRatingResponse represents the response after rating feedback
type FeedbackRatingResponse struct {
	AttemptID uuid.UUID `json:"attempt_id"`
	IsHelpful bool      `json:"is_helpful"`
}

// === Converters ===

// ToResponse converts Attempt to AttemptResponse
func (a *Attempt) ToResponse() AttemptResponse {
	return AttemptResponse{
		ID:                a.ID,
		QuestionID:        a.QuestionID,
		SelectedAnswer:    a.SelectedAnswer,
		IsCorrect:         a.IsCorrect,
		TimeSpentSeconds:  a.TimeSpentSeconds,
		UserThetaBefore:   a.UserThetaBefore,
		UserThetaAfter:    a.UserThetaAfter,
		ThetaChange:       a.ThetaChange,
		FeedbackGenerated: a.FeedbackGenerated,
		SessionID:         a.SessionID,
		CreatedAt:         a.CreatedAt.Format("2006-01-02T15:04:05Z"),
	}
}

// ToDetailResponse converts Attempt to AttemptDetailResponse (with question & feedback)
func (a *Attempt) ToDetailResponse() AttemptDetailResponse {
	resp := AttemptDetailResponse{
		ID:               a.ID,
		QuestionID:       a.QuestionID,
		SelectedAnswer:   a.SelectedAnswer,
		IsCorrect:        a.IsCorrect,
		TimeSpentSeconds: a.TimeSpentSeconds,
		ThetaChange:      a.ThetaChange,
		CreatedAt:        a.CreatedAt.Format("2006-01-02T15:04:05Z"),
	}

	// Include question if loaded
	if a.Question != nil {
		resp.CorrectAnswer = a.Question.CorrectAnswer
		resp.Question = &QuestionInAttempt{
			ID:   a.Question.ID,
			Text: a.Question.Text,
			Options: []string{
				a.Question.OptionA,
				a.Question.OptionB,
				a.Question.OptionC,
				a.Question.OptionD,
				a.Question.OptionE,
			},
			Explanation: a.Question.Explanation,
		}
	}

	// Include feedback if loaded
	if a.Feedback != nil {
		resp.Feedback = &FeedbackResponse{
			ID:               a.Feedback.ID,
			FeedbackText:     a.Feedback.FeedbackText,
			ModelUsed:        a.Feedback.ModelUsed,
			GenerationTimeMs: a.Feedback.GenerationTimeMs,
			IsHelpful:        a.Feedback.IsHelpful,
		}
	}

	return resp
}

// ToFeedbackResponse converts AttemptFeedback to FeedbackResponse
func (f *AttemptFeedback) ToResponse() FeedbackResponse {
	return FeedbackResponse{
		ID:               f.ID,
		FeedbackText:     f.FeedbackText,
		ModelUsed:        f.ModelUsed,
		GenerationTimeMs: f.GenerationTimeMs,
		IsHelpful:        f.IsHelpful,
	}
}

// QuestionToAttemptQuestion converts question.Question to QuestionInAttempt
func QuestionToAttemptQuestion(q *question.Question) *QuestionInAttempt {
	if q == nil {
		return nil
	}
	return &QuestionInAttempt{
		ID:   q.ID,
		Text: q.Text,
		Options: []string{
			q.OptionA,
			q.OptionB,
			q.OptionC,
			q.OptionD,
			q.OptionE,
		},
		Explanation: q.Explanation,
	}
}
