package session

import (
	"time"

	"github.com/google/uuid"
	"github.com/manikandareas/genta/internal/model"
)

// Session represents a user study session entity
type Session struct {
	ID     string    `json:"id" db:"id"` // VARCHAR(100) in DB
	UserID uuid.UUID `json:"userId" db:"user_id"`

	// Time tracking
	StartedAt       time.Time  `json:"startedAt" db:"started_at"`
	EndedAt         *time.Time `json:"endedAt" db:"ended_at"`
	DurationMinutes *int16     `json:"durationMinutes" db:"duration_minutes"`

	// Progress tracking
	QuestionsAttempted int      `json:"questionsAttempted" db:"questions_attempted"`
	QuestionsCorrect   int      `json:"questionsCorrect" db:"questions_correct"`
	AccuracyInSession  *float64 `json:"accuracyInSession" db:"accuracy_in_session"`

	// Section (nullable for mixed sessions)
	Section *string `json:"section" db:"section"`

	// Timestamps
	model.BaseWithCreatedAt
	model.BaseWithUpdatedAt
}
