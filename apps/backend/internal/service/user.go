package service

import (
	"fmt"
	"strings"

	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/errs"
	"github.com/manikandareas/genta/internal/lib/clerk"
	"github.com/manikandareas/genta/internal/middleware"
	"github.com/manikandareas/genta/internal/model/user"
	"github.com/manikandareas/genta/internal/repository"
	"github.com/manikandareas/genta/internal/server"
)

type UserService struct {
	server      *server.Server
	userRepo    *repository.UserRepository
	clerkClient *clerk.Clerk
}

func NewUserService(server *server.Server, userRepo *repository.UserRepository, clerkClient *clerk.Clerk) *UserService {
	return &UserService{
		server:      server,
		userRepo:    userRepo,
		clerkClient: clerkClient,
	}
}

func (s *UserService) UpdateUser(ctx echo.Context, clerkID string, request *user.PutUserRequest) (*user.User, error) {
	logger := middleware.GetLogger(ctx)

	// validate user exist by clerk_id
	existingUser, err := s.userRepo.GetUserByClerkID(ctx.Request().Context(), clerkID)
	if err != nil {
		err = errs.NewNotFoundError("user not found", false, nil)
		logger.Error().Err(err).Msg("failed to update user")
		return nil, err
	}

	// use database UUID for update
	updatedUser, err := s.userRepo.PutUser(ctx.Request().Context(), existingUser.ID.String(), request)
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

func (s *UserService) GetUser(ctx echo.Context, clerkID string) (*user.User, error) {
	logger := middleware.GetLogger(ctx)

	user, err := s.userRepo.GetUserByClerkID(ctx.Request().Context(), clerkID)
	if err != nil {
		logger.Error().Err(err).Msg("failed to get user")
		return nil, err
	}

	return user, nil
}

func (s *UserService) CompleteOnboarding(ctx echo.Context, clerkID string, request *user.CompleteOnboardingRequest) (*user.CompleteOnboardingResponse, error) {
	logger := middleware.GetLogger(ctx)

	// validate user exist by clerk_id, create if not exist
	_, err := s.userRepo.GetUserByClerkID(ctx.Request().Context(), clerkID)
	if err != nil {
		logger.Info().Str("clerk_id", clerkID).Msg("user not found, creating new user")

		userFromClerk, err := s.clerkClient.User.Get(ctx.Request().Context(), clerkID)
		if err != nil {
			logger.Error().Err(err).Msg("failed to get user from clerk")
			return nil, err
		}

		// Build full name from Clerk user data
		var fullName *string
		if userFromClerk.FirstName != nil || userFromClerk.LastName != nil {
			firstName := ""
			lastName := ""
			if userFromClerk.FirstName != nil {
				firstName = *userFromClerk.FirstName
			}
			if userFromClerk.LastName != nil {
				lastName = *userFromClerk.LastName
			}
			name := fmt.Sprintf("%s %s", firstName, lastName)
			name = strings.TrimSpace(name)
			if name != "" {
				fullName = &name
			}
		}

		// Get avatar URL from Clerk
		var avatarUrl *string
		if userFromClerk.ImageURL != nil && *userFromClerk.ImageURL != "" {
			avatarUrl = userFromClerk.ImageURL
		}

		// Get primary email
		email := ""
		if len(userFromClerk.EmailAddresses) > 0 {
			email = userFromClerk.EmailAddresses[0].EmailAddress
		}

		_, err = s.userRepo.CreateUser(ctx.Request().Context(), &user.CreateUserRequest{
			ClerkID:   clerkID,
			Email:     email,
			FullName:  fullName,
			AvatarUrl: avatarUrl,
		})
		if err != nil {
			logger.Error().Err(err).Msg("failed to create user")
			return nil, err
		}
	}

	err = s.userRepo.CompleteOnboarding(ctx.Request().Context(), clerkID, request)
	if err != nil {
		logger.Error().Err(err).Msg("failed to complete onboarding")
		return nil, err
	}

	logger.Info().
		Str("event", "onboarding_completed").
		Str("clerk_id", clerkID).
		Msg("Onboarding completed successfully")

	return &user.CompleteOnboardingResponse{
		TargetPtn:         request.TargetPtn,
		TargetScore:       request.TargetScore,
		ExamDate:          request.ExamDate,
		StudyHoursPerWeek: request.StudyHoursPerWeek,
	}, nil
}
