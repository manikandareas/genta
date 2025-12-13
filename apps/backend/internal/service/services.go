package service

import (
	"fmt"

	"github.com/manikandareas/genta/internal/lib/clerk"
	"github.com/manikandareas/genta/internal/lib/job"
	"github.com/manikandareas/genta/internal/repository"
	"github.com/manikandareas/genta/internal/server"
)

type Services struct {
	Auth *AuthService
	Job  *job.JobService
	User *UserService
}

func NewServices(s *server.Server, repos *repository.Repositories) (*Services, error) {
	authService := NewAuthService(s)

	clerkClient, err := clerk.NewClerk(s)
	if err != nil {
		return nil, fmt.Errorf("failed to create Clerk client: %w", err)
	}

	userService := NewUserService(s, repos.User, clerkClient)

	return &Services{
		Job:  s.Job,
		Auth: authService,
		User: userService,
	}, nil
}
