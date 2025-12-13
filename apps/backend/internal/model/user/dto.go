package user

import (
	"time"

	"github.com/go-playground/validator/v10"
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
	FullName          *string    `json:"fullName,omitempty" validate:"omitempty,max=255"`
	TargetPtn         *string    `json:"targetPtn,omitempty" validate:"omitempty,max=100"`
	TargetScore       *int       `json:"targetScore,omitempty" validate:"omitempty,min=0"`
	ExamDate          *time.Time `json:"examDate,omitempty" validate:"omitempty"`
	StudyHoursPerWeek *int16     `json:"studyHoursPerWeek,omitempty" validate:"omitempty,min=0,max=168"`
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
	TargetPtn         *string    `json:"targetPtn"`
	TargetScore       *int       `json:"targetScore"`
	ExamDate          *time.Time `json:"examDate"`
	StudyHoursPerWeek *int16     `json:"studyHoursPerWeek"`
}
