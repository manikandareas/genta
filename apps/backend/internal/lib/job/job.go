package job

import (
	"fmt"

	"github.com/hibiken/asynq"
	"github.com/manikandareas/genta/internal/config"
	"github.com/rs/zerolog"
)

// TaskStatus represents the status of an async task
type TaskStatus string

const (
	TaskStatusQueued     TaskStatus = "queued"
	TaskStatusProcessing TaskStatus = "processing"
	TaskStatusCompleted  TaskStatus = "completed"
	TaskStatusFailed     TaskStatus = "failed"
)

// TaskInfo contains information about a task's status
type TaskInfo struct {
	TaskID    string
	Status    TaskStatus
	Queue     string
	Retried   int
	MaxRetry  int
	LastError string
}

type JobService struct {
	Client    *asynq.Client
	Inspector *asynq.Inspector
	server    *asynq.Server
	logger    *zerolog.Logger
	redisAddr string
}

func NewJobService(logger *zerolog.Logger, cfg *config.Config) *JobService {
	redisAddr := cfg.Redis.Address
	redisOpt := asynq.RedisClientOpt{Addr: redisAddr}

	client := asynq.NewClient(redisOpt)
	inspector := asynq.NewInspector(redisOpt)

	server := asynq.NewServer(
		redisOpt,
		asynq.Config{
			Concurrency: 10,
			Queues: map[string]int{
				"critical": 6, // Higher priority queue for important tasks
				"default":  3, // Default priority for most tasks
				"low":      1, // Lower priority for non-urgent tasks
			},
		},
	)

	return &JobService{
		Client:    client,
		Inspector: inspector,
		server:    server,
		logger:    logger,
		redisAddr: redisAddr,
	}
}

func (j *JobService) Start() error {
	// Register task handlers
	mux := asynq.NewServeMux()
	mux.HandleFunc(TaskWelcome, j.handleWelcomeEmailTask)
	mux.HandleFunc(TaskFeedbackGeneration, j.handleFeedbackGenerationTask)

	j.logger.Info().Msg("Starting background job server")
	if err := j.server.Start(mux); err != nil {
		return err
	}

	return nil
}

func (j *JobService) Stop() {
	j.logger.Info().Msg("Stopping background job server")
	j.server.Shutdown()
	j.Client.Close()
	j.Inspector.Close()
}

// GetTaskInfo retrieves the status of a task by its ID
// It searches across all queues: pending, active, completed, failed, archived
func (j *JobService) GetTaskInfo(taskID string) (*TaskInfo, error) {
	queues := []string{"critical", "default", "low"}

	for _, queue := range queues {
		// Check pending tasks
		info, err := j.Inspector.GetTaskInfo(queue, taskID)
		if err == nil && info != nil {
			return j.mapTaskInfo(info), nil
		}
	}

	return nil, fmt.Errorf("task not found: %s", taskID)
}

// mapTaskInfo converts asynq.TaskInfo to our TaskInfo
func (j *JobService) mapTaskInfo(info *asynq.TaskInfo) *TaskInfo {
	status := TaskStatusQueued

	switch info.State {
	case asynq.TaskStatePending:
		status = TaskStatusQueued
	case asynq.TaskStateActive:
		status = TaskStatusProcessing
	case asynq.TaskStateCompleted:
		status = TaskStatusCompleted
	case asynq.TaskStateRetry:
		status = TaskStatusProcessing
	case asynq.TaskStateArchived:
		status = TaskStatusFailed
	case asynq.TaskStateAggregating:
		status = TaskStatusProcessing
	case asynq.TaskStateScheduled:
		status = TaskStatusQueued
	}

	return &TaskInfo{
		TaskID:    info.ID,
		Status:    status,
		Queue:     info.Queue,
		Retried:   info.Retried,
		MaxRetry:  info.MaxRetry,
		LastError: info.LastErr,
	}
}
