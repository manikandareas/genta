package llm

import (
	"context"
	"fmt"
	"time"

	"github.com/manikandareas/genta/internal/config"
	"github.com/rs/zerolog"
	"github.com/sashabaranov/go-openai"
)

// Client wraps OpenAI client with logging and metrics
type Client struct {
	client *openai.Client
	model  string
	logger *zerolog.Logger
}

// NewClient creates a new LLM client
func NewClient(cfg *config.Config, logger *zerolog.Logger) *Client {
	apiKey := cfg.Integration.OpenAIAPIKey
	model := cfg.Integration.OpenAIModel

	if model == "" {
		model = openai.GPT4oMini // Default to cost-effective model
	}

	var client *openai.Client
	if apiKey != "" {
		client = openai.NewClient(apiKey)
	}

	return &Client{
		client: client,
		model:  model,
		logger: logger,
	}
}

// IsConfigured returns true if the client has valid API key
func (c *Client) IsConfigured() bool {
	return c.client != nil
}

// GenerationResult contains the result of a text generation
type GenerationResult struct {
	Text             string
	Model            string
	GenerationTimeMs int
	TokensInput      int
	TokensOutput     int
}

// GenerateText generates text using the configured model
func (c *Client) GenerateText(ctx context.Context, systemPrompt, userPrompt string) (*GenerationResult, error) {
	if !c.IsConfigured() {
		return nil, fmt.Errorf("LLM client not configured: missing API key")
	}

	start := time.Now()

	resp, err := c.client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model: c.model,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: systemPrompt,
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: userPrompt,
				},
			},
			Temperature:         0.7,
			MaxCompletionTokens: 500,
		},
	)

	generationTime := int(time.Since(start).Milliseconds())

	if err != nil {
		c.logger.Error().
			Err(err).
			Str("model", c.model).
			Int("generation_time_ms", generationTime).
			Msg("LLM generation failed")
		return nil, fmt.Errorf("failed to generate text: %w", err)
	}

	if len(resp.Choices) == 0 {
		return nil, fmt.Errorf("no response from LLM")
	}

	result := &GenerationResult{
		Text:             resp.Choices[0].Message.Content,
		Model:            c.model,
		GenerationTimeMs: generationTime,
		TokensInput:      resp.Usage.PromptTokens,
		TokensOutput:     resp.Usage.CompletionTokens,
	}

	c.logger.Info().
		Str("model", c.model).
		Int("generation_time_ms", generationTime).
		Int("tokens_input", result.TokensInput).
		Int("tokens_output", result.TokensOutput).
		Msg("LLM generation completed")

	return result, nil
}
