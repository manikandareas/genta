package service

import (
	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/errs"
	"github.com/manikandareas/genta/internal/lib/job"
	"github.com/manikandareas/genta/internal/middleware"
	"github.com/manikandareas/genta/internal/model/attempt"
	"github.com/manikandareas/genta/internal/repository"
	"github.com/manikandareas/genta/internal/server"
)

type AttemptService struct {
	server       *server.Server
	attemptRepo  *repository.AttemptRepository
	questionRepo *repository.QuestionRepository
	userRepo     *repository.UserRepository
	jobService   *job.JobService
}

func NewAttemptService(
	server *server.Server,
	attemptRepo *repository.AttemptRepository,
	questionRepo *repository.QuestionRepository,
	userRepo *repository.UserRepository,
	jobService *job.JobService,
) *AttemptService {
	return &AttemptService{
		server:       server,
		attemptRepo:  attemptRepo,
		questionRepo: questionRepo,
		userRepo:     userRepo,
		jobService:   jobService,
	}
}

// Create records a new attempt and updates IRT theta
func (s *AttemptService) Create(ctx echo.Context, clerkID string, req *attempt.CreateAttemptRequest) (*attempt.AttemptResponse, error) {
	logger := middleware.GetLogger(ctx)

	// Get user by Clerk ID
	user, err := s.userRepo.GetUserByClerkID(ctx.Request().Context(), clerkID)
	if err != nil {
		logger.Error().Err(err).Str("clerk_id", clerkID).Msg("failed to get user")
		return nil, errs.NewNotFoundError("user not found", false, nil)
	}

	// Get question to check correct answer
	question, err := s.questionRepo.GetByID(ctx.Request().Context(), req.QuestionID)
	if err != nil {
		logger.Error().Err(err).Str("question_id", req.QuestionID).Msg("failed to get question")
		return nil, err
	}

	// Check if answer is correct
	isCorrect := req.SelectedAnswer == question.CorrectAnswer

	// Get current theta before attempt
	thetaBefore := user.IrtTheta
	if thetaBefore == nil {
		defaultTheta := 0.0
		thetaBefore = &defaultTheta
	}

	// Calculate new theta using simplified IRT update
	thetaAfter, thetaChange := s.calculateThetaUpdate(*thetaBefore, isCorrect, question.DifficultyIRT)

	// Create attempt
	questionUUID, _ := uuid.Parse(req.QuestionID)
	sessionID := req.SessionID

	newAttempt := &attempt.Attempt{
		ID:                uuid.New(),
		UserID:            user.ID,
		QuestionID:        questionUUID,
		SessionID:         &sessionID,
		SelectedAnswer:    req.SelectedAnswer,
		IsCorrect:         isCorrect,
		TimeSpentSeconds:  req.TimeSpentSeconds,
		UserThetaBefore:   thetaBefore,
		UserThetaAfter:    &thetaAfter,
		ThetaChange:       &thetaChange,
		FeedbackGenerated: false,
	}

	created, err := s.attemptRepo.Create(ctx.Request().Context(), newAttempt)
	if err != nil {
		logger.Error().Err(err).Msg("failed to create attempt")
		return nil, err
	}

	// Update question statistics (async-safe, non-blocking)
	go func() {
		_ = s.attemptRepo.UpdateQuestionStats(ctx.Request().Context(), questionUUID, isCorrect, req.TimeSpentSeconds)
	}()

	// Enqueue feedback generation task
	var jobID string
	if s.jobService != nil {
		task, err := job.NewFeedbackGenerationTask(
			created.ID.String(),
			user.ID.String(),
			req.QuestionID,
			isCorrect,
		)
		if err != nil {
			logger.Warn().Err(err).Msg("failed to create feedback generation task")
		} else {
			info, err := s.jobService.Client.Enqueue(task)
			if err != nil {
				logger.Warn().Err(err).Msg("failed to enqueue feedback generation task")
			} else {
				jobID = info.ID
				logger.Info().
					Str("job_id", jobID).
					Str("attempt_id", created.ID.String()).
					Msg("Feedback generation task enqueued")
			}
		}
	}

	logger.Info().
		Str("event", "attempt_created").
		Str("user_id", user.ID.String()).
		Str("question_id", req.QuestionID).
		Bool("is_correct", isCorrect).
		Float64("theta_change", thetaChange).
		Msg("Attempt recorded")

	response := created.ToResponseWithJob(jobID)
	return &response, nil
}

