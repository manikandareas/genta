package v1

import (
	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/handler"
	"github.com/manikandareas/genta/internal/middleware"
)

func RegisterV1Routes(router *echo.Group, handlers *handler.Handlers, middleware *middleware.Middlewares) {
	// user routes
	registerUserRoutes(router, handlers.User, middleware.Auth)

	// question routes
	registerQuestionRoutes(router, handlers.Question, middleware.Auth)
}
