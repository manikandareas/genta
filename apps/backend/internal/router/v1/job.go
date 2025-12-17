package v1

import (
	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/handler"
	"github.com/manikandareas/genta/internal/middleware"
)

func registerJobRoutes(r *echo.Group, h *handler.JobHandler, auth *middleware.AuthMiddleware) {
	jobs := r.Group("/jobs")
	jobs.Use(auth.RequireAuth)

	// Check job status
	jobs.POST("/:job_id/check", h.CheckJobStatus)
}