// GetByID retrieves an attempt with question and feedback details
func (s *AttemptService) GetByID(ctx echo.Context, clerkID string, attemptID string) (*attempt.AttemptDetailResponse, error) {
	logger := middleware.GetLogger(ctx)

	// Get user by Clerk ID
	user, err := s.userRepo.GetUserByClerkID(ctx.Request().Context(), clerkID)
	if err != nil {
		logger.Error().Err(err).Str("clerk_id", clerkID).Msg("failed to get user")
		return nil, errs.NewNotFoundError("user not found", false, nil)
	}

	// Get attempt with details (includes ownership check)
	a, err := s.attemptRepo.GetByIDWithDetails(ctx.Request().Context(), attemptID, user.ID)
	if err != nil {
		logger.Error().Err(err).
			Str("attempt_id", attemptID).
			Str("user_id", user.ID.String()).
			Msg("failed to get attempt")
		return nil, err
	}

	response := a.ToDetailResponse()
	return &response, nil
}

// UpdateFeedbackRating updates the helpfulness rating for feedback
func (s *AttemptService) UpdateFeedbackRating(ctx echo.Context, clerkID string, attemptID string, isHelpful bool) (*attempt.FeedbackRatingResponse, error) {
	logger := middleware.GetLogger(ctx)

	// Get user by Clerk ID
	user, err := s.userRepo.GetUserByClerkID(ctx.Request().Context(), clerkID)
	if err != nil {
		logger.Error().Err(err).Str("clerk_id", clerkID).Msg("failed to get user")
		return nil, errs.NewNotFoundError("user not found", false, nil)
	}

	// Update feedback rating (includes ownership check)
	err = s.attemptRepo.UpdateFeedbackRating(ctx.Request().Context(), attemptID, user.ID, isHelpful)
	if err != nil {
		logger.Error().Err(err).
			Str("attempt_id", attemptID).
			Bool("is_helpful", isHelpful).
			Msg("failed to update feedback rating")
		return nil, err
	}

	attemptUUID, _ := uuid.Parse(attemptID)

	logger.Info().
		Str("event", "feedback_rated").
		Str("attempt_id", attemptID).
		Bool("is_helpful", isHelpful).
		Msg("Feedback rating updated")

	return &attempt.FeedbackRatingResponse{
		AttemptID: attemptUUID,
		IsHelpful: isHelpful,
	}, nil
}

// calculateThetaUpdate calculates new theta using simplified IRT model
// This is a basic implementation - can be enhanced with full 3PL IRT model
func (s *AttemptService) calculateThetaUpdate(currentTheta float64, isCorrect bool, difficulty *float64) (newTheta float64, change float64) {
	// Default difficulty if not set
	diff := 0.0
	if difficulty != nil {
		diff = *difficulty
	}

	// Learning rate (step size for theta update)
	learningRate := 0.1

	// Expected probability of correct answer using logistic function
	// P(correct) = 1 / (1 + exp(-(theta - difficulty)))
	expVal := -(currentTheta - diff)
	if expVal > 10 {
		expVal = 10 // Prevent overflow
	} else if expVal < -10 {
		expVal = -10
	}

	// Simplified update rule:
	// If correct: theta increases proportionally to (1 - P(correct))
	// If incorrect: theta decreases proportionally to P(correct)
	if isCorrect {
		// Reward more for harder questions (lower expected probability)
		change = learningRate * (1.0 + diff - currentTheta) * 0.5
		if change < 0.01 {
			change = 0.01 // Minimum positive change
		}
		if change > 0.3 {
			change = 0.3 // Cap maximum change
		}
	} else {
		// Penalize more for easier questions (higher expected probability)
		change = -learningRate * (1.0 + currentTheta - diff) * 0.5
		if change > -0.01 {
			change = -0.01 // Minimum negative change
		}
		if change < -0.3 {
			change = -0.3 // Cap maximum change
		}
	}

	newTheta = currentTheta + change

	// Clamp theta to reasonable bounds [-3, 3]
	if newTheta > 3.0 {
		newTheta = 3.0
	} else if newTheta < -3.0 {
		newTheta = -3.0
	}

	return newTheta, change
}
