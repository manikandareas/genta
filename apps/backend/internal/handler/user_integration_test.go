//go:build integration

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
	userService := service.NewUserService(testServer, userRepo, nil)
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

	// Set user_id in context (simulating auth middleware) - uses clerkID
	c.Set("user_id", clerkID)

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
	userService := service.NewUserService(testServer, userRepo, nil)
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
	c.Set("user_id", clerkID) // uses clerkID
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
	userService := service.NewUserService(testServer, userRepo, nil)
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
	// Use non-existent clerk ID
	c.Set("user_id", "clerk_nonexistent_"+uuid.New().String()[:8])
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
	userService := service.NewUserService(testServer, userRepo, nil)
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
	c.Set("user_id", clerkID) // uses clerkID
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
	userService := service.NewUserService(testServer, userRepo, nil)
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
	c.Set("user_id", clerkID) // uses clerkID
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
	userService := service.NewUserService(testServer, userRepo, nil)
	userHandler := NewUserHandler(testServer, userService)

	e := echo.New()

	// Empty request body
	updateRequest := map[string]interface{}{}
	jsonBody, _ := json.Marshal(updateRequest)

	req := httptest.NewRequest(http.MethodPut, "/api/v1/users/me", bytes.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()

	c := e.NewContext(req, rec)
	c.Set("user_id", clerkID) // uses clerkID
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

// ==================== GetUser Integration Tests ====================

// TestUserIntegration_GetUser_Success tests the full flow of getting current user
func TestUserIntegration_GetUser_Success(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test in short mode")
	}

	testDB, testServer, cleanup := testingPkg.SetupTest(t)
	defer cleanup()

	ctx := context.Background()

	// Create a test user in the database
	testUserID := uuid.New()
	clerkID := "clerk_test_" + uuid.New().String()[:8]
	email := "test_" + uuid.New().String()[:8] + "@example.com"
	fullName := "Test User"
	targetPtn := "UI"
	targetScore := 700

	_, err := testDB.Pool.Exec(ctx, `
		INSERT INTO users (id, clerk_id, email, full_name, target_ptn, target_score, subscription_tier, is_active, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
	`, testUserID, clerkID, email, fullName, targetPtn, targetScore, "free", true)
	require.NoError(t, err, "failed to create test user")

	// Setup repository, service, and handler
	userRepo := repository.NewUserRepository(testServer)
	userService := service.NewUserService(testServer, userRepo, nil)
	userHandler := NewUserHandler(testServer, userService)

	// Create Echo instance and request
	e := echo.New()

	req := httptest.NewRequest(http.MethodGet, "/api/v1/users/me", nil)
	rec := httptest.NewRecorder()

	c := e.NewContext(req, rec)

	// Set user_id in context (simulating auth middleware) - uses clerkID
	c.Set("user_id", clerkID)

	// Set logger in context
	logger := zerolog.Nop()
	c.Set("logger", &logger)

	// Execute handler
	err = userHandler.GetUser(c)
	require.NoError(t, err, "handler should not return error")

	// Assert response status
	assert.Equal(t, http.StatusOK, rec.Code, "should return 200 OK")

	// Parse response body
	var response user.User
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	require.NoError(t, err, "should be able to parse response")

	// Assert response data
	assert.Equal(t, testUserID, response.ID, "user ID should match")
	assert.Equal(t, clerkID, response.ClerkID, "clerk ID should match")
	assert.Equal(t, email, response.Email, "email should match")
	assert.Equal(t, fullName, *response.FullName, "full name should match")
	assert.Equal(t, targetPtn, *response.TargetPtn, "target PTN should match")
	assert.Equal(t, targetScore, *response.TargetScore, "target score should match")
	assert.Equal(t, "free", response.SubscriptionTier, "subscription tier should match")
	assert.True(t, response.IsActive, "user should be active")
}

// TestUserIntegration_GetUser_NotFound tests getting non-existent user
func TestUserIntegration_GetUser_NotFound(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test in short mode")
	}

	_, testServer, cleanup := testingPkg.SetupTest(t)
	defer cleanup()

	userRepo := repository.NewUserRepository(testServer)
	userService := service.NewUserService(testServer, userRepo, nil)
	userHandler := NewUserHandler(testServer, userService)

	e := echo.New()

	req := httptest.NewRequest(http.MethodGet, "/api/v1/users/me", nil)
	rec := httptest.NewRecorder()

	c := e.NewContext(req, rec)
	// Use non-existent clerk ID
	c.Set("user_id", "clerk_nonexistent_"+uuid.New().String()[:8])
	logger := zerolog.Nop()
	c.Set("logger", &logger)

	err := userHandler.GetUser(c)

	// Handler should return error for not found
	assert.Error(t, err, "should return error for non-existent user")
}

