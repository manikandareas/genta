package service

import (
	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/errs"
	"github.com/manikandareas/genta/internal/middleware"
	"github.com/manikandareas/genta/internal/model/readiness"
	"github.com/manikandareas/genta/internal/repository"
	"github.com/manikandareas/genta/internal/server"
)

type ReadinessService struct {
	server        *server.Server
	readinessRepo *repository.ReadinessRepository
	userRepo      *repository.UserRepository
}

func NewReadinessService(
	server *server.Server,
	readinessRepo *repository.ReadinessRepository,
	userRepo *repository.UserRepository,
) *ReadinessService {
	return &ReadinessService{
		server:        server,
		readinessRepo: readinessRepo,
		userRepo:      userRepo,
	}
}

// GetOverview retrieves overall readiness across all sections
func (s *ReadinessService) GetOverview(ctx echo.Context, clerkID string) (*readiness.ReadinessOverviewResponse, error) {
	logger := middleware.GetLogger(ctx)

	user, err := s.userRepo.GetUserByClerkID(ctx.Request().Context(), clerkID)
	if err != nil {
		logger.Error().Err(err).Str("clerk_id", clerkID).Msg("failed to get user")
		return nil, errs.NewNotFoundError("user not found", false, nil)
	}

	// Get all readiness with stats
	allReadiness, err := s.readinessRepo.GetAllWithStats(ctx.Request().Context(), user.ID)
	if err != nil {
		logger.Error().Err(err).Msg("failed to get readiness")
		return nil, err
	}

	// If no readiness records, create initial ones
	if len(allReadiness) == 0 {
		created, err := s.readinessRepo.CreateInitialReadiness(ctx.Request().Context(), user.ID)
		if err != nil {
			logger.Error().Err(err).Msg("failed to create initial readiness")
			return nil, err
		}
		// Convert to WithStats (no stats yet for new user)
		for _, r := range created {
			allReadiness = append(allReadiness, readiness.UserReadinessWithStats{UserReadiness: r})
		}
	}

	// Build response
	response := s.buildOverviewResponse(allReadiness)

	logger.Debug().
		Str("user_id", user.ID.String()).
		Float64("overall_readiness", response.OverallReadiness).
		Msg("Readiness overview retrieved")

	return response, nil
}

// GetBySection retrieves detailed readiness for a specific section
func (s *ReadinessService) GetBySection(ctx echo.Context, clerkID string, section string) (*readiness.SectionDetailResponse, error) {
	logger := middleware.GetLogger(ctx)

	user, err := s.userRepo.GetUserByClerkID(ctx.Request().Context(), clerkID)
	if err != nil {
		logger.Error().Err(err).Str("clerk_id", clerkID).Msg("failed to get user")
		return nil, errs.NewNotFoundError("user not found", false, nil)
	}

	// Get readiness with stats
	ur, err := s.readinessRepo.GetWithStats(ctx.Request().Context(), user.ID, section)
	if err != nil {
		// If not found, create initial readiness for this section
		if httpErr, ok := err.(*errs.HTTPError); ok && httpErr.Status == 404 {
			_, createErr := s.readinessRepo.CreateInitialReadiness(ctx.Request().Context(), user.ID)
			if createErr != nil {
				logger.Error().Err(createErr).Msg("failed to create initial readiness")
				return nil, createErr
			}
			// Retry get
			ur, err = s.readinessRepo.GetWithStats(ctx.Request().Context(), user.ID, section)
			if err != nil {
				return nil, err
			}
		} else {
			logger.Error().Err(err).Str("section", section).Msg("failed to get section readiness")
			return nil, err
		}
	}

	// Get subtype breakdown
	subtypes, err := s.readinessRepo.GetSubtypeAccuracy(ctx.Request().Context(), user.ID, section)
	if err != nil {
		logger.Warn().Err(err).Msg("failed to get subtype accuracy, continuing without it")
		subtypes = []readiness.SubtypeAccuracy{}
	}

	// Get accuracy trend (last 30 days)
	trend, err := s.readinessRepo.GetAccuracyTrend(ctx.Request().Context(), user.ID, section, 30)
	if err != nil {
		logger.Warn().Err(err).Msg("failed to get accuracy trend, continuing without it")
		trend = []readiness.AccuracyTrendPoint{}
	}

	// Build response
	response := s.buildSectionDetailResponse(ur, subtypes, trend)

	logger.Debug().
		Str("user_id", user.ID.String()).
		Str("section", section).
		Float64("readiness_percentage", response.ReadinessPercentage).
		Msg("Section readiness retrieved")

	return response, nil
}

// UpdateTargetTheta updates the target theta for a section
func (s *ReadinessService) UpdateTargetTheta(ctx echo.Context, clerkID string, section string, req *readiness.UpdateUserReadinessRequest) (*readiness.ReadinessResponse, error) {
	logger := middleware.GetLogger(ctx)

	user, err := s.userRepo.GetUserByClerkID(ctx.Request().Context(), clerkID)
	if err != nil {
		logger.Error().Err(err).Str("clerk_id", clerkID).Msg("failed to get user")
		return nil, errs.NewNotFoundError("user not found", false, nil)
	}

	if req.TargetTheta != nil {
		if err := s.readinessRepo.UpdateTargetTheta(ctx.Request().Context(), user.ID, section, *req.TargetTheta); err != nil {
			logger.Error().Err(err).Str("section", section).Msg("failed to update target theta")
			return nil, err
		}
	}

	// Get updated readiness
	ur, err := s.readinessRepo.GetBySection(ctx.Request().Context(), user.ID, section)
	if err != nil {
		return nil, err
	}

	response := ur.ToResponse()

	logger.Info().
		Str("event", "target_theta_updated").
		Str("user_id", user.ID.String()).
		Str("section", section).
		Msg("Target theta updated")

	return &response, nil
}

