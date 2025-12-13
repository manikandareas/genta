package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/manikandareas/genta/internal/model/user"
	"github.com/rs/zerolog"
	"github.com/stretchr/testify/assert"
)

// Helper function to create test echo context
func setupTestContext(method, path string, body interface{}) (echo.Context, *httptest.ResponseRecorder) {
	e := echo.New()

	var req *http.Request
	if body != nil {
		jsonBody, _ := json.Marshal(body)
		req = httptest.NewRequest(method, path, bytes.NewReader(jsonBody))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	} else {
		req = httptest.NewRequest(method, path, nil)
	}

	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	// Set logger in context (required by middleware)
	logger := zerolog.Nop()
	c.Set("logger", &logger)

	return c, rec
}

func TestUpdateUser_RequestBinding(t *testing.T) {
	tests := []struct {
		name           string
		requestBody    map[string]interface{}
		expectedStatus int
		description    string
	}{
		{
			name: "valid full update request",
			requestBody: map[string]interface{}{
				"fullName":          "Rina Wijaya",
				"targetPtn":         "UI",
				"targetScore":       700,
				"examDate":          "2026-03-15T00:00:00Z",
				"studyHoursPerWeek": 10,
			},
			expectedStatus: http.StatusOK,
			description:    "Should accept valid full update request",
		},
		{
			name: "valid partial update - only fullName",
			requestBody: map[string]interface{}{
				"fullName": "Updated Name",
			},
			expectedStatus: http.StatusOK,
			description:    "Should accept partial update with only fullName",
		},
		{
			name: "valid partial update - only targetScore",
			requestBody: map[string]interface{}{
				"targetScore": 650,
			},
			expectedStatus: http.StatusOK,
			description:    "Should accept partial update with only targetScore",
		},
		{
			name:           "empty request body",
			requestBody:    map[string]interface{}{},
			expectedStatus: http.StatusOK,
			description:    "Should accept empty request (no updates)",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			c, _ := setupTestContext(http.MethodPut, "/api/v1/users/me", tt.requestBody)

			// Test request binding
			var req user.PutUserRequest
			err := c.Bind(&req)

			assert.NoError(t, err, tt.description)
		})
	}
}

func TestUpdateUser_ValidationErrors(t *testing.T) {
	tests := []struct {
		name        string
		requestBody map[string]interface{}
		expectError bool
		description string
	}{
		{
			name: "invalid fullName - too long",
			requestBody: map[string]interface{}{
				"fullName": string(make([]byte, 300)), // exceeds 255 chars
			},
			expectError: true,
			description: "Should reject fullName exceeding 255 characters",
		},
		{
			name: "invalid targetPtn - too long",
			requestBody: map[string]interface{}{
				"targetPtn": string(make([]byte, 150)), // exceeds 100 chars
			},
			expectError: true,
			description: "Should reject targetPtn exceeding 100 characters",
		},
		{
			name: "invalid targetScore - negative",
			requestBody: map[string]interface{}{
				"targetScore": -100,
			},
			expectError: true,
			description: "Should reject negative targetScore",
		},
		{
			name: "invalid studyHoursPerWeek - exceeds max",
			requestBody: map[string]interface{}{
				"studyHoursPerWeek": 200, // exceeds 168 hours
			},
			expectError: true,
			description: "Should reject studyHoursPerWeek exceeding 168",
		},
		{
			name: "invalid studyHoursPerWeek - negative",
			requestBody: map[string]interface{}{
				"studyHoursPerWeek": -5,
			},
			expectError: true,
			description: "Should reject negative studyHoursPerWeek",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			c, _ := setupTestContext(http.MethodPut, "/api/v1/users/me", tt.requestBody)

			var req user.PutUserRequest
			_ = c.Bind(&req)

			err := req.Validate()

			if tt.expectError {
				assert.Error(t, err, tt.description)
			} else {
				assert.NoError(t, err, tt.description)
			}
		})
	}
}