// TestUserIntegration_GetUser_DeletedUser tests getting a soft-deleted user
func TestUserIntegration_GetUser_DeletedUser(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test in short mode")
	}

	testDB, testServer, cleanup := testingPkg.SetupTest(t)
	defer cleanup()

	ctx := context.Background()

	// Create a soft-deleted user
	testUserID := uuid.New()
	clerkID := "clerk_test_" + uuid.New().String()[:8]
	email := "deleted_" + uuid.New().String()[:8] + "@example.com"

	_, err := testDB.Pool.Exec(ctx, `
		INSERT INTO users (id, clerk_id, email, subscription_tier, is_active, created_at, updated_at, deleted_at)
		VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), NOW())
	`, testUserID, clerkID, email, "free", false)
	require.NoError(t, err)

	userRepo := repository.NewUserRepository(testServer)
	userService := service.NewUserService(testServer, userRepo, nil)
	userHandler := NewUserHandler(testServer, userService)

	e := echo.New()

	req := httptest.NewRequest(http.MethodGet, "/api/v1/users/me", nil)
	rec := httptest.NewRecorder()

	c := e.NewContext(req, rec)
	c.Set("user_id", clerkID) // uses clerkID
	logger := zerolog.Nop()
	c.Set("logger", &logger)

	err = userHandler.GetUser(c)

	// Should return error for deleted user (deleted_at IS NOT NULL)
	assert.Error(t, err, "should return error for deleted user")
}

// TestUserIntegration_GetUser_WithAllFields tests getting user with all fields populated
func TestUserIntegration_GetUser_WithAllFields(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test in short mode")
	}

	testDB, testServer, cleanup := testingPkg.SetupTest(t)
	defer cleanup()

	ctx := context.Background()

	testUserID := uuid.New()
	clerkID := "clerk_test_" + uuid.New().String()[:8]
	email := "full_" + uuid.New().String()[:8] + "@example.com"
	fullName := "Complete User"
	avatarUrl := "https://example.com/avatar.jpg"
	targetPtn := "UGM"
	targetScore := 750
	studyHours := int16(20)
	examDate := time.Date(2026, 6, 15, 0, 0, 0, 0, time.UTC)
	irtTheta := 0.5
	irtVariance := 0.1

	_, err := testDB.Pool.Exec(ctx, `
		INSERT INTO users (
			id, clerk_id, email, full_name, avatar_url, 
			subscription_tier, is_subscription_active,
			irt_theta, irt_variance, irt_last_updated,
			target_ptn, target_score, exam_date, study_hours_per_week, onboarding_completed,
			is_email_verified, is_active, last_login,
			created_at, updated_at
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10, $11, $12, $13, $14, $15, $16, NOW(), NOW(), NOW())
	`, testUserID, clerkID, email, fullName, avatarUrl,
		"premium", true,
		irtTheta, irtVariance,
		targetPtn, targetScore, examDate, studyHours, true,
		true, true)
	require.NoError(t, err)

	userRepo := repository.NewUserRepository(testServer)
	userService := service.NewUserService(testServer, userRepo, nil)
	userHandler := NewUserHandler(testServer, userService)

	e := echo.New()

	req := httptest.NewRequest(http.MethodGet, "/api/v1/users/me", nil)
	rec := httptest.NewRecorder()

	c := e.NewContext(req, rec)
	c.Set("user_id", clerkID) // uses clerkID
	logger := zerolog.Nop()
	c.Set("logger", &logger)

	err = userHandler.GetUser(c)
	require.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var response user.User
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	require.NoError(t, err)

	// Verify all fields
	assert.Equal(t, testUserID, response.ID)
	assert.Equal(t, clerkID, response.ClerkID)
	assert.Equal(t, email, response.Email)
	assert.Equal(t, fullName, *response.FullName)
	assert.Equal(t, avatarUrl, *response.AvatarUrl)
	assert.Equal(t, "premium", response.SubscriptionTier)
	assert.True(t, response.IsSubscriptionActive)
	assert.InDelta(t, irtTheta, *response.IrtTheta, 0.001)
	assert.InDelta(t, irtVariance, *response.IrtVariance, 0.001)
	assert.Equal(t, targetPtn, *response.TargetPtn)
	assert.Equal(t, targetScore, *response.TargetScore)
	assert.Equal(t, studyHours, *response.StudyHoursPerWeek)
	assert.True(t, response.OnboardingCompleted)
	assert.True(t, response.IsEmailVerified)
	assert.True(t, response.IsActive)
}