// RefreshReadiness recalculates readiness stats for a section (called after attempt)
func (s *ReadinessService) RefreshReadiness(ctx echo.Context, clerkID string, section string) error {
	logger := middleware.GetLogger(ctx)

	user, err := s.userRepo.GetUserByClerkID(ctx.Request().Context(), clerkID)
	if err != nil {
		logger.Error().Err(err).Str("clerk_id", clerkID).Msg("failed to get user")
		return errs.NewNotFoundError("user not found", false, nil)
	}

	if err := s.readinessRepo.UpdateReadiness(ctx.Request().Context(), user.ID, section); err != nil {
		logger.Error().Err(err).Str("section", section).Msg("failed to refresh readiness")
		return err
	}

	logger.Debug().
		Str("user_id", user.ID.String()).
		Str("section", section).
		Msg("Readiness refreshed")

	return nil
}

// === Helper methods ===

// buildOverviewResponse builds the overview response from readiness data
func (s *ReadinessService) buildOverviewResponse(allReadiness []readiness.UserReadinessWithStats) *readiness.ReadinessOverviewResponse {
	response := &readiness.ReadinessOverviewResponse{
		SectionReadiness: make(map[string]readiness.ReadinessResponse),
	}

	var totalReadiness float64
	var tpsReadiness float64
	var literasiReadiness float64
	var tpsCount, literasiCount int

	var weakestSection *string
	var strongestSection *string
	var minReadiness float64 = 101
	var maxReadiness float64 = -1

	tpsSections := map[string]bool{"PU": true, "PPU": true, "PBM": true, "PK": true}

	for _, ur := range allReadiness {
		resp := ur.ToResponse()
		response.SectionReadiness[ur.Section] = resp

		response.TotalAttempts += ur.TotalAttemptsCount
		response.TotalCorrect += ur.TotalCorrectCount

		readinessVal := resp.ReadinessPercentage
		totalReadiness += readinessVal

		// Track TPS vs Literasi
		if tpsSections[ur.Section] {
			tpsReadiness += readinessVal
			tpsCount++
		} else {
			literasiReadiness += readinessVal
			literasiCount++
		}

		// Track weakest/strongest
		if readinessVal < minReadiness {
			minReadiness = readinessVal
			section := ur.Section
			weakestSection = &section
		}
		if readinessVal > maxReadiness {
			maxReadiness = readinessVal
			section := ur.Section
			strongestSection = &section
		}
	}

	// Calculate averages
	sectionCount := len(allReadiness)
	if sectionCount > 0 {
		response.OverallReadiness = totalReadiness / float64(sectionCount)
	}
	if tpsCount > 0 {
		response.TPSReadiness = tpsReadiness / float64(tpsCount)
	}
	if literasiCount > 0 {
		response.LiterasiReadiness = literasiReadiness / float64(literasiCount)
	}

	// Calculate overall accuracy
	if response.TotalAttempts > 0 {
		response.OverallAccuracy = float64(response.TotalCorrect) / float64(response.TotalAttempts)
	}

	response.WeakestSection = weakestSection
	response.StrongestSection = strongestSection

	// Set recommended practice (weakest section)
	if weakestSection != nil && minReadiness < 80 {
		response.RecommendedPractice = weakestSection
	}

	return response
}

// buildSectionDetailResponse builds detailed section response
func (s *ReadinessService) buildSectionDetailResponse(
	ur *readiness.UserReadinessWithStats,
	subtypes []readiness.SubtypeAccuracy,
	trend []readiness.AccuracyTrendPoint,
) *readiness.SectionDetailResponse {
	baseResponse := ur.ToResponse()

	response := &readiness.SectionDetailResponse{
		ReadinessResponse: baseResponse,
		AccuracyTrend:     trend,
	}

	// Convert subtypes
	for _, st := range subtypes {
		response.SubtypeBreakdown = append(response.SubtypeBreakdown, st.ToResponse())
	}

	// Build next steps
	response.NextSteps = s.buildNextSteps(ur)

	return response
}

// buildNextSteps generates recommendations based on readiness
func (s *ReadinessService) buildNextSteps(ur *readiness.UserReadinessWithStats) *readiness.NextStepsResponse {
	nextSteps := &readiness.NextStepsResponse{}

	readinessPercentage := float64(0)
	if ur.ReadinessPercentage != nil {
		readinessPercentage = *ur.ReadinessPercentage
	}

	if readinessPercentage >= 80 {
		nextSteps.IsReady = true
		nextSteps.Message = "Selamat! Kamu sudah siap untuk section ini. Tetap latihan untuk mempertahankan kemampuan."
	} else {
		nextSteps.IsReady = false

		if ur.DaysToReady != nil && *ur.DaysToReady > 0 {
			days := *ur.DaysToReady
			nextSteps.Message = "Terus berlatih! Estimasi kamu akan siap dalam " + string(rune(days)) + " hari."

			// Suggest daily practice based on gap
			gap := 80 - readinessPercentage
			suggestedDaily := int(gap / 5) // rough estimate
			if suggestedDaily < 5 {
				suggestedDaily = 5
			}
			if suggestedDaily > 20 {
				suggestedDaily = 20
			}
			nextSteps.SuggestedDailyPractice = &suggestedDaily
		} else {
			nextSteps.Message = "Mulai berlatih untuk meningkatkan readiness kamu di section ini."
			defaultDaily := 10
			nextSteps.SuggestedDailyPractice = &defaultDaily
		}

		if ur.ReadyByDate != nil {
			date := ur.ReadyByDate.Format("2006-01-02")
			nextSteps.EstimatedCompletionDate = &date
		}
	}

	return nextSteps
}
