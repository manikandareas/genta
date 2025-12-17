package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/middleware"
	"github.com/manikandareas/genta/internal/model/readiness"
	"github.com/manikandareas/genta/internal/server"
	"github.com/manikandareas/genta/internal/service"
)

type ReadinessHandler struct {
	Handler
	readinessService *service.ReadinessService
}

func NewReadinessHandler(s *server.Server, readinessService *service.ReadinessService) *ReadinessHandler {
	return &ReadinessHandler{
		Handler:          NewHandler(s),
		readinessService: readinessService,
	}
}

// GetReadinessOverview godoc
// @Summary Get readiness overview
// @Description Get overall readiness across all UTBK sections for the current user
// @Tags readiness
// @Accept json
// @Produce json
// @Success 200 {object} readiness.ReadinessOverviewResponse
// @Failure 401 {object} errs.HTTPError
// @Failure 404 {object} errs.HTTPError
// @Router /readiness [get]
func (h *ReadinessHandler) GetReadinessOverview(c echo.Context) error {
	return Handle(
		h.Handler,
		func(c echo.Context, req *readiness.GetUserReadinessRequest) (*readiness.ReadinessOverviewResponse, error) {
			userID := middleware.GetUserID(c)
			return h.readinessService.GetOverview(c, userID)
		},
		http.StatusOK,
		&readiness.GetUserReadinessRequest{},
	)(c)
}

// GetSectionReadiness godoc
// @Summary Get section readiness detail
// @Description Get detailed readiness for a specific UTBK section including subtype breakdown and trends
// @Tags readiness
// @Accept json
// @Produce json
// @Param section path string true "Section code (PU, PPU, PBM, PK, LBI, LBE, PM)"
// @Success 200 {object} readiness.SectionDetailResponse
// @Failure 400 {object} errs.HTTPError
// @Failure 401 {object} errs.HTTPError
// @Failure 404 {object} errs.HTTPError
// @Router /readiness/{section} [get]
func (h *ReadinessHandler) GetSectionReadiness(c echo.Context) error {
	return Handle(
		h.Handler,
		func(c echo.Context, req *readiness.GetSectionReadinessRequest) (*readiness.SectionDetailResponse, error) {
			userID := middleware.GetUserID(c)
			return h.readinessService.GetBySection(c, userID, req.Section)
		},
		http.StatusOK,
		&readiness.GetSectionReadinessRequest{},
	)(c)
}

// UpdateSectionReadiness godoc
// @Summary Update section readiness settings
// @Description Update target theta for a specific section
// @Tags readiness
// @Accept json
// @Produce json
// @Param section path string true "Section code (PU, PPU, PBM, PK, LBI, LBE, PM)"
// @Param body body readiness.UpdateUserReadinessRequest true "Update data"
// @Success 200 {object} readiness.ReadinessResponse
// @Failure 400 {object} errs.HTTPError
// @Failure 401 {object} errs.HTTPError
// @Failure 404 {object} errs.HTTPError
// @Router /readiness/{section} [patch]
func (h *ReadinessHandler) UpdateSectionReadiness(c echo.Context) error {
	return Handle(
		h.Handler,
		func(c echo.Context, req *UpdateSectionReadinessInput) (*readiness.ReadinessResponse, error) {
			userID := middleware.GetUserID(c)
			return h.readinessService.UpdateTargetTheta(c, userID, req.Section, &req.UpdateUserReadinessRequest)
		},
		http.StatusOK,
		&UpdateSectionReadinessInput{},
	)(c)
}

// UpdateSectionReadinessInput combines path param and body for update
type UpdateSectionReadinessInput struct {
	Section string `param:"section" validate:"required,oneof=PU PPU PBM PK LBI LBE PM"`
	readiness.UpdateUserReadinessRequest
}

func (r *UpdateSectionReadinessInput) Validate() error {
	if err := r.UpdateUserReadinessRequest.Validate(); err != nil {
		return err
	}
	return nil
}