// TestUserIntegration_GetUser_MinimalFields tests getting user with only required fields
func TestUserIntegration_GetUser_MinimalFields(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test in short mode")
	}

	testDB, testServer, cleanup := testingPkg.SetupTest(t)
	defer cleanup()

	ctx := context.Background()

	testUserID := uuid.New()
	clerkID := "clerk_test_" + uuid.New().String()[:8]
	email := "minimal_" + uuid.New().String()[:8] + "@example.com"

	// Insert user with only required fields
	_, err := testDB.Pool.Exec(ctx, `
		INSERT INTO users (id, clerk_id, email, subscription_tier, is_active, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
	`, testUserID, clerkID, email, "free", true)
	require.NoError(t, err)

	userRepo := repository.NewUserRepository(testServer)
	userService := service.NewUserService(testServer, userRepo, nil)
	userHandler := NewUserHandler(testServer, userService)

	e := echo.New()

	req := httptest.NewRequest(http.MethodGet, "/api/v1/users/me", nil)
	rec := httptest.NewRecorder()

	c := e.NewContext(req, rec)
	c.Set("user_id", clerkID) // uses clerkID
	logger := zerolog.Nop()
	c.Set("logger", &logger)

	err = userHandler.GetUser(c)
	require.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	var response user.User
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	require.NoError(t, err)

	// Verify required fields
	assert.Equal(t, testUserID, response.ID)
	assert.Equal(t, clerkID, response.ClerkID)
	assert.Equal(t, email, response.Email)
	assert.Equal(t, "free", response.SubscriptionTier)
	assert.True(t, response.IsActive)

	// Verify optional fields are nil (except IRT fields which may have default values)
	assert.Nil(t, response.FullName)
	assert.Nil(t, response.AvatarUrl)
	assert.Nil(t, response.TargetPtn)
	assert.Nil(t, response.TargetScore)
	assert.Nil(t, response.ExamDate)
	assert.Nil(t, response.StudyHoursPerWeek)
	// Note: IrtTheta and IrtVariance may have default values from database
}

// ==================== CompleteOnboarding Integration Tests ====================

// TestUserIntegration_CompleteOnboarding_Success tests the full flow of completing onboarding
func TestUserIntegration_CompleteOnboarding_Success(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test in short mode")
	}

	testDB, testServer, cleanup := testingPkg.SetupTest(t)
	defer cleanup()

	ctx := context.Background()

	// Create a test user in the database
	testUserID := uuid.New()
	clerkID := "clerk_test_" + uuid.New().String()[:8]
	email := "test_" + uuid.New().String()[:8] + "@example.com"

	_, err := testDB.Pool.Exec(ctx, `
		INSERT INTO users (id, clerk_id, email, subscription_tier, is_active, onboarding_completed, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
	`, testUserID, clerkID, email, "free", true, false)
	require.NoError(t, err, "failed to create test user")

	// Setup repository, service, and handler
	userRepo := repository.NewUserRepository(testServer)
	userService := service.NewUserService(testServer, userRepo, nil)
	userHandler := NewUserHandler(testServer, userService)

	// Create Echo instance and request
	e := echo.New()

	// Prepare onboarding request body
	examDate := time.Date(2026, 3, 15, 0, 0, 0, 0, time.UTC)
	onboardingRequest := map[string]interface{}{
		"targetPtn":         "UI",
		"targetScore":       700,
		"examDate":          examDate.Format(time.RFC3339),
		"studyHoursPerWeek": 10,
	}
	jsonBody, err := json.Marshal(onboardingRequest)
	require.NoError(t, err)

	req := httptest.NewRequest(http.MethodPost, "/api/v1/users/me/onboarding", bytes.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()

	c := e.NewContext(req, rec)

	// Set user_id in context (simulating auth middleware) - uses clerkID
	c.Set("user_id", clerkID)

	// Set logger in context
	logger := zerolog.Nop()
	c.Set("logger", &logger)

	// Execute handler
	err = userHandler.CompleteOnboarding(c)
	require.NoError(t, err, "handler should not return error")

	// Assert response status
	assert.Equal(t, http.StatusOK, rec.Code, "should return 200 OK")

	// Parse response body
	var response user.CompleteOnboardingResponse
	err = json.Unmarshal(rec.Body.Bytes(), &response)
	require.NoError(t, err, "should be able to parse response")

	// Assert response data
	assert.Equal(t, "UI", *response.TargetPtn, "target PTN should match")
	assert.Equal(t, 700, *response.TargetScore, "target score should match")
	assert.Equal(t, int16(10), *response.StudyHoursPerWeek, "study hours should match")

	// Verify data was persisted in database
	var dbUser struct {
		TargetPtn           *string
		TargetScore         *int
		StudyHoursPerWeek   *int16
		OnboardingCompleted bool
	}
	err = testDB.Pool.QueryRow(ctx, `
		SELECT target_ptn, target_score, study_hours_per_week, onboarding_completed
		FROM users WHERE id = $1
	`, testUserID).Scan(&dbUser.TargetPtn, &dbUser.TargetScore, &dbUser.StudyHoursPerWeek, &dbUser.OnboardingCompleted)
	require.NoError(t, err, "should be able to query updated user")

	assert.Equal(t, "UI", *dbUser.TargetPtn, "database should have updated target PTN")
	assert.Equal(t, 700, *dbUser.TargetScore, "database should have updated target score")
	assert.Equal(t, int16(10), *dbUser.StudyHoursPerWeek, "database should have updated study hours")
	assert.True(t, dbUser.OnboardingCompleted, "onboarding should be marked as completed")
}

