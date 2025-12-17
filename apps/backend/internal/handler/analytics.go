package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/middleware"
	"github.com/manikandareas/genta/internal/model/analytics"
	"github.com/manikandareas/genta/internal/server"
	"github.com/manikandareas/genta/internal/service"
)

type AnalyticsHandler struct {
	Handler
	analyticsService *service.AnalyticsService
}

func NewAnalyticsHandler(s *server.Server, analyticsService *service.AnalyticsService) *AnalyticsHandler {
	return &AnalyticsHandler{
		Handler:          NewHandler(s),
		analyticsService: analyticsService,
	}
}

// GetProgress godoc
// @Summary Get progress analytics
// @Description Get user's progress analytics including accuracy trend and section breakdown
// @Tags analytics
// @Accept json
// @Produce json
// @Param days query int false "Period in days (7, 30, or 90)" default(7)
// @Param section query string false "Filter by section (PU, PPU, PBM, PK, LBI, LBE, PM)"
// @Success 200 {object} analytics.ProgressResponse
// @Failure 400 {object} errs.HTTPError
// @Failure 401 {object} errs.HTTPError
// @Failure 404 {object} errs.HTTPError
// @Router /analytics/progress [get]
func (h *AnalyticsHandler) GetProgress(c echo.Context) error {
	return Handle(
		h.Handler,
		func(c echo.Context, req *analytics.GetProgressRequest) (*analytics.ProgressResponse, error) {
			userID := middleware.GetUserID(c)
			return h.analyticsService.GetProgress(c, userID, req)
		},
		http.StatusOK,
		&analytics.GetProgressRequest{},
	)(c)
}
