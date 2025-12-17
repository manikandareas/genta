package service

import (
	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/errs"
	"github.com/manikandareas/genta/internal/middleware"
	"github.com/manikandareas/genta/internal/model"
	"github.com/manikandareas/genta/internal/model/question"
	"github.com/manikandareas/genta/internal/repository"
	"github.com/manikandareas/genta/internal/server"
)

type QuestionService struct {
	server       *server.Server
	questionRepo *repository.QuestionRepository
	userRepo     *repository.UserRepository
}

func NewQuestionService(server *server.Server, questionRepo *repository.QuestionRepository, userRepo *repository.UserRepository) *QuestionService {
	return &QuestionService{
		server:       server,
		questionRepo: questionRepo,
		userRepo:     userRepo,
	}
}

// GetByID retrieves a question by ID (includes correct answer for review)
func (s *QuestionService) GetByID(ctx echo.Context, questionID string) (*question.QuestionDetailResponse, error) {
	logger := middleware.GetLogger(ctx)

	q, err := s.questionRepo.GetByID(ctx.Request().Context(), questionID)
	if err != nil {
		logger.Error().Err(err).Str("question_id", questionID).Msg("failed to get question")
		return nil, err
	}

	response := q.ToDetailResponse()
	return &response, nil
}

// List retrieves questions with pagination and optional section filter
func (s *QuestionService) List(ctx echo.Context, req *question.ListQuestionsRequest) (*model.PaginatedResponse[question.QuestionResponse], error) {
	logger := middleware.GetLogger(ctx)

	questions, total, err := s.questionRepo.List(ctx.Request().Context(), req)
	if err != nil {
		logger.Error().Err(err).Msg("failed to list questions")
		return nil, err
	}

	// Convert to response (hide correct answers)
	responses := make([]question.QuestionResponse, len(questions))
	for i, q := range questions {
		responses[i] = q.ToResponse()
	}

	totalPages := total / req.Limit
	if total%req.Limit > 0 {
		totalPages++
	}

	return &model.PaginatedResponse[question.QuestionResponse]{
		Data:       responses,
		Page:       req.Page,
		Limit:      req.Limit,
		Total:      total,
		TotalPages: totalPages,
	}, nil
}

// GetNext retrieves the next question for a user based on section
func (s *QuestionService) GetNext(ctx echo.Context, clerkID string, section string) (*question.QuestionResponse, error) {
	logger := middleware.GetLogger(ctx)

	// Lookup user by Clerk ID to get database UUID
	user, err := s.userRepo.GetUserByClerkID(ctx.Request().Context(), clerkID)
	if err != nil {
		logger.Error().Err(err).
			Str("clerk_id", clerkID).
			Msg("failed to get user by clerk id")
		return nil, errs.NewNotFoundError("user not found", false, nil)
	}

	q, err := s.questionRepo.GetNextForUser(ctx.Request().Context(), user.ID.String(), section)
	if err != nil {
		logger.Error().Err(err).
			Str("user_id", user.ID.String()).
			Str("section", section).
			Msg("failed to get next question")
		return nil, err
	}

	response := q.ToResponse()

	logger.Info().
		Str("event", "question_served").
		Str("user_id", user.ID.String()).
		Str("question_id", q.ID.String()).
		Str("section", section).
		Msg("Next question served")

	return &response, nil
}