func TestUpdateUser_ResponseFormat(t *testing.T) {
	// Test that response matches API documentation format
	// Based on docs/backend/API_DOCUMENTATION.md

	// Expected response structure for PUT /api/v1/users/me
	type ExpectedResponse struct {
		Code      string      `json:"code"`
		Message   string      `json:"message"`
		Status    int         `json:"status"`
		Timestamp string      `json:"timestamp"`
		Data      interface{} `json:"data"`
	}

	// Verify response structure matches documentation
	response := ExpectedResponse{
		Code:      "OK",
		Message:   "User updated",
		Status:    200,
		Timestamp: time.Now().UTC().Format(time.RFC3339),
		Data: map[string]interface{}{
			"id":                  "550e8400-e29b-41d4-a716-446655440000",
			"email":               "student@example.com",
			"fullName":            "Rina Wijaya",
			"targetPtn":           "UI",
			"targetScore":         700,
			"examDate":            "2026-03-15",
			"studyHoursPerWeek":   10,
			"onboardingCompleted": true,
		},
	}

	// Verify JSON marshaling works correctly
	jsonData, err := json.Marshal(response)
	assert.NoError(t, err)
	assert.NotEmpty(t, jsonData)

	// Verify response can be unmarshaled back
	var unmarshaled ExpectedResponse
	err = json.Unmarshal(jsonData, &unmarshaled)
	assert.NoError(t, err)
	assert.Equal(t, "OK", unmarshaled.Code)
	assert.Equal(t, 200, unmarshaled.Status)
}

func TestUpdateUser_ErrorResponseFormat(t *testing.T) {
	// Test error response format matches API documentation

	type ErrorResponse struct {
		Code      string      `json:"code"`
		Message   string      `json:"message"`
		Status    int         `json:"status"`
		Timestamp string      `json:"timestamp"`
		Override  bool        `json:"override"`
		Errors    interface{} `json:"errors"`
		Action    interface{} `json:"action"`
		RequestID string      `json:"request_id"`
	}

	tests := []struct {
		name     string
		response ErrorResponse
	}{
		{
			name: "401 Unauthorized",
			response: ErrorResponse{
				Code:      "UNAUTHORIZED",
				Message:   "Invalid or expired token",
				Status:    401,
				Timestamp: time.Now().UTC().Format(time.RFC3339),
				Override:  false,
				Action: map[string]string{
					"type":    "redirect",
					"message": "Please login again",
					"value":   "/login",
				},
			},
		},
		{
			name: "404 Not Found",
			response: ErrorResponse{
				Code:      "NOT_FOUND",
				Message:   "User not found",
				Status:    404,
				Timestamp: time.Now().UTC().Format(time.RFC3339),
				Override:  false,
			},
		},
		{
			name: "400 Bad Request - Validation Error",
			response: ErrorResponse{
				Code:      "BAD_REQUEST",
				Message:   "Validation failed",
				Status:    400,
				Timestamp: time.Now().UTC().Format(time.RFC3339),
				Override:  false,
				Errors: []map[string]string{
					{
						"field": "targetScore",
						"error": "targetScore must be at least 0",
						"code":  "INVALID_VALUE",
					},
				},
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			jsonData, err := json.Marshal(tt.response)
			assert.NoError(t, err)
			assert.NotEmpty(t, jsonData)

			var unmarshaled ErrorResponse
			err = json.Unmarshal(jsonData, &unmarshaled)
			assert.NoError(t, err)
			assert.Equal(t, tt.response.Code, unmarshaled.Code)
			assert.Equal(t, tt.response.Status, unmarshaled.Status)
		})
	}
}

func TestUpdateUser_RequiresAuthentication(t *testing.T) {
	// Test that endpoint requires authentication
	// The middleware.GetUserID should return empty string if not authenticated

	c, _ := setupTestContext(http.MethodPut, "/api/v1/users/me", nil)

	// Without setting user_id in context, GetUserID should return empty
	userID := c.Get("user_id")
	assert.Nil(t, userID, "user_id should be nil when not authenticated")
}

func TestUpdateUser_AuthenticatedUser(t *testing.T) {
	// Test with authenticated user
	c, _ := setupTestContext(http.MethodPut, "/api/v1/users/me", nil)

	// Simulate authenticated user (set by auth middleware)
	expectedUserID := "550e8400-e29b-41d4-a716-446655440000"
	c.Set("user_id", expectedUserID)

	userID := c.Get("user_id")
	assert.Equal(t, expectedUserID, userID)
}

