package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/middleware"
	"github.com/manikandareas/genta/internal/model/user"
	"github.com/manikandareas/genta/internal/server"
	"github.com/manikandareas/genta/internal/service"
)

type UserHandler struct {
	Handler
	userService *service.UserService
}

func NewUserHandler(s *server.Server, userService *service.UserService) *UserHandler {
	return &UserHandler{
		Handler:     NewHandler(s),
		userService: userService,
	}
}

func (h *UserHandler) UpdateUser(c echo.Context) error {
	return Handle(
		h.Handler,
		func(c echo.Context, request *user.PutUserRequest) (*user.User, error) {
			userID := middleware.GetUserID(c)
			return h.userService.UpdateUser(c, userID, request)
		},
		http.StatusOK,
		&user.PutUserRequest{},
	)(c)
}
