package service

import (
	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/errs"
	"github.com/manikandareas/genta/internal/middleware"
	"github.com/manikandareas/genta/internal/model/analytics"
	"github.com/manikandareas/genta/internal/repository"
	"github.com/manikandareas/genta/internal/server"
)

type AnalyticsService struct {
	server        *server.Server
	analyticsRepo *repository.AnalyticsRepository
	userRepo      *repository.UserRepository
}

func NewAnalyticsService(
	server *server.Server,
	analyticsRepo *repository.AnalyticsRepository,
	userRepo *repository.UserRepository,
) *AnalyticsService {
	return &AnalyticsService{
		server:        server,
		analyticsRepo: analyticsRepo,
		userRepo:      userRepo,
	}
}

// GetProgress retrieves progress analytics for the authenticated user
func (s *AnalyticsService) GetProgress(ctx echo.Context, clerkID string, req *analytics.GetProgressRequest) (*analytics.ProgressResponse, error) {
	logger := middleware.GetLogger(ctx)

	// Get user by clerk ID
	user, err := s.userRepo.GetUserByClerkID(ctx.Request().Context(), clerkID)
	if err != nil {
		logger.Error().Err(err).Str("clerk_id", clerkID).Msg("failed to get user")
		return nil, errs.NewNotFoundError("user not found", false, nil)
	}

	// Set defaults
	req.SetDefaults()

	// Get progress analytics from repository
	progress, err := s.analyticsRepo.GetProgressAnalytics(ctx.Request().Context(), user.ID, req.Days, req.Section)
	if err != nil {
		logger.Error().Err(err).
			Int("days", req.Days).
			Str("section", req.Section).
			Msg("failed to get progress analytics")
		return nil, err
	}

	// Convert to response
	response := progress.ToResponse()

	logger.Debug().
		Str("user_id", user.ID.String()).
		Int("period_days", req.Days).
		Int("total_attempts", response.TotalQuestionsAttempted).
		Float64("average_accuracy", response.AverageAccuracy).
		Msg("Progress analytics retrieved")

	return &response, nil
}