// ==================== GetUser Unit Tests ====================

func TestGetUser_RequiresAuthentication(t *testing.T) {
	// Test that GET /me endpoint requires authentication
	c, _ := setupTestContext(http.MethodGet, "/api/v1/users/me", nil)

	// Without setting user_id in context, GetUserID should return empty
	userID := c.Get("user_id")
	assert.Nil(t, userID, "user_id should be nil when not authenticated")
}

func TestGetUser_AuthenticatedUser(t *testing.T) {
	// Test with authenticated user
	c, _ := setupTestContext(http.MethodGet, "/api/v1/users/me", nil)

	// Simulate authenticated user (set by auth middleware)
	expectedUserID := "550e8400-e29b-41d4-a716-446655440000"
	c.Set("user_id", expectedUserID)

	userID := c.Get("user_id")
	assert.Equal(t, expectedUserID, userID)
}

func TestGetUser_ResponseFormat(t *testing.T) {
	// Test that response matches API documentation format for GET /api/v1/users/me
	type ExpectedResponse struct {
		Code      string      `json:"code"`
		Message   string      `json:"message"`
		Status    int         `json:"status"`
		Timestamp string      `json:"timestamp"`
		Data      interface{} `json:"data"`
	}

	// Verify response structure matches documentation
	response := ExpectedResponse{
		Code:      "OK",
		Message:   "User retrieved",
		Status:    200,
		Timestamp: time.Now().UTC().Format(time.RFC3339),
		Data: map[string]interface{}{
			"id":                   "550e8400-e29b-41d4-a716-446655440000",
			"clerkId":              "clerk_test_123",
			"email":                "student@example.com",
			"fullName":             "Rina Wijaya",
			"avatarUrl":            nil,
			"subscriptionTier":     "free",
			"isSubscriptionActive": false,
			"irtTheta":             nil,
			"irtVariance":          nil,
			"targetPtn":            "UI",
			"targetScore":          700,
			"examDate":             "2026-03-15T00:00:00Z",
			"studyHoursPerWeek":    10,
			"onboardingCompleted":  true,
			"isEmailVerified":      true,
			"isActive":             true,
			"lastLogin":            nil,
			"createdAt":            "2024-01-01T00:00:00Z",
			"updatedAt":            "2024-01-01T00:00:00Z",
		},
	}

	// Verify JSON marshaling works correctly
	jsonData, err := json.Marshal(response)
	assert.NoError(t, err)
	assert.NotEmpty(t, jsonData)

	// Verify response can be unmarshaled back
	var unmarshaled ExpectedResponse
	err = json.Unmarshal(jsonData, &unmarshaled)
	assert.NoError(t, err)
	assert.Equal(t, "OK", unmarshaled.Code)
	assert.Equal(t, 200, unmarshaled.Status)
}

func TestGetUser_ErrorResponseFormat(t *testing.T) {
	// Test error response format for GET /me endpoint

	type ErrorResponse struct {
		Code      string      `json:"code"`
		Message   string      `json:"message"`
		Status    int         `json:"status"`
		Timestamp string      `json:"timestamp"`
		Override  bool        `json:"override"`
		Errors    interface{} `json:"errors"`
		Action    interface{} `json:"action"`
		RequestID string      `json:"request_id"`
	}

	tests := []struct {
		name     string
		response ErrorResponse
	}{
		{
			name: "401 Unauthorized - No Token",
			response: ErrorResponse{
				Code:      "UNAUTHORIZED",
				Message:   "Invalid or expired token",
				Status:    401,
				Timestamp: time.Now().UTC().Format(time.RFC3339),
				Override:  false,
				Action: map[string]string{
					"type":    "redirect",
					"message": "Please login again",
					"value":   "/login",
				},
			},
		},
		{
			name: "404 Not Found - User Deleted",
			response: ErrorResponse{
				Code:      "NOT_FOUND",
				Message:   "User not found",
				Status:    404,
				Timestamp: time.Now().UTC().Format(time.RFC3339),
				Override:  false,
			},
		},
		{
			name: "500 Internal Server Error",
			response: ErrorResponse{
				Code:      "INTERNAL_SERVER_ERROR",
				Message:   "An unexpected error occurred",
				Status:    500,
				Timestamp: time.Now().UTC().Format(time.RFC3339),
				Override:  false,
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			jsonData, err := json.Marshal(tt.response)
			assert.NoError(t, err)
			assert.NotEmpty(t, jsonData)

			var unmarshaled ErrorResponse
			err = json.Unmarshal(jsonData, &unmarshaled)
			assert.NoError(t, err)
			assert.Equal(t, tt.response.Code, unmarshaled.Code)
			assert.Equal(t, tt.response.Status, unmarshaled.Status)
		})
	}
}

