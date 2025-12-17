package v1

import (
	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/handler"
	"github.com/manikandareas/genta/internal/middleware"
)

func registerAttemptRoutes(r *echo.Group, h *handler.AttemptHandler, auth *middleware.AuthMiddleware) {
	attempts := r.Group("/attempts")
	attempts.Use(auth.RequireAuth)

	// Create new attempt (record answer)
	attempts.POST("", h.CreateAttempt)

	// Get attempt by ID with details
	attempts.GET("/:attempt_id", h.GetAttempt)

	// Rate feedback helpfulness
	attempts.PUT("/:attempt_id/feedback-rating", h.UpdateFeedbackRating)
}
