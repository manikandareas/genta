package job

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/google/uuid"
	"github.com/hibiken/asynq"
	"github.com/manikandareas/genta/internal/config"
	"github.com/manikandareas/genta/internal/database"
	"github.com/manikandareas/genta/internal/lib/email"
	"github.com/manikandareas/genta/internal/lib/llm"
	"github.com/rs/zerolog"
)

var (
	emailClient *email.Client
	llmClient   *llm.Client
	db          *database.Database
)

func (j *JobService) InitHandlers(config *config.Config, logger *zerolog.Logger) {
	emailClient = email.NewClient(config, logger)
	llmClient = llm.NewClient(config, logger)
}

// SetDatabase sets the database connection for job handlers
func (j *JobService) SetDatabase(database *database.Database) {
	db = database
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

	// Check if LLM client is configured
	if llmClient == nil || !llmClient.IsConfigured() {
		j.logger.Warn().
			Str("attempt_id", p.AttemptID).
			Msg("LLM client not configured, skipping feedback generation")
		return nil
	}

	// Check if database is available
	if db == nil {
		return fmt.Errorf("database not initialized for job handlers")
	}

	// 1. Fetch question details from DB
	question, err := j.fetchQuestion(ctx, p.QuestionID)
	if err != nil {
		j.logger.Error().Err(err).Str("question_id", p.QuestionID).Msg("Failed to fetch question")
		return fmt.Errorf("failed to fetch question: %w", err)
	}

	// 2. Fetch attempt to get selected answer
	attempt, err := j.fetchAttempt(ctx, p.AttemptID)
	if err != nil {
		j.logger.Error().Err(err).Str("attempt_id", p.AttemptID).Msg("Failed to fetch attempt")
		return fmt.Errorf("failed to fetch attempt: %w", err)
	}

	// 3. Build prompt and generate feedback
	promptData := llm.FeedbackPromptData{
		QuestionText:   question.Text,
		Options:        []string{question.OptionA, question.OptionB, question.OptionC, question.OptionD, question.OptionE},
		CorrectAnswer:  question.CorrectAnswer,
		SelectedAnswer: attempt.SelectedAnswer,
		IsCorrect:      p.IsCorrect,
		Explanation:    question.Explanation,
		Section:        question.Section,
		SubType:        question.SubType,
		Language:       llm.LangIndonesian, // Default to Indonesian
	}

	systemPrompt := llm.SystemPromptFeedback(promptData.Language)
	userPrompt := llm.BuildFeedbackPrompt(promptData)

	result, err := llmClient.GenerateText(ctx, systemPrompt, userPrompt)
	if err != nil {
		j.logger.Error().Err(err).Str("attempt_id", p.AttemptID).Msg("Failed to generate feedback")
		return fmt.Errorf("failed to generate feedback: %w", err)
	}

	// 4. Save feedback to attempt_feedback table
	feedbackID := uuid.New()
	lang := string(promptData.Language)
	promptVersion := llm.PromptVersion()
	tokensInput := int16(result.TokensInput)
	tokensOutput := int16(result.TokensOutput)

	err = j.saveFeedback(ctx, feedbackID, p.AttemptID, result.Text, lang, result.Model, promptVersion, result.GenerationTimeMs, tokensInput, tokensOutput)
	if err != nil {
		j.logger.Error().Err(err).Str("attempt_id", p.AttemptID).Msg("Failed to save feedback")
		return fmt.Errorf("failed to save feedback: %w", err)
	}

	// 5. Update attempt.feedback_generated = true
	err = j.markFeedbackGenerated(ctx, p.AttemptID, result.Model, result.GenerationTimeMs)
	if err != nil {
		j.logger.Error().Err(err).Str("attempt_id", p.AttemptID).Msg("Failed to mark feedback generated")
		return fmt.Errorf("failed to mark feedback generated: %w", err)
	}

	j.logger.Info().
		Str("type", "feedback_generation").
		Str("attempt_id", p.AttemptID).
		Str("feedback_id", feedbackID.String()).
		Str("model", result.Model).
		Int("generation_time_ms", result.GenerationTimeMs).
		Int("tokens_input", result.TokensInput).
		Int("tokens_output", result.TokensOutput).
		Msg("Successfully generated and saved feedback")

	return nil
}

// questionData holds question data fetched from DB
type questionData struct {
	Text          string
	OptionA       string
	OptionB       string
	OptionC       string
	OptionD       string
	OptionE       string
	CorrectAnswer string
	Explanation   string
	Section       string
	SubType       string
}

// attemptData holds attempt data fetched from DB
type attemptData struct {
	SelectedAnswer string
}

func (j *JobService) fetchQuestion(ctx context.Context, questionID string) (*questionData, error) {
	var q questionData
	err := db.Pool.QueryRow(ctx, `
		SELECT text, option_a, option_b, option_c, option_d, option_e, 
			correct_answer, COALESCE(explanation, ''), section, COALESCE(sub_type, '')
		FROM questions WHERE id = $1
	`, questionID).Scan(
		&q.Text, &q.OptionA, &q.OptionB, &q.OptionC, &q.OptionD, &q.OptionE,
		&q.CorrectAnswer, &q.Explanation, &q.Section, &q.SubType,
	)
	if err != nil {
		return nil, err
	}
	return &q, nil
}

func (j *JobService) fetchAttempt(ctx context.Context, attemptID string) (*attemptData, error) {
	var a attemptData
	err := db.Pool.QueryRow(ctx, `
		SELECT selected_answer FROM attempts WHERE id = $1
	`, attemptID).Scan(&a.SelectedAnswer)
	if err != nil {
		return nil, err
	}
	return &a, nil
}

func (j *JobService) saveFeedback(ctx context.Context, feedbackID uuid.UUID, attemptID, feedbackText, lang, model, promptVersion string, generationMs int, tokensInput, tokensOutput int16) error {
	_, err := db.Pool.Exec(ctx, `
		INSERT INTO attempt_feedback (
			id, attempt_id, feedback_text, feedback_lang,
			model_used, prompt_version, generation_time_ms,
			token_count_input, token_count_output, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
	`, feedbackID, attemptID, feedbackText, lang, model, promptVersion, generationMs, tokensInput, tokensOutput)
	return err
}

func (j *JobService) markFeedbackGenerated(ctx context.Context, attemptID, model string, generationMs int) error {
	_, err := db.Pool.Exec(ctx, `
		UPDATE attempts 
		SET feedback_generated = true, feedback_model_used = $2, feedback_generation_ms = $3
		WHERE id = $1
	`, attemptID, model, generationMs)
	return err
}
