package v1

import (
	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/handler"
	"github.com/manikandareas/genta/internal/middleware"
)

func registerUserRoutes(r *echo.Group, h *handler.UserHandler, auth *middleware.AuthMiddleware) {
	// User operations
	users := r.Group("/users")
	users.Use(auth.RequireAuth)

	// me
	users.GET("/me", h.GetUser)
	users.PUT("/me", h.UpdateUser)
}
