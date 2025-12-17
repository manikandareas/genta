package repository

import "github.com/manikandareas/genta/internal/server"

type Repositories struct {
	User      *UserRepository
	Readiness *ReadinessRepository
	Question  *QuestionRepository
	Attempt   *AttemptRepository
	Session   *SessionRepository
}

func NewRepositories(s *server.Server) *Repositories {
	return &Repositories{
		User:      NewUserRepository(s),
		Readiness: NewReadinessRepository(s),
		Question:  NewQuestionRepository(s),
		Attempt:   NewAttemptRepository(s),
		Session:   NewSessionRepository(s),
	}
}