// TestUserIntegration_CompleteOnboarding_PartialData tests completing onboarding with partial data
func TestUserIntegration_CompleteOnboarding_PartialData(t *testing.T) {
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
		INSERT INTO users (id, clerk_id, email, subscription_tier, is_active, onboarding_completed, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
	`, testUserID, clerkID, email, "free", true, false)
	require.NoError(t, err)

	userRepo := repository.NewUserRepository(testServer)
	userService := service.NewUserService(testServer, userRepo, nil)
	userHandler := NewUserHandler(testServer, userService)

	e := echo.New()

	// Only provide targetPtn
	onboardingRequest := map[string]interface{}{
		"targetPtn": "ITB",
	}
	jsonBody, _ := json.Marshal(onboardingRequest)

	req := httptest.NewRequest(http.MethodPost, "/api/v1/users/me/onboarding", bytes.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()

	c := e.NewContext(req, rec)
	c.Set("user_id", clerkID) // uses clerkID
	logger := zerolog.Nop()
	c.Set("logger", &logger)

	err = userHandler.CompleteOnboarding(c)
	require.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	// Verify onboarding is completed even with partial data
	var onboardingCompleted bool
	err = testDB.Pool.QueryRow(ctx, `
		SELECT onboarding_completed FROM users WHERE id = $1
	`, testUserID).Scan(&onboardingCompleted)
	require.NoError(t, err)

	assert.True(t, onboardingCompleted, "onboarding should be marked as completed")
}

// TestUserIntegration_CompleteOnboarding_EmptyRequest tests completing onboarding with empty request
func TestUserIntegration_CompleteOnboarding_EmptyRequest(t *testing.T) {
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
		INSERT INTO users (id, clerk_id, email, subscription_tier, is_active, onboarding_completed, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
	`, testUserID, clerkID, email, "free", true, false)
	require.NoError(t, err)

	userRepo := repository.NewUserRepository(testServer)
	userService := service.NewUserService(testServer, userRepo, nil)
	userHandler := NewUserHandler(testServer, userService)

	e := echo.New()

	// Empty request body
	onboardingRequest := map[string]interface{}{}
	jsonBody, _ := json.Marshal(onboardingRequest)

	req := httptest.NewRequest(http.MethodPost, "/api/v1/users/me/onboarding", bytes.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()

	c := e.NewContext(req, rec)
	c.Set("user_id", clerkID) // uses clerkID
	logger := zerolog.Nop()
	c.Set("logger", &logger)

	err = userHandler.CompleteOnboarding(c)
	require.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	// Verify onboarding is completed even with empty request
	var onboardingCompleted bool
	err = testDB.Pool.QueryRow(ctx, `
		SELECT onboarding_completed FROM users WHERE id = $1
	`, testUserID).Scan(&onboardingCompleted)
	require.NoError(t, err)

	assert.True(t, onboardingCompleted, "onboarding should be marked as completed")
}

// TestUserIntegration_CompleteOnboarding_ValidationError tests validation errors
func TestUserIntegration_CompleteOnboarding_ValidationError(t *testing.T) {
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
		INSERT INTO users (id, clerk_id, email, subscription_tier, is_active, onboarding_completed, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
	`, testUserID, clerkID, email, "free", true, false)
	require.NoError(t, err)

	userRepo := repository.NewUserRepository(testServer)
	userService := service.NewUserService(testServer, userRepo, nil)
	userHandler := NewUserHandler(testServer, userService)

	e := echo.New()

	// Invalid request - study hours exceeds max (168)
	onboardingRequest := map[string]interface{}{
		"studyHoursPerWeek": 200,
	}
	jsonBody, _ := json.Marshal(onboardingRequest)

	req := httptest.NewRequest(http.MethodPost, "/api/v1/users/me/onboarding", bytes.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()

	c := e.NewContext(req, rec)
	c.Set("user_id", clerkID) // uses clerkID
	logger := zerolog.Nop()
	c.Set("logger", &logger)

	err = userHandler.CompleteOnboarding(c)

	// Should return validation error
	assert.Error(t, err, "should return validation error for invalid study hours")
}

// TestUserIntegration_CompleteOnboarding_WithExamDate tests completing onboarding with exam date
func TestUserIntegration_CompleteOnboarding_WithExamDate(t *testing.T) {
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
		INSERT INTO users (id, clerk_id, email, subscription_tier, is_active, onboarding_completed, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
	`, testUserID, clerkID, email, "free", true, false)
	require.NoError(t, err)

	userRepo := repository.NewUserRepository(testServer)
	userService := service.NewUserService(testServer, userRepo, nil)
	userHandler := NewUserHandler(testServer, userService)

	e := echo.New()

	// Update with exam date
	examDate := time.Date(2026, 6, 15, 0, 0, 0, 0, time.UTC)
	onboardingRequest := map[string]interface{}{
		"targetPtn":   "UGM",
		"targetScore": 680,
		"examDate":    examDate.Format(time.RFC3339),
	}
	jsonBody, _ := json.Marshal(onboardingRequest)

	req := httptest.NewRequest(http.MethodPost, "/api/v1/users/me/onboarding", bytes.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()

	c := e.NewContext(req, rec)
	c.Set("user_id", clerkID) // uses clerkID
	logger := zerolog.Nop()
	c.Set("logger", &logger)

	err = userHandler.CompleteOnboarding(c)
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
	assert.Equal(t, time.June, dbExamDate.Month(), "exam month should match")
	assert.Equal(t, 15, dbExamDate.Day(), "exam day should match")
}

// TestUserIntegration_CompleteOnboarding_AlreadyCompleted tests completing onboarding when already completed
func TestUserIntegration_CompleteOnboarding_AlreadyCompleted(t *testing.T) {
	if testing.Short() {
		t.Skip("skipping integration test in short mode")
	}

	testDB, testServer, cleanup := testingPkg.SetupTest(t)
	defer cleanup()

	ctx := context.Background()

	testUserID := uuid.New()
	clerkID := "clerk_test_" + uuid.New().String()[:8]
	email := "test_" + uuid.New().String()[:8] + "@example.com"
	initialPtn := "ITB"
	initialScore := 650

	// Create user with onboarding already completed
	_, err := testDB.Pool.Exec(ctx, `
		INSERT INTO users (id, clerk_id, email, target_ptn, target_score, subscription_tier, is_active, onboarding_completed, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
	`, testUserID, clerkID, email, initialPtn, initialScore, "free", true, true)
	require.NoError(t, err)

	userRepo := repository.NewUserRepository(testServer)
	userService := service.NewUserService(testServer, userRepo, nil)
	userHandler := NewUserHandler(testServer, userService)

	e := echo.New()

	// Try to complete onboarding again with different data
	onboardingRequest := map[string]interface{}{
		"targetPtn":   "UI",
		"targetScore": 700,
	}
	jsonBody, _ := json.Marshal(onboardingRequest)

	req := httptest.NewRequest(http.MethodPost, "/api/v1/users/me/onboarding", bytes.NewReader(jsonBody))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()

	c := e.NewContext(req, rec)
	c.Set("user_id", clerkID) // uses clerkID
	logger := zerolog.Nop()
	c.Set("logger", &logger)

	err = userHandler.CompleteOnboarding(c)
	require.NoError(t, err)
	assert.Equal(t, http.StatusOK, rec.Code)

	// Verify data was updated (onboarding can be re-done)
	var dbUser struct {
		TargetPtn   *string
		TargetScore *int
	}
	err = testDB.Pool.QueryRow(ctx, `
		SELECT target_ptn, target_score FROM users WHERE id = $1
	`, testUserID).Scan(&dbUser.TargetPtn, &dbUser.TargetScore)
	require.NoError(t, err)

	assert.Equal(t, "UI", *dbUser.TargetPtn, "target PTN should be updated")
	assert.Equal(t, 700, *dbUser.TargetScore, "target score should be updated")
}
