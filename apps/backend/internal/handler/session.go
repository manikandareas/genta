package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/middleware"
	"github.com/manikandareas/genta/internal/model"
	"github.com/manikandareas/genta/internal/model/session"
	"github.com/manikandareas/genta/internal/server"
	"github.com/manikandareas/genta/internal/service"
)

type SessionHandler struct {
	Handler
	sessionService *service.SessionService
}

func NewSessionHandler(s *server.Server, sessionService *service.SessionService) *SessionHandler {
	return &SessionHandler{
		Handler:        NewHandler(s),
		sessionService: sessionService,
	}
}

// CreateSession godoc
// @Summary Start a new study session
// @Description Start a new study session for the current user
// @Tags sessions
// @Accept json
// @Produce json
// @Param body body session.CreateSessionRequest true "Session data"
// @Success 201 {object} session.SessionResponse
// @Failure 400 {object} errs.HTTPError
// @Failure 401 {object} errs.HTTPError
// @Router /sessions [post]
func (h *SessionHandler) CreateSession(c echo.Context) error {
	return Handle(
		h.Handler,
		func(c echo.Context, req *session.CreateSessionRequest) (*session.SessionResponse, error) {
			userID := middleware.GetUserID(c)
			return h.sessionService.Create(c, userID, req)
		},
		http.StatusCreated,
		&session.CreateSessionRequest{},
	)(c)
}

// ListSessions godoc
// @Summary List study sessions
// @Description Get paginated list of study sessions for the current user
// @Tags sessions
// @Accept json
// @Produce json
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Success 200 {object} model.PaginatedResponse[session.SessionResponse]
// @Failure 401 {object} errs.HTTPError
// @Router /sessions [get]
func (h *SessionHandler) ListSessions(c echo.Context) error {
	return Handle(
		h.Handler,
		func(c echo.Context, req *session.ListSessionsRequest) (*model.PaginatedResponse[session.SessionResponse], error) {
			userID := middleware.GetUserID(c)
			return h.sessionService.List(c, userID, req)
		},
		http.StatusOK,
		&session.ListSessionsRequest{},
	)(c)
}

// EndSession godoc
// @Summary End a study session
// @Description End a study session and calculate duration/accuracy
// @Tags sessions
// @Accept json
// @Produce json
// @Param session_id path string true "Session ID"
// @Success 200 {object} session.SessionResponse
// @Failure 400 {object} errs.HTTPError
// @Failure 401 {object} errs.HTTPError
// @Failure 404 {object} errs.HTTPError
// @Router /sessions/{session_id}/end [put]
func (h *SessionHandler) EndSession(c echo.Context) error {
	return Handle(
		h.Handler,
		func(c echo.Context, req *session.EndSessionRequest) (*session.SessionResponse, error) {
			userID := middleware.GetUserID(c)
			return h.sessionService.End(c, userID, req.SessionID)
		},
		http.StatusOK,
		&session.EndSessionRequest{},
	)(c)
}

// GetSession godoc
// @Summary Get a study session by ID
// @Description Get details of a specific study session
// @Tags sessions
// @Accept json
// @Produce json
// @Param session_id path string true "Session ID"
// @Success 200 {object} session.SessionResponse
// @Failure 401 {object} errs.HTTPError
// @Failure 404 {object} errs.HTTPError
// @Router /sessions/{session_id} [get]
func (h *SessionHandler) GetSession(c echo.Context) error {
	return Handle(
		h.Handler,
		func(c echo.Context, req *session.GetSessionRequest) (*session.SessionResponse, error) {
			userID := middleware.GetUserID(c)
			return h.sessionService.GetByID(c, userID, req.SessionID)
		},
		http.StatusOK,
		&session.GetSessionRequest{},
	)(c)
}
