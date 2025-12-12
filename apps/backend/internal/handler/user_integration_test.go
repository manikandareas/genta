// go:build integration

package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/model/user"
	"github.com/manikandareas/genta/internal/repository"
	"github.com/manikandareas/genta/internal/service"
	testingPkg "github.com/manikandareas/genta/internal/testing"
	"github.com/rs/zerolog"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// TestUserIntegration_UpdateUser_Success tests the full flow of updating a user
func TestUserIntegration_UpdateUser_Success(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test in short mode")
	}

	// Setup test database and server
	testDB, testServer, cleanup := testingPkg.SetupTest(t)
	defer cleanup()

	ctx := context.Background()

	// Create a test user in the database
	testUserID := uuid.New()
	clerkID := "clerk_test_" + uuid.New().String()[:8]
	email := "test_" + uuid.New().String()[:8] + "@example.com"

	_, err := testDB.Pool.Exec(ctx, `
		INSERT INTO users (id, clerk_id, email, full_name, subscription_tier, is_active, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
	`, testUserID, clerkID, email, "Original Name", "free", true)
	require.NoError(t, err, "failed to create test user")

	// Setup repository, service, and handler
	userRepo := repository.NewUserRepository(testServer)
	userService := service.NewUserService(testServer, userRepo)
	userHandler := NewUserHandler(testServer, userService)

	// Create Echo instance and request
	e := echo.New()

	// Prepare update request body
	updateRequest := map[string]interface{}{
		"fullName":          "Rina Wijaya",
		"targetPtn":         "UI",
		"targetScore":       700,
		"studyHoursPerWeek": 10,
	}
	jsonBody, err := json.Marshal(updateRequest)
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodPut, "/api/v1/users/me", bytes.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()

	c := e.NewContext(req, rec)

	// Set user_id in context (simulating auth middleware)
	c.Set("user_id", testUserID.String())

	// Set logger in context
	logger := zerolog.Nop()
	c.Set("logger", &logger)

	// Execute handler
	err = userHandler.UpdateUser(c)
	require.NoError(t, err, "handler should not return error")

	// Assert response status
	assert.Equal(t, http.StatusOK, rec.Code, "should return 200 OK")

	// Parse response body
	var response user.User
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	require.NoError(t, err, "should be able to parse response")

	// Assert response data
	assert.Equal(t, testUserID, response.ID, "user ID should match")
	assert.Equal(t, "Rina Wijaya", *response.FullName, "full name should be updated")
	assert.Equal(t, "UI", *response.TargetPtn, "target PTN should be updated")
	assert.Equal(t, 700, *response.TargetScore, "target score should be updated")
	assert.Equal(t, int16(10), *response.StudyHoursPerWeek, "study hours should be updated")

	// Verify data was persisted in database
	var dbUser user.User
	err = testDB.Pool.QueryRow(ctx, `
		SELECT id, full_name, target_ptn, target_score, study_hours_per_week
		FROM users WHERE id = $1
	`, testUserID).Scan(&dbUser.ID, &dbUser.FullName, &dbUser.TargetPtn, &dbUser.TargetScore, &dbUser.StudyHoursPerWeek)
	require.NoError(t, err, "should be able to query updated user")

	assert.Equal(t, "Rina Wijaya", *dbUser.FullName, "database should have updated full name")
	assert.Equal(t, "UI", *dbUser.TargetPtn, "database should have updated target PTN")
	assert.Equal(t, 700, *dbUser.TargetScore, "database should have updated target score")
	assert.Equal(t, int16(10), *dbUser.StudyHoursPerWeek, "database should have updated study hours")
}

