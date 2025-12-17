package handler

import (
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/errs"
	"github.com/manikandareas/genta/internal/lib/job"
	"github.com/manikandareas/genta/internal/server"
)

// === Request/Response DTOs ===

// CheckJobStatusRequest represents path params for checking job status
type CheckJobStatusRequest struct {
	JobID string `param:"job_id" validate:"required"`
}

func (r *CheckJobStatusRequest) Validate() error {
	validate := validator.New()
	return validate.Struct(r)
}

// JobStatusResponse represents the response for job status check
type JobStatusResponse struct {
	JobID                      string         `json:"job_id"`
	Status                     job.TaskStatus `json:"status"`
	AttemptID                  string         `json:"attempt_id,omitempty"`
	EstimatedCompletionSeconds int            `json:"estimated_completion_seconds,omitempty"`
}

// === Handler ===

type JobHandler struct {
	Handler
	jobService *job.JobService
}

func NewJobHandler(s *server.Server, jobService *job.JobService) *JobHandler {
	return &JobHandler{
		Handler:    NewHandler(s),
		jobService: jobService,
	}
}

// CheckJobStatus godoc
// @Summary Check async job status
// @Description Check the status of an async job (feedback generation, etc)
// @Tags jobs
// @Accept json
// @Produce json
// @Param job_id path string true "Job ID"
// @Success 200 {object} JobStatusResponse "Job completed"
// @Success 202 {object} JobStatusResponse "Job still processing"
// @Failure 404 {object} errs.HTTPError
// @Router /jobs/{job_id}/check [post]
func (h *JobHandler) CheckJobStatus(c echo.Context) error {
	return Handle(
		h.Handler,
		func(c echo.Context, req *CheckJobStatusRequest) (*JobStatusResponse, error) {
			taskInfo, err := h.jobService.GetTaskInfo(req.JobID)
			if err != nil {
				return nil, errs.NewNotFoundError("job not found", false, nil)
			}

			response := &JobStatusResponse{
				JobID:  taskInfo.TaskID,
				Status: taskInfo.Status,
			}

			// Add estimated completion time for processing jobs
			if taskInfo.Status == job.TaskStatusQueued || taskInfo.Status == job.TaskStatusProcessing {
				response.EstimatedCompletionSeconds = 8 // Default estimate for feedback generation
			}

			return response, nil
		},
		http.StatusOK,
		&CheckJobStatusRequest{},
	)(c)
}
