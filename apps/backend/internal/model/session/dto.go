package session

import (
	"github.com/go-playground/validator/v10"
)

// === Request DTOs ===

// CreateSessionRequest represents the request body for starting a new session
type CreateSessionRequest struct {
	Section *string `json:"section" validate:"omitempty,oneof=PU PPU PBM PK LBI LBE PM"`
}

func (r *CreateSessionRequest) Validate() error {
	validate := validator.New()
	return validate.Struct(r)
}

// ListSessionsRequest represents query params for listing sessions
type ListSessionsRequest struct {
	Page  int `query:"page" validate:"min=1"`
	Limit int `query:"limit" validate:"min=1,max=50"`
}

func (r *ListSessionsRequest) Validate() error {
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

// EndSessionRequest represents path params for ending a session
type EndSessionRequest struct {
	SessionID string `param:"session_id" validate:"required,max=100"`
}

func (r *EndSessionRequest) Validate() error {
	validate := validator.New()
	return validate.Struct(r)
}

// GetSessionRequest represents path params for getting a session
type GetSessionRequest struct {
	SessionID string `param:"session_id" validate:"required,max=100"`
}

func (r *GetSessionRequest) Validate() error {
	validate := validator.New()
	return validate.Struct(r)
}

// === Response DTOs ===

// SessionResponse represents the API response for a session
type SessionResponse struct {
	ID                 string   `json:"id"`
	StartedAt          string   `json:"started_at"`
	EndedAt            *string  `json:"ended_at,omitempty"`
	DurationMinutes    *int16   `json:"duration_minutes,omitempty"`
	QuestionsAttempted int      `json:"questions_attempted"`
	QuestionsCorrect   int      `json:"questions_correct"`
	AccuracyInSession  *float64 `json:"accuracy_in_session,omitempty"`
	Section            *string  `json:"section,omitempty"`
}

// === Converters ===

// ToResponse converts Session to SessionResponse
func (s *Session) ToResponse() SessionResponse {
	resp := SessionResponse{
		ID:                 s.ID,
		StartedAt:          s.StartedAt.Format("2006-01-02T15:04:05Z"),
		DurationMinutes:    s.DurationMinutes,
		QuestionsAttempted: s.QuestionsAttempted,
		QuestionsCorrect:   s.QuestionsCorrect,
		AccuracyInSession:  s.AccuracyInSession,
		Section:            s.Section,
	}

	if s.EndedAt != nil {
		endedAt := s.EndedAt.Format("2006-01-02T15:04:05Z")
		resp.EndedAt = &endedAt
	}

	return resp
}
