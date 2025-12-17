package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/middleware"
	"github.com/manikandareas/genta/internal/model/attempt"
	"github.com/manikandareas/genta/internal/server"
	"github.com/manikandareas/genta/internal/service"
)

type AttemptHandler struct {
	Handler
	attemptService *service.AttemptService
}

func NewAttemptHandler(s *server.Server, attemptService *service.AttemptService) *AttemptHandler {
	return &AttemptHandler{
		Handler:        NewHandler(s),
		attemptService: attemptService,
	}
}

// CreateAttempt godoc
// @Summary Record an answer attempt
// @Description Record a student's answer attempt and calculate IRT theta update
// @Tags attempts
// @Accept json
// @Produce json
// @Param body body attempt.CreateAttemptRequest true "Attempt data"
// @Success 201 {object} attempt.AttemptResponse
// @Failure 400 {object} errs.HTTPError
// @Failure 404 {object} errs.HTTPError
// @Router /attempts [post]
func (h *AttemptHandler) CreateAttempt(c echo.Context) error {
	return Handle(
		h.Handler,
		func(c echo.Context, req *attempt.CreateAttemptRequest) (*attempt.AttemptResponse, error) {
			userID := middleware.GetUserID(c)
			return h.attemptService.Create(c, userID, req)
		},
		http.StatusCreated,
		&attempt.CreateAttemptRequest{},
	)(c)
}

// GetAttempt godoc
// @Summary Get attempt by ID
// @Description Get attempt details with question and feedback
// @Tags attempts
// @Accept json
// @Produce json
// @Param attempt_id path string true "Attempt ID"
// @Success 200 {object} attempt.AttemptDetailResponse
// @Failure 403 {object} errs.HTTPError
// @Failure 404 {object} errs.HTTPError
// @Router /attempts/{attempt_id} [get]
func (h *AttemptHandler) GetAttempt(c echo.Context) error {
	return Handle(
		h.Handler,
		func(c echo.Context, req *attempt.GetAttemptRequest) (*attempt.AttemptDetailResponse, error) {
			userID := middleware.GetUserID(c)
			return h.attemptService.GetByID(c, userID, req.AttemptID)
		},
		http.StatusOK,
		&attempt.GetAttemptRequest{},
	)(c)
}

// UpdateFeedbackRating godoc
// @Summary Rate feedback helpfulness
// @Description Update the helpfulness rating for attempt feedback (thumbs up/down)
// @Tags attempts
// @Accept json
// @Produce json
// @Param attempt_id path string true "Attempt ID"
// @Param body body attempt.UpdateFeedbackRatingRequest true "Rating data"
// @Success 200 {object} attempt.FeedbackRatingResponse
// @Failure 403 {object} errs.HTTPError
// @Failure 404 {object} errs.HTTPError
// @Router /attempts/{attempt_id}/feedback-rating [put]
func (h *AttemptHandler) UpdateFeedbackRating(c echo.Context) error {
	return Handle(
		h.Handler,
		func(c echo.Context, req *attempt.UpdateFeedbackRatingRequest) (*attempt.FeedbackRatingResponse, error) {
			userID := middleware.GetUserID(c)
			return h.attemptService.UpdateFeedbackRating(c, userID, req.AttemptID, req.IsHelpful)
		},
		http.StatusOK,
		&attempt.UpdateFeedbackRatingRequest{},
	)(c)
}