// TestUserIntegration_UpdateUser_PartialUpdate tests partial update (only some fields)
func TestUserIntegration_UpdateUser_PartialUpdate(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test in short mode")
	}

	testDB, testServer, cleanup := testingPkg.SetupTest(t)
	defer cleanup()

	ctx := context.Background()

	// Create test user with initial values
	testUserID := uuid.New()
	clerkID := "clerk_test_" + uuid.New().String()[:8]
	email := "test_" + uuid.New().String()[:8] + "@example.com"
	initialName := "Initial Name"
	initialPtn := "ITB"
	initialScore := 650

	_, err := testDB.Pool.Exec(ctx, `
		INSERT INTO users (id, clerk_id, email, full_name, target_ptn, target_score, subscription_tier, is_active, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
	`, testUserID, clerkID, email, initialName, initialPtn, initialScore, "free", true)
	require.NoError(t, err)

	userRepo := repository.NewUserRepository(testServer)
	userService := service.NewUserService(testServer, userRepo)
	userHandler := NewUserHandler(testServer, userService)

	e := echo.New()

	// Only update fullName, leave other fields unchanged
	updateRequest := map[string]interface{}{
		"fullName": "Updated Name Only",
	}
	jsonBody, _ := json.Marshal(updateRequest)

	req := httptest.NewRequest(http.MethodPut, "/api/v1/users/me", bytes.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()

	c := e.NewContext(req, rec)
	c.Set("user_id", testUserID.String())
	logger := zerolog.Nop()
	c.Set("logger", &logger)

	err = userHandler.UpdateUser(c)
	require.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	// Verify only fullName was updated, other fields remain unchanged
	var dbUser struct {
		FullName    *string
		TargetPtn   *string
		TargetScore *int
	}
	err = testDB.Pool.QueryRow(ctx, `
		SELECT full_name, target_ptn, target_score FROM users WHERE id = $1
	`, testUserID).Scan(&dbUser.FullName, &dbUser.TargetPtn, &dbUser.TargetScore)
	require.NoError(t, err)

	assert.Equal(t, "Updated Name Only", *dbUser.FullName, "full name should be updated")
	assert.Equal(t, initialPtn, *dbUser.TargetPtn, "target PTN should remain unchanged")
	assert.Equal(t, initialScore, *dbUser.TargetScore, "target score should remain unchanged")
}

// TestUserIntegration_UpdateUser_NotFound tests updating non-existent user
func TestUserIntegration_UpdateUser_NotFound(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test in short mode")
	}

	_, testServer, cleanup := testingPkg.SetupTest(t)
	defer cleanup()

	userRepo := repository.NewUserRepository(testServer)
	userService := service.NewUserService(testServer, userRepo)
	userHandler := NewUserHandler(testServer, userService)

	e := echo.New()

	updateRequest := map[string]interface{}{
		"fullName": "Test Name",
	}
	jsonBody, _ := json.Marshal(updateRequest)

	req := httptest.NewRequest(http.MethodPut, "/api/v1/users/me", bytes.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()

	c := e.NewContext(req, rec)
	// Use non-existent user ID
	c.Set("user_id", uuid.New().String())
	logger := zerolog.Nop()
	c.Set("logger", &logger)

	err := userHandler.UpdateUser(c)

	// Handler should return error for not found
	assert.Error(t, err, "should return error for non-existent user")
}

// TestUserIntegration_UpdateUser_WithExamDate tests updating with exam date
func TestUserIntegration_UpdateUser_WithExamDate(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test in short mode")
	}

	testDB, testServer, cleanup := testingPkg.SetupTest(t)
	defer cleanup()

	ctx := context.Background()

	testUserID := uuid.New()
	clerkID := "clerk_test_" + uuid.New().String()[:8]
	email := "test_" + uuid.New().String()[:8] + "@example.com"

	_, err := testDB.Pool.Exec(ctx, `
		INSERT INTO users (id, clerk_id, email, subscription_tier, is_active, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
	`, testUserID, clerkID, email, "free", true)
	require.NoError(t, err)

	userRepo := repository.NewUserRepository(testServer)
	userService := service.NewUserService(testServer, userRepo)
	userHandler := NewUserHandler(testServer, userService)

	e := echo.New()

	// Update with exam date
	examDate := time.Date(2026, 3, 15, 0, 0, 0, 0, time.UTC)
	updateRequest := map[string]interface{}{
		"fullName":    "Student with Exam Date",
		"targetPtn":   "UGM",
		"targetScore": 680,
		"examDate":    examDate.Format(time.RFC3339),
	}
	jsonBody, _ := json.Marshal(updateRequest)

	req := httptest.NewRequest(http.MethodPut, "/api/v1/users/me", bytes.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()

	c := e.NewContext(req, rec)
	c.Set("user_id", testUserID.String())
	logger := zerolog.Nop()
	c.Set("logger", &logger)

	err = userHandler.UpdateUser(c)
	require.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	// Verify exam date was saved
	var dbExamDate *time.Time
	err = testDB.Pool.QueryRow(ctx, `
		SELECT exam_date FROM users WHERE id = $1
	`, testUserID).Scan(&dbExamDate)
	require.NoError(t, err)

	require.NotNil(t, dbExamDate, "exam date should be set")
	assert.Equal(t, 2026, dbExamDate.Year(), "exam year should match")
	assert.Equal(t, time.March, dbExamDate.Month(), "exam month should match")
	assert.Equal(t, 15, dbExamDate.Day(), "exam day should match")
}

