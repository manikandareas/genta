package repository

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/manikandareas/genta/internal/errs"
	"github.com/manikandareas/genta/internal/model/user"
	"github.com/manikandareas/genta/internal/server"
)

type UserRepository struct {
	server *server.Server
}

func NewUserRepository(server *server.Server) *UserRepository {
	return &UserRepository{server: server}
}

func (r *UserRepository) PutUser(ctx context.Context, userID string, request *user.PutUserRequest) (*user.User, error) {
	args := pgx.NamedArgs{
		"id": userID,
	}

	setClauses := []string{"updated_at = NOW()"}

	if request.FullName != nil {
		setClauses = append(setClauses, "full_name = @full_name")
		args["full_name"] = *request.FullName
	}

	if request.TargetPtn != nil {
		setClauses = append(setClauses, "target_ptn = @target_ptn")
		args["target_ptn"] = *request.TargetPtn
	}

	if request.TargetScore != nil {
		setClauses = append(setClauses, "target_score = @target_score")
		args["target_score"] = *request.TargetScore
	}

	if request.ExamDate != nil {
		setClauses = append(setClauses, "exam_date = @exam_date")
		args["exam_date"] = *request.ExamDate
	}

	if request.StudyHoursPerWeek != nil {
		setClauses = append(setClauses, "study_hours_per_week = @study_hours_per_week")
		args["study_hours_per_week"] = *request.StudyHoursPerWeek
	}

	if request.OnboardingCompleted != nil {
		setClauses = append(setClauses, "onboarding_completed = @onboarding_completed")
		args["onboarding_completed"] = *request.OnboardingCompleted
	}

	stmt := "UPDATE users SET " + strings.Join(setClauses, ", ") + " WHERE id = @id AND deleted_at IS NULL RETURNING *"

	rows, err := r.server.DB.Pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}

	updatedUser, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[user.User])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errs.NewNotFoundError("user not found", false, nil)
		}
		return nil, fmt.Errorf("failed to collect row: %w", err)
	}

	return &updatedUser, nil
}

func (r *UserRepository) GetUserByID(ctx context.Context, userID string) (*user.User, error) {
	stmt := "SELECT * FROM users WHERE id = @id AND deleted_at IS NULL"

	rows, err := r.server.DB.Pool.Query(ctx, stmt, pgx.NamedArgs{"id": userID})
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}

	foundUser, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[user.User])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errs.NewNotFoundError("user not found", false, nil)
		}
		return nil, fmt.Errorf("failed to collect row: %w", err)
	}

	return &foundUser, nil
}

func (r *UserRepository) GetUserByClerkID(ctx context.Context, clerkID string) (*user.User, error) {
	stmt := "SELECT * FROM users WHERE clerk_id = @clerk_id AND deleted_at IS NULL"

	rows, err := r.server.DB.Pool.Query(ctx, stmt, pgx.NamedArgs{"clerk_id": clerkID})
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}

	foundUser, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[user.User])
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, errs.NewNotFoundError("user not found", false, nil)
		}
		return nil, fmt.Errorf("failed to collect row: %w", err)
	}

	return &foundUser, nil
}

func (r *UserRepository) CreateUser(ctx context.Context, request *user.CreateUserRequest) (*user.User, error) {
	stmt := `
		INSERT INTO users (clerk_id, email, full_name, avatar_url)
		VALUES (@clerk_id, @email, @full_name, @avatar_url)
		ON CONFLICT (clerk_id) DO UPDATE SET
			email = EXCLUDED.email,
			full_name = COALESCE(EXCLUDED.full_name, users.full_name),
			avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
			updated_at = NOW()
		RETURNING *
	`

	args := pgx.NamedArgs{
		"clerk_id":   request.ClerkID,
		"email":      request.Email,
		"full_name":  request.FullName,
		"avatar_url": request.AvatarUrl,
	}

	rows, err := r.server.DB.Pool.Query(ctx, stmt, args)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %w", err)
	}

	createdUser, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[user.User])
	if err != nil {
		return nil, fmt.Errorf("failed to collect row: %w", err)
	}

	return &createdUser, nil
}

func (r *UserRepository) DeleteUser(ctx context.Context, userID string) error {
	stmt := "UPDATE users SET deleted_at = NOW() WHERE id = @id AND deleted_at IS NULL"

	result, err := r.server.DB.Pool.Exec(ctx, stmt, pgx.NamedArgs{"id": userID})
	if err != nil {
		return fmt.Errorf("failed to execute query: %w", err)
	}

	if result.RowsAffected() == 0 {
		return errs.NewNotFoundError("user not found", false, nil)
	}

	return nil
}
