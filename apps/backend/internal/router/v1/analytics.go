package v1

import (
	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/handler"
	"github.com/manikandareas/genta/internal/middleware"
)

func registerAnalyticsRoutes(r *echo.Group, h *handler.AnalyticsHandler, auth *middleware.AuthMiddleware) {
	analytics := r.Group("/analytics")
	analytics.Use(auth.RequireAuth)

	// Get progress analytics
	analytics.GET("/progress", h.GetProgress)
}