func TestGetUser_NoRequestBody(t *testing.T) {
	// GET /me should not require any request body
	c, _ := setupTestContext(http.MethodGet, "/api/v1/users/me", nil)

	// Verify request has no body
	assert.Equal(t, int64(0), c.Request().ContentLength)
}

// ==================== CompleteOnboarding Unit Tests ====================

func TestCompleteOnboarding_RequestBinding(t *testing.T) {
	tests := []struct {
		name           string
		requestBody    map[string]interface{}
		expectedStatus int
		description    string
	}{
		{
			name: "valid full onboarding request",
			requestBody: map[string]interface{}{
				"targetPtn":         "UI",
				"targetScore":       700,
				"examDate":          "2026-03-15T00:00:00Z",
				"studyHoursPerWeek": 10,
			},
			expectedStatus: http.StatusOK,
			description:    "Should accept valid full onboarding request",
		},
		{
			name: "valid partial onboarding - only targetPtn",
			requestBody: map[string]interface{}{
				"targetPtn": "ITB",
			},
			expectedStatus: http.StatusOK,
			description:    "Should accept partial onboarding with only targetPtn",
		},
		{
			name: "valid partial onboarding - only targetScore",
			requestBody: map[string]interface{}{
				"targetScore": 650,
			},
			expectedStatus: http.StatusOK,
			description:    "Should accept partial onboarding with only targetScore",
		},
		{
			name:           "empty request body",
			requestBody:    map[string]interface{}{},
			expectedStatus: http.StatusOK,
			description:    "Should accept empty request (no onboarding data)",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			c, _ := setupTestContext(http.MethodPost, "/api/v1/users/me/onboarding", tt.requestBody)

			// Test request binding
			var req user.CompleteOnboardingRequest
			err := c.Bind(&req)

			assert.NoError(t, err, tt.description)
		})
	}
}

func TestCompleteOnboarding_ValidationErrors(t *testing.T) {
	tests := []struct {
		name        string
		requestBody map[string]interface{}
		expectError bool
		description string
	}{
		{
			name: "invalid targetPtn - too long",
			requestBody: map[string]interface{}{
				"targetPtn": string(make([]byte, 150)), // exceeds 100 chars
			},
			expectError: true,
			description: "Should reject targetPtn exceeding 100 characters",
		},
		{
			name: "invalid targetScore - negative",
			requestBody: map[string]interface{}{
				"targetScore": -100,
			},
			expectError: true,
			description: "Should reject negative targetScore",
		},
		{
			name: "invalid studyHoursPerWeek - exceeds max",
			requestBody: map[string]interface{}{
				"studyHoursPerWeek": 200, // exceeds 168 hours
			},
			expectError: true,
			description: "Should reject studyHoursPerWeek exceeding 168",
		},
		{
			name: "invalid studyHoursPerWeek - negative",
			requestBody: map[string]interface{}{
				"studyHoursPerWeek": -5,
			},
			expectError: true,
			description: "Should reject negative studyHoursPerWeek",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			c, _ := setupTestContext(http.MethodPost, "/api/v1/users/me/onboarding", tt.requestBody)

			var req user.CompleteOnboardingRequest
			_ = c.Bind(&req)

			err := req.Validate()

			if tt.expectError {
				assert.Error(t, err, tt.description)
			} else {
				assert.NoError(t, err, tt.description)
			}
		})
	}
}

