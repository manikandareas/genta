package v1

import (
	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/handler"
	"github.com/manikandareas/genta/internal/middleware"
)

func registerQuestionRoutes(r *echo.Group, h *handler.QuestionHandler, auth *middleware.AuthMiddleware) {
	questions := r.Group("/questions")
	questions.Use(auth.RequireAuth)

	// List questions with optional section filter
	questions.GET("", h.ListQuestions)

	// Get next question for practice (adaptive)
	questions.GET("/next", h.GetNextQuestion)

	// Get single question by ID
	questions.GET("/:id", h.GetQuestion)
}
