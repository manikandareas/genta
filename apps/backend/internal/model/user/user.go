package user

import (
	"time"

	"github.com/google/uuid"
	"github.com/manikandareas/genta/internal/model"
)

type User struct {
	ID        uuid.UUID `json:"id" db:"id"`
	ClerkID   string    `json:"clerkId" db:"clerk_id"`
	Email     string    `json:"email" db:"email"`
	FullName  *string   `json:"fullName" db:"full_name"`
	AvatarUrl *string   `json:"avatarUrl" db:"avatar_url"`

	// Subscription
	SubscriptionTier      string     `json:"subscriptionTier" db:"subscription_tier"`
	SubscriptionStartDate *time.Time `json:"subscriptionStartDate" db:"subscription_start_date"`
	SubscriptionEndDate   *time.Time `json:"subscriptionEndDate" db:"subscription_end_date"`
	IsSubscriptionActive  bool       `json:"isSubscriptionActive" db:"is_subscription_active"`

	// IRT (Item Response Theory)
	IrtTheta       *float64   `json:"irtTheta" db:"irt_theta"`
	IrtVariance    *float64   `json:"irtVariance" db:"irt_variance"`
	IrtLastUpdated *time.Time `json:"irtLastUpdated" db:"irt_last_updated"`

	// Study Plan
	TargetPtn           *string    `json:"targetPtn" db:"target_ptn"`
	TargetScore         *int       `json:"targetScore" db:"target_score"`
	ExamDate            *time.Time `json:"examDate" db:"exam_date"`
	StudyHoursPerWeek   *int16     `json:"studyHoursPerWeek" db:"study_hours_per_week"`
	OnboardingCompleted bool       `json:"onboardingCompleted" db:"onboarding_completed"`

	// Account Status
	IsEmailVerified bool       `json:"isEmailVerified" db:"is_email_verified"`
	IsActive        bool       `json:"isActive" db:"is_active"`
	LastLogin       *time.Time `json:"lastLogin" db:"last_login"`

	// Timestamps
	model.BaseWithCreatedAt
	model.BaseWithUpdatedAt
	DeletedAt *time.Time `json:"deletedAt" db:"deleted_at"`
}
