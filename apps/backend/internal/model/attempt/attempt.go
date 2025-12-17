package attempt

import (
	"time"

	"github.com/google/uuid"
	"github.com/manikandareas/genta/internal/model"
	"github.com/manikandareas/genta/internal/model/question"
)

// Attempt represents a student's answer attempt entity
type Attempt struct {
	ID         uuid.UUID `json:"id" db:"id"`
	UserID     uuid.UUID `json:"userId" db:"user_id"`
	QuestionID uuid.UUID `json:"questionId" db:"question_id"`
	SessionID  *string   `json:"sessionId" db:"session_id"` // VARCHAR(100) in DB

	// Answer
	SelectedAnswer string `json:"selectedAnswer" db:"selected_answer"`
	IsCorrect      bool   `json:"isCorrect" db:"is_correct"`

	// Time tracking
	TimeSpentSeconds int16 `json:"timeSpentSeconds" db:"time_spent_seconds"` // SMALLINT in DB

	// IRT Theta tracking
	UserThetaBefore *float64 `json:"userThetaBefore" db:"user_theta_before"`
	UserThetaAfter  *float64 `json:"userThetaAfter" db:"user_theta_after"`
	ThetaChange     *float64 `json:"thetaChange" db:"theta_change"`

	// Feedback (stored in attempts table)
	FeedbackGenerated    bool    `json:"feedbackGenerated" db:"feedback_generated"`
	FeedbackModelUsed    *string `json:"feedbackModelUsed" db:"feedback_model_used"`
	FeedbackGenerationMs *int    `json:"feedbackGenerationMs" db:"feedback_generation_ms"`
	FeedbackHelpful      *bool   `json:"feedbackHelpful" db:"feedback_helpful"`

	// Session tracking
	AttemptNumberInSession *int16 `json:"attemptNumberInSession" db:"attempt_number_in_session"`

	// Timestamps
	model.BaseWithCreatedAt
	DeletedAt *time.Time `json:"deletedAt" db:"deleted_at"`

	// Relations (for joins)
	Question *question.Question `json:"question,omitempty" db:"-"`
	Feedback *AttemptFeedback   `json:"feedback,omitempty" db:"-"`
}

// AttemptFeedback represents AI-generated feedback (from attempt_feedback table)
type AttemptFeedback struct {
	ID        uuid.UUID `json:"id" db:"id"`
	AttemptID uuid.UUID `json:"attemptId" db:"attempt_id"`

	FeedbackText string  `json:"feedbackText" db:"feedback_text"`
	FeedbackLang *string `json:"feedbackLang" db:"feedback_lang"`

	FeedbackQualityRating *float64 `json:"feedbackQualityRating" db:"feedback_quality_rating"`
	IsHelpful             *bool    `json:"isHelpful" db:"is_helpful"`
	HelpfulRating         *int     `json:"helpfulRating" db:"helpful_rating"`

	ModelUsed        string  `json:"modelUsed" db:"model_used"`
	PromptVersion    *string `json:"promptVersion" db:"prompt_version"`
	GenerationTimeMs *int    `json:"generationTimeMs" db:"generation_time_ms"`
	TokenCountInput  *int16  `json:"tokenCountInput" db:"token_count_input"`
	TokenCountOutput *int16  `json:"tokenCountOutput" db:"token_count_output"`

	model.BaseWithCreatedAt
	model.BaseWithUpdatedAt
}