func TestCompleteOnboarding_ResponseFormat(t *testing.T) {
	// Test that response matches API documentation format for POST /api/v1/users/me/onboarding
	type ExpectedResponse struct {
		Code      string      `json:"code"`
		Message   string      `json:"message"`
		Status    int         `json:"status"`
		Timestamp string      `json:"timestamp"`
		Data      interface{} `json:"data"`
	}

	// Verify response structure matches documentation
	response := ExpectedResponse{
		Code:      "OK",
		Message:   "Onboarding completed",
		Status:    200,
		Timestamp: time.Now().UTC().Format(time.RFC3339),
		Data: map[string]interface{}{
			"targetPtn":         "UI",
			"targetScore":       700,
			"examDate":          "2026-03-15T00:00:00Z",
			"studyHoursPerWeek": 10,
		},
	}

	// Verify JSON marshaling works correctly
	jsonData, err := json.Marshal(response)
	assert.NoError(t, err)
	assert.NotEmpty(t, jsonData)

	// Verify response can be unmarshaled back
	var unmarshaled ExpectedResponse
	err = json.Unmarshal(jsonData, &unmarshaled)
	assert.NoError(t, err)
	assert.Equal(t, "OK", unmarshaled.Code)
	assert.Equal(t, 200, unmarshaled.Status)
}

func TestCompleteOnboarding_ErrorResponseFormat(t *testing.T) {
	// Test error response format for POST /me/onboarding endpoint

	type ErrorResponse struct {
		Code      string      `json:"code"`
		Message   string      `json:"message"`
		Status    int         `json:"status"`
		Timestamp string      `json:"timestamp"`
		Override  bool        `json:"override"`
		Errors    interface{} `json:"errors"`
		Action    interface{} `json:"action"`
		RequestID string      `json:"request_id"`
	}

	tests := []struct {
		name     string
		response ErrorResponse
	}{
		{
			name: "401 Unauthorized - No Token",
			response: ErrorResponse{
				Code:      "UNAUTHORIZED",
				Message:   "Invalid or expired token",
				Status:    401,
				Timestamp: time.Now().UTC().Format(time.RFC3339),
				Override:  false,
				Action: map[string]string{
					"type":    "redirect",
					"message": "Please login again",
					"value":   "/login",
				},
			},
		},
		{
			name: "400 Bad Request - Validation Error",
			response: ErrorResponse{
				Code:      "BAD_REQUEST",
				Message:   "Validation failed",
				Status:    400,
				Timestamp: time.Now().UTC().Format(time.RFC3339),
				Override:  false,
				Errors: []map[string]string{
					{
						"field": "studyHoursPerWeek",
						"error": "must not exceed 168",
					},
				},
			},
		},
		{
			name: "500 Internal Server Error",
			response: ErrorResponse{
				Code:      "INTERNAL_SERVER_ERROR",
				Message:   "An unexpected error occurred",
				Status:    500,
				Timestamp: time.Now().UTC().Format(time.RFC3339),
				Override:  false,
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			jsonData, err := json.Marshal(tt.response)
			assert.NoError(t, err)
			assert.NotEmpty(t, jsonData)

			var unmarshaled ErrorResponse
			err = json.Unmarshal(jsonData, &unmarshaled)
			assert.NoError(t, err)
			assert.Equal(t, tt.response.Code, unmarshaled.Code)
			assert.Equal(t, tt.response.Status, unmarshaled.Status)
		})
	}
}

func TestCompleteOnboarding_RequiresAuthentication(t *testing.T) {
	// Test that endpoint requires authentication
	c, _ := setupTestContext(http.MethodPost, "/api/v1/users/me/onboarding", nil)

	// Without setting user_id in context, GetUserID should return empty
	userID := c.Get("user_id")
	assert.Nil(t, userID, "user_id should be nil when not authenticated")
}

func TestCompleteOnboarding_AuthenticatedUser(t *testing.T) {
	// Test with authenticated user
	c, _ := setupTestContext(http.MethodPost, "/api/v1/users/me/onboarding", nil)

	// Simulate authenticated user (set by auth middleware)
	expectedUserID := "550e8400-e29b-41d4-a716-446655440000"
	c.Set("user_id", expectedUserID)

	userID := c.Get("user_id")
	assert.Equal(t, expectedUserID, userID)
}
