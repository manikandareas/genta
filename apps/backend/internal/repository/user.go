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
