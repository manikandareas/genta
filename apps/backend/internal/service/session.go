package service

import (
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/errs"
	"github.com/manikandareas/genta/internal/middleware"
	"github.com/manikandareas/genta/internal/model"
	"github.com/manikandareas/genta/internal/model/session"
	"github.com/manikandareas/genta/internal/repository"
	"github.com/manikandareas/genta/internal/server"
)

type SessionService struct {
	server      *server.Server
	sessionRepo *repository.SessionRepository
	userRepo    *repository.UserRepository
}

func NewSessionService(server *server.Server, sessionRepo *repository.SessionRepository, userRepo *repository.UserRepository) *SessionService {
	return &SessionService{
		server:      server,
		sessionRepo: sessionRepo,
		userRepo:    userRepo,
	}
}

// Create starts a new study session
func (s *SessionService) Create(ctx echo.Context, clerkID string, req *session.CreateSessionRequest) (*session.SessionResponse, error) {
	logger := middleware.GetLogger(ctx)

	user, err := s.userRepo.GetUserByClerkID(ctx.Request().Context(), clerkID)
	if err != nil {
		logger.Error().Err(err).Str("clerk_id", clerkID).Msg("failed to get user")
		return nil, errs.NewNotFoundError("user not found", false, nil)
	}

	sessionID := uuid.New().String()

	sess := &session.Session{
		ID:                 sessionID,
		UserID:             user.ID,
		StartedAt:          time.Now(),
		Section:            req.Section,
		QuestionsAttempted: 0,
		QuestionsCorrect:   0,
	}

	if err := s.sessionRepo.Create(ctx.Request().Context(), sess); err != nil {
		logger.Error().Err(err).Msg("failed to create session")
		return nil, err
	}

	logger.Info().
		Str("event", "session_started").
		Str("session_id", sessionID).
		Str("user_id", user.ID.String()).
		Msg("Study session started")

	response := sess.ToResponse()
	return &response, nil
}

// List retrieves sessions for a user with pagination
func (s *SessionService) List(ctx echo.Context, clerkID string, req *session.ListSessionsRequest) (*model.PaginatedResponse[session.SessionResponse], error) {
	logger := middleware.GetLogger(ctx)

	user, err := s.userRepo.GetUserByClerkID(ctx.Request().Context(), clerkID)
	if err != nil {
		logger.Error().Err(err).Str("clerk_id", clerkID).Msg("failed to get user")
		return nil, errs.NewNotFoundError("user not found", false, nil)
	}

	sessions, total, err := s.sessionRepo.List(ctx.Request().Context(), user.ID, req)
	if err != nil {
		logger.Error().Err(err).Msg("failed to list sessions")
		return nil, err
	}

	// Convert to response
	responses := make([]session.SessionResponse, len(sessions))
	for i, sess := range sessions {
		responses[i] = sess.ToResponse()
	}

	totalPages := total / req.Limit
	if total%req.Limit > 0 {
		totalPages++
	}

	return &model.PaginatedResponse[session.SessionResponse]{
		Data:       responses,
		Page:       req.Page,
		Limit:      req.Limit,
		Total:      total,
		TotalPages: totalPages,
	}, nil
}

// End ends a study session
func (s *SessionService) End(ctx echo.Context, clerkID string, sessionID string) (*session.SessionResponse, error) {
	logger := middleware.GetLogger(ctx)

	user, err := s.userRepo.GetUserByClerkID(ctx.Request().Context(), clerkID)
	if err != nil {
		logger.Error().Err(err).Str("clerk_id", clerkID).Msg("failed to get user")
		return nil, errs.NewNotFoundError("user not found", false, nil)
	}

	sess, err := s.sessionRepo.End(ctx.Request().Context(), sessionID, user.ID)
	if err != nil {
		logger.Error().Err(err).
			Str("session_id", sessionID).
			Msg("failed to end session")
		return nil, err
	}

	logger.Info().
		Str("event", "session_ended").
		Str("session_id", sessionID).
		Str("user_id", user.ID.String()).
		Int("questions_attempted", sess.QuestionsAttempted).
		Int("questions_correct", sess.QuestionsCorrect).
		Msg("Study session ended")

	response := sess.ToResponse()
	return &response, nil
}

// GetByID retrieves a session by ID (with ownership check)
func (s *SessionService) GetByID(ctx echo.Context, clerkID string, sessionID string) (*session.SessionResponse, error) {
	logger := middleware.GetLogger(ctx)

	user, err := s.userRepo.GetUserByClerkID(ctx.Request().Context(), clerkID)
	if err != nil {
		logger.Error().Err(err).Str("clerk_id", clerkID).Msg("failed to get user")
		return nil, errs.NewNotFoundError("user not found", false, nil)
	}

	sess, err := s.sessionRepo.GetByIDAndUserID(ctx.Request().Context(), sessionID, user.ID)
	if err != nil {
		logger.Error().Err(err).
			Str("session_id", sessionID).
			Msg("failed to get session")
		return nil, err
	}

	response := sess.ToResponse()
	return &response, nil
}
