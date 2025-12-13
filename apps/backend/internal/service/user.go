package service

import (
	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/errs"
	"github.com/manikandareas/genta/internal/middleware"
	"github.com/manikandareas/genta/internal/model/user"
	"github.com/manikandareas/genta/internal/repository"
	"github.com/manikandareas/genta/internal/server"
)

type UserService struct {
	server   *server.Server
	userRepo *repository.UserRepository
}

func NewUserService(server *server.Server, userRepo *repository.UserRepository) *UserService {
	return &UserService{
		server:   server,
		userRepo: userRepo,
	}
}

func (s *UserService) UpdateUser(ctx echo.Context, userID string, request *user.PutUserRequest) (*user.User, error) {
	logger := middleware.GetLogger(ctx)

	// validate user exist

	_, err := s.userRepo.GetUserByID(ctx.Request().Context(), userID)
	if err != nil {
		err = errs.NewNotFoundError("user not found", false, nil)
		logger.Error().Err(err).Msg("failed to update user")
		return nil, err
	}

	updatedUser, err := s.userRepo.PutUser(ctx.Request().Context(), userID, request)
	if err != nil {
		logger.Error().Err(err).Msg("failed to update user")
		return nil, err
	}

	eventLogger := middleware.GetLogger(ctx)
	eventLogger.Info().
		Str("event", "user_updated").
		Str("user_id", updatedUser.ID.String()).
		Str("full_name", *updatedUser.FullName).
		Str("clerk_id", updatedUser.ClerkID).
		Msg("User updated successfully")

	return updatedUser, nil
}

func (s *UserService) GetUser(ctx echo.Context, userID string) (*user.User, error) {
	logger := middleware.GetLogger(ctx)

	user, err := s.userRepo.GetUserByID(ctx.Request().Context(), userID)
	if err != nil {
		logger.Error().Err(err).Msg("failed to get user")
		return nil, err
	}

	return user, nil
}
