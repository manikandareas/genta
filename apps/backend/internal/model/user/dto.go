package user

import (
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/manikandareas/genta/internal/model/readiness"
)

type CreateUserRequest struct {
	ClerkID   string  `json:"clerkId" validate:"required"`
	Email     string  `json:"email" validate:"required,email"`
	FullName  *string `json:"fullName,omitempty" validate:"omitempty,max=255"`
	AvatarUrl *string `json:"avatarUrl,omitempty" validate:"omitempty,url"`
}

func (r *CreateUserRequest) Validate() error {
	validate := validator.New()
	return validate.Struct(r)
}

type PutUserRequest struct {
	FullName            *string    `json:"fullName,omitempty" validate:"omitempty,max=255"`
	TargetPtn           *string    `json:"targetPtn,omitempty" validate:"omitempty,max=100"`
	TargetScore         *int       `json:"targetScore,omitempty" validate:"omitempty,min=0"`
	ExamDate            *time.Time `json:"examDate,omitempty" validate:"omitempty"`
	StudyHoursPerWeek   *int16     `json:"studyHoursPerWeek,omitempty" validate:"omitempty,min=0,max=168"`
	OnboardingCompleted *bool      `json:"onboardingCompleted,omitempty"`
}

func (r *PutUserRequest) Validate() error {
	validate := validator.New()
	return validate.Struct(r)
}

type CompleteOnboardingRequest struct {
	TargetPtn         *string    `json:"targetPtn,omitempty" validate:"omitempty,max=100"`
	TargetScore       *int       `json:"targetScore,omitempty" validate:"omitempty,min=0"`
	ExamDate          *time.Time `json:"examDate,omitempty" validate:"omitempty"`
	StudyHoursPerWeek *int16     `json:"studyHoursPerWeek,omitempty" validate:"omitempty,min=0,max=168"`
}

func (r *CompleteOnboardingRequest) Validate() error {
	validate := validator.New()
	return validate.Struct(r)
}

type CompleteOnboardingResponse struct {
	ID                  uuid.UUID                  `json:"id"`
	OnboardingCompleted bool                       `json:"onboarding_completed"`
	TargetPtn           *string                    `json:"target_ptn"`
	TargetScore         *int                       `json:"target_score"`
	ExamDate            *time.Time                 `json:"exam_date"`
	StudyHoursPerWeek   *int16                     `json:"study_hours_per_week"`
	InitialReadiness    readiness.InitialReadiness `json:"initial_readiness"`
}
