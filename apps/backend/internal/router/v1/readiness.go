package v1

import (
	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/handler"
	"github.com/manikandareas/genta/internal/middleware"
)

func registerReadinessRoutes(r *echo.Group, h *handler.ReadinessHandler, auth *middleware.AuthMiddleware) {
	readiness := r.Group("/readiness")
	readiness.Use(auth.RequireAuth)

	// Get overall readiness overview
	readiness.GET("", h.GetReadinessOverview)

	// Get section-specific readiness detail
	readiness.GET("/:section", h.GetSectionReadiness)

	// Update section readiness settings (target theta)
	readiness.PATCH("/:section", h.UpdateSectionReadiness)
}
