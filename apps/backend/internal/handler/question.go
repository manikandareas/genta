package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/middleware"
	"github.com/manikandareas/genta/internal/model"
	"github.com/manikandareas/genta/internal/model/question"
	"github.com/manikandareas/genta/internal/server"
	"github.com/manikandareas/genta/internal/service"
)

type QuestionHandler struct {
	Handler
	questionService *service.QuestionService
}

func NewQuestionHandler(s *server.Server, questionService *service.QuestionService) *QuestionHandler {
	return &QuestionHandler{
		Handler:         NewHandler(s),
		questionService: questionService,
	}
}

// GetQuestion godoc
// @Summary Get question by ID
// @Description Get a single question with full details including correct answer
// @Tags questions
// @Accept json
// @Produce json
// @Param id path string true "Question ID"
// @Success 200 {object} question.QuestionDetailResponse
// @Failure 404 {object} errs.HTTPError
// @Router /questions/{id} [get]
func (h *QuestionHandler) GetQuestion(c echo.Context) error {
	return Handle(
		h.Handler,
		func(c echo.Context, req *question.GetQuestionRequest) (*question.QuestionDetailResponse, error) {
			return h.questionService.GetByID(c, req.ID)
		},
		http.StatusOK,
		&question.GetQuestionRequest{},
	)(c)
}

// ListQuestions godoc
// @Summary List questions
// @Description Get paginated list of questions with optional section filter
// @Tags questions
// @Accept json
// @Produce json
// @Param section query string false "Section filter (PU, PPU, PBM, PK, LBI, LBE, PM)"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(10)
// @Success 200 {object} model.PaginatedResponse[question.QuestionResponse]
// @Router /questions [get]
func (h *QuestionHandler) ListQuestions(c echo.Context) error {
	return Handle(
		h.Handler,
		func(c echo.Context, req *question.ListQuestionsRequest) (*model.PaginatedResponse[question.QuestionResponse], error) {
			return h.questionService.List(c, req)
		},
		http.StatusOK,
		&question.ListQuestionsRequest{},
	)(c)
}

// GetNextQuestion godoc
// @Summary Get next question for practice
// @Description Get the next question for a user based on section (adaptive learning)
// @Tags questions
// @Accept json
// @Produce json
// @Param section query string true "Section (PU, PPU, PBM, PK, LBI, LBE, PM)"
// @Success 200 {object} question.QuestionResponse
// @Failure 404 {object} errs.HTTPError
// @Router /questions/next [get]
func (h *QuestionHandler) GetNextQuestion(c echo.Context) error {
	return Handle(
		h.Handler,
		func(c echo.Context, req *question.GetNextQuestionRequest) (*question.QuestionResponse, error) {
			userID := middleware.GetUserID(c)
			return h.questionService.GetNext(c, userID, req.Section)
		},
		http.StatusOK,
		&question.GetNextQuestionRequest{},
	)(c)
}
