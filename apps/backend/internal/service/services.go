package service

import (
	"fmt"

	"github.com/manikandareas/genta/internal/lib/clerk"
	"github.com/manikandareas/genta/internal/lib/job"
	"github.com/manikandareas/genta/internal/repository"
	"github.com/manikandareas/genta/internal/server"
)

type Services struct {
	Auth      *AuthService
	Job       *job.JobService
	User      *UserService
	Question  *QuestionService
	Attempt   *AttemptService
	Session   *SessionService
	Readiness *ReadinessService
	Analytics *AnalyticsService
}

func NewServices(s *server.Server, repos *repository.Repositories) (*Services, error) {
	authService := NewAuthService(s)

	clerkClient, err := clerk.NewClerk(s)
	if err != nil {
		return nil, fmt.Errorf("failed to create Clerk client: %w", err)
	}

	userService := NewUserService(s, repos.User, repos.Readiness, clerkClient)
	questionService := NewQuestionService(s, repos.Question, repos.User)
	attemptService := NewAttemptService(s, repos.Attempt, repos.Question, repos.User)
	sessionService := NewSessionService(s, repos.Session, repos.User)
	readinessService := NewReadinessService(s, repos.Readiness, repos.User)
	analyticsService := NewAnalyticsService(s, repos.Analytics, repos.User)

	return &Services{
		Job:       s.Job,
		Auth:      authService,
		User:      userService,
		Question:  questionService,
		Attempt:   attemptService,
		Session:   sessionService,
		Readiness: readinessService,
		Analytics: analyticsService,
	}, nil
}
