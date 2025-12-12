package user

import (
	"time"

	"github.com/go-playground/validator/v10"
)

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
