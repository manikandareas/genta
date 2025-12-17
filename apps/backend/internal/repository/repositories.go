package repository

import "github.com/manikandareas/genta/internal/server"

type Repositories struct {
	User      *UserRepository
	Readiness *ReadinessRepository
	Question  *QuestionRepository
}

func NewRepositories(s *server.Server) *Repositories {
	return &Repositories{
		User:      NewUserRepository(s),
		Readiness: NewReadinessRepository(s),
		Question:  NewQuestionRepository(s),
	}
}
