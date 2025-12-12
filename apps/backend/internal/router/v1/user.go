package v1

import (
	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/handler"
	"github.com/manikandareas/genta/internal/middleware"
)

func registerUserRoutes(r *echo.Group, h *handler.UserHandler, auth *middleware.AuthMiddleware) {
	// Todo operations
	todos := r.Group("/users")
	todos.Use(auth.RequireAuth)

	// me
	todos.PUT("/me", h.UpdateUser)
}
