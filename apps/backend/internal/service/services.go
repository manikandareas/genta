package service

import (
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
	userService := NewUserService(s, repos.User)

	return &Services{
		Job:  s.Job,
		Auth: authService,
		User: userService,
	}, nil
}
