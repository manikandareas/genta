package job

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/hibiken/asynq"
	"github.com/manikandareas/genta/internal/config"
	"github.com/manikandareas/genta/internal/lib/email"
	"github.com/rs/zerolog"
)

var emailClient *email.Client

func (j *JobService) InitHandlers(config *config.Config, logger *zerolog.Logger) {
	emailClient = email.NewClient(config, logger)
}

func (j *JobService) handleWelcomeEmailTask(ctx context.Context, t *asynq.Task) error {
	var p WelcomeEmailPayload
	if err := json.Unmarshal(t.Payload(), &p); err != nil {
		return fmt.Errorf("failed to unmarshal welcome email payload: %w", err)
	}

	j.logger.Info().
		Str("type", "welcome").
		Str("to", p.To).
		Msg("Processing welcome email task")

	err := emailClient.SendWelcomeEmail(
		p.To,
		p.FirstName,
	)
	if err != nil {
		j.logger.Error().
			Str("type", "welcome").
			Str("to", p.To).
			Err(err).
			Msg("Failed to send welcome email")
		return err
	}

	j.logger.Info().
		Str("type", "welcome").
		Str("to", p.To).
		Msg("Successfully sent welcome email")
	return nil
}

func (j *JobService) handleFeedbackGenerationTask(ctx context.Context, t *asynq.Task) error {
	var p FeedbackGenerationPayload
	if err := json.Unmarshal(t.Payload(), &p); err != nil {
		return fmt.Errorf("failed to unmarshal feedback generation payload: %w", err)
	}

	j.logger.Info().
		Str("type", "feedback_generation").
		Str("attempt_id", p.AttemptID).
		Str("question_id", p.QuestionID).
		Bool("is_correct", p.IsCorrect).
		Msg("Processing feedback generation task")

	// TODO: Implement actual LLM feedback generation
	// For now, this is a placeholder that simulates the process
	// In production, this would:
	// 1. Fetch question details from DB
	// 2. Call LLM API to generate feedback
	// 3. Save feedback to attempt_feedback table
	// 4. Update attempt.feedback_generated = true

	j.logger.Info().
		Str("type", "feedback_generation").
		Str("attempt_id", p.AttemptID).
		Msg("Successfully processed feedback generation task")

	return nil
}
