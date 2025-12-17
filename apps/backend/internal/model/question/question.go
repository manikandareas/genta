package question

import (
	"time"

	"github.com/google/uuid"
	"github.com/manikandareas/genta/internal/model"
)

// Question represents a question entity
type Question struct {
	ID             uuid.UUID  `json:"id" db:"id"`
	QuestionBankID *uuid.UUID `json:"questionBankId" db:"question_bank_id"`

	Section model.Section `json:"section" db:"section"`
	SubType *string       `json:"subType" db:"sub_type"`

	// IRT Parameters
	DifficultyIRT  *float64 `json:"difficultyIrt" db:"difficulty_irt"`
	Discrimination *float64 `json:"discrimination" db:"discrimination"`
	GuessingParam  *float64 `json:"guessingParam" db:"guessing_param"`

	// Question Content
	Text          string `json:"text" db:"text"`
	OptionA       string `json:"optionA" db:"option_a"`
	OptionB       string `json:"optionB" db:"option_b"`
	OptionC       string `json:"optionC" db:"option_c"`
	OptionD       string `json:"optionD" db:"option_d"`
	OptionE       string `json:"optionE" db:"option_e"`
	CorrectAnswer string `json:"correctAnswer" db:"correct_answer"`

	// Explanation
	Explanation    *string `json:"explanation" db:"explanation"`
	ExplanationEn  *string `json:"explanationEn" db:"explanation_en"`
	StrategyTip    *string `json:"strategyTip" db:"strategy_tip"`
	RelatedConcept *string `json:"relatedConcept" db:"related_concept"`

	// Solution Steps (JSON)
	SolutionSteps *[]SolutionStep `json:"solutionSteps" db:"solution_steps"`

	IsActive bool `json:"isActive" db:"is_active"`

	// Statistics
	AttemptCount   *int     `json:"attemptCount" db:"attempt_count"`
	CorrectRate    *float64 `json:"correctRate" db:"correct_rate"`
	AvgTimeSeconds *int16   `json:"avgTimeSeconds" db:"avg_time_seconds"`

	// Timestamps
	model.BaseWithCreatedAt
	model.BaseWithUpdatedAt
	DeletedAt *time.Time `json:"deletedAt" db:"deleted_at"`
}

// SolutionStep represents a step in the solution
type SolutionStep struct {
	Order   int    `json:"order"`
	Title   string `json:"title"`
	Content string `json:"content"`
}
