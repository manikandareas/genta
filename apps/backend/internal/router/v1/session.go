package v1

import (
	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/handler"
	"github.com/manikandareas/genta/internal/middleware"
)

func registerSessionRoutes(r *echo.Group, h *handler.SessionHandler, auth *middleware.AuthMiddleware) {
	sessions := r.Group("/sessions")
	sessions.Use(auth.RequireAuth)

	// List sessions for current user
	sessions.GET("", h.ListSessions)

	// Start a new session
	sessions.POST("", h.CreateSession)

	// Get session by ID
	sessions.GET("/:session_id", h.GetSession)

	// End a session
	sessions.PUT("/:session_id/end", h.EndSession)
}
