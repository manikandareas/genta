package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/server"
)

type InfoHandler struct {
	server *server.Server
}

func NewInfoHandler(s *server.Server) *InfoHandler {
	return &InfoHandler{server: s}
}

type AppInfoResponse struct {
	Name        string            `json:"name"`
	Version     string            `json:"version"`
	Environment string            `json:"environment"`
	Paths       map[string]string `json:"paths"`
}

func (h *InfoHandler) GetAppInfo(c echo.Context) error {
	info := AppInfoResponse{
		Name:        "Genta API",
		Version:     "1.0.0",
		Environment: h.server.Config.Primary.Env,
		Paths: map[string]string{
			"health": "/status",
			"docs":   "/docs",
			"api":    "/api/v1",
		},
	}

	return c.JSON(http.StatusOK, info)
}
