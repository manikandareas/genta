package job

import (
	"encoding/json"
	"time"

	"github.com/hibiken/asynq"
)

const (
	TaskFeedbackGeneration = "feedback:generation"
)

// FeedbackGenerationPayload contains data needed to generate feedback
type FeedbackGenerationPayload struct {
	AttemptID  string `json:"attempt_id"`
	UserID     string `json:"user_id"`
	QuestionID string `json:"question_id"`
	IsCorrect  bool   `json:"is_correct"`
}

// FeedbackGenerationResult contains the result of feedback generation
type FeedbackGenerationResult struct {
	AttemptID        string `json:"attempt_id"`
	FeedbackID       string `json:"feedback_id"`
	FeedbackText     string `json:"feedback_text"`
	ModelUsed        string `json:"model_used"`
	GenerationTimeMs int    `json:"generation_time_ms"`
}

// NewFeedbackGenerationTask creates a new feedback generation task
func NewFeedbackGenerationTask(attemptID, userID, questionID string, isCorrect bool) (*asynq.Task, error) {
	payload, err := json.Marshal(FeedbackGenerationPayload{
		AttemptID:  attemptID,
		UserID:     userID,
		QuestionID: questionID,
		IsCorrect:  isCorrect,
	})
	if err != nil {
		return nil, err
	}

	return asynq.NewTask(TaskFeedbackGeneration, payload,
		asynq.MaxRetry(3),
		asynq.Queue("default"),
		asynq.Timeout(60*time.Second), // LLM calls may take longer
		asynq.Retention(24*time.Hour), // Keep completed tasks for 24h for status checks
	), nil
}
