package handler

import (
	"github.com/manikandareas/genta/internal/server"
	"github.com/manikandareas/genta/internal/service"
)

type Handlers struct {
	Health    *HealthHandler
	OpenAPI   *OpenAPIHandler
	User      *UserHandler
	Question  *QuestionHandler
	Attempt   *AttemptHandler
	Session   *SessionHandler
	Readiness *ReadinessHandler
	Analytics *AnalyticsHandler
	Job       *JobHandler
}

func NewHandlers(s *server.Server, services *service.Services) *Handlers {
	return &Handlers{
		Health:    NewHealthHandler(s),
		OpenAPI:   NewOpenAPIHandler(s),
		User:      NewUserHandler(s, services.User),
		Question:  NewQuestionHandler(s, services.Question),
		Attempt:   NewAttemptHandler(s, services.Attempt),
		Session:   NewSessionHandler(s, services.Session),
		Readiness: NewReadinessHandler(s, services.Readiness),
		Analytics: NewAnalyticsHandler(s, services.Analytics),
		Job:       NewJobHandler(s, services.Job),
	}
}