// TestUserIntegration_UpdateUser_ValidationError tests validation errors
func TestUserIntegration_UpdateUser_ValidationError(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test in short mode")
	}

	testDB, testServer, cleanup := testingPkg.SetupTest(t)
	defer cleanup()

	ctx := context.Background()

	testUserID := uuid.New()
	clerkID := "clerk_test_" + uuid.New().String()[:8]
	email := "test_" + uuid.New().String()[:8] + "@example.com"

	_, err := testDB.Pool.Exec(ctx, `
		INSERT INTO users (id, clerk_id, email, subscription_tier, is_active, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
	`, testUserID, clerkID, email, "free", true)
	require.NoError(t, err)

	userRepo := repository.NewUserRepository(testServer)
	userService := service.NewUserService(testServer, userRepo)
	userHandler := NewUserHandler(testServer, userService)

	e := echo.New()

	// Invalid request - study hours exceeds max (168)
	updateRequest := map[string]interface{}{
		"studyHoursPerWeek": 200,
	}
	jsonBody, _ := json.Marshal(updateRequest)

	req := httptest.NewRequest(http.MethodPut, "/api/v1/users/me", bytes.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()

	c := e.NewContext(req, rec)
	c.Set("user_id", testUserID.String())
	logger := zerolog.Nop()
	c.Set("logger", &logger)

	err = userHandler.UpdateUser(c)

	// Should return validation error
	assert.Error(t, err, "should return validation error for invalid study hours")
}

// TestUserIntegration_UpdateUser_EmptyRequest tests empty update request
func TestUserIntegration_UpdateUser_EmptyRequest(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test in short mode")
	}

	testDB, testServer, cleanup := testingPkg.SetupTest(t)
	defer cleanup()

	ctx := context.Background()

	testUserID := uuid.New()
	clerkID := "clerk_test_" + uuid.New().String()[:8]
	email := "test_" + uuid.New().String()[:8] + "@example.com"
	originalName := "Original Name"

	_, err := testDB.Pool.Exec(ctx, `
		INSERT INTO users (id, clerk_id, email, full_name, subscription_tier, is_active, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
	`, testUserID, clerkID, email, originalName, "free", true)
	require.NoError(t, err)

	userRepo := repository.NewUserRepository(testServer)
	userService := service.NewUserService(testServer, userRepo)
	userHandler := NewUserHandler(testServer, userService)

	e := echo.New()

	// Empty request body
	updateRequest := map[string]interface{}{}
	jsonBody, _ := json.Marshal(updateRequest)

	req := httptest.NewRequest(http.MethodPut, "/api/v1/users/me", bytes.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()

	c := e.NewContext(req, rec)
	c.Set("user_id", testUserID.String())
	logger := zerolog.Nop()
	c.Set("logger", &logger)

	err = userHandler.UpdateUser(c)
	require.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	// Verify original data is unchanged
	var dbFullName *string
	err = testDB.Pool.QueryRow(ctx, `
		SELECT full_name FROM users WHERE id = $1
	`, testUserID).Scan(&dbFullName)
	require.NoError(t, err)

	assert.Equal(t, originalName, *dbFullName, "original name should remain unchanged")
}
