# 🔌 GENTA - BACKEND API DOCUMENTATION

**AI-Powered UTBK Prep Platform - REST API Specification**  
**Version 1.0 | December 2025 | OpenAPI 3.1.0 Compatible**

---

## 📋 TABLE OF CONTENTS

1. [API Overview](#api-overview)
2. [Getting Started](#getting-started)
3. [Response Format](#response-format)
4. [Error Handling](#error-handling)
5. [Authentication](#authentication)
6. [Core Endpoints](#core-endpoints)
7. [Pagination](#pagination)
8. [Rate Limiting](#rate-limiting)
9. [Webhooks](#webhooks)
10. [Status Codes Reference](#status-codes-reference)

---

## 🌐 API OVERVIEW

### **Base URL**

```
Development:  http://localhost:8080/api/v1
Staging:      https://staging-api.genta.id/api/v1
Production:   https://api.genta.id/api/v1
```

### **API Characteristics**

| Property            | Value                         |
| ------------------- | ----------------------------- |
| **Protocol**        | REST over HTTPS               |
| **Format**          | JSON (UTF-8)                  |
| **Authentication**  | Clerk JWT + Bearer Token      |
| **Rate Limit**      | 1000 requests/minute per user |
| **Request Timeout** | 30 seconds                    |
| **API Version**     | v1 (in URL path)              |
| **Response Time**   | P95: < 500ms                  |

### **Standard Request Headers**

```http
Content-Type: application/json
Authorization: Bearer <clerk_jwt_token>
X-Request-ID: [optional UUID for tracing]
User-Agent: YourApp/<version>
Accept-Language: id-ID (optional)
```

### **Standard Response Headers**

```http
Content-Type: application/json; charset=utf-8
X-Request-ID: req_550e8400e29b41d4
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 950
X-RateLimit-Reset: 1702390260
Vary: Accept-Encoding
Cache-Control: no-cache, no-store, must-revalidate
```

---

## 🚀 GETTING STARTED

### **Prerequisites**

- Active Clerk account (authentication)
- Valid JWT token from Clerk
- HTTPS-capable HTTP client

### **Quick Start Example**

**1. Authenticate with Clerk**

```
User logs in via Clerk UI → receives JWT token
```

**2. Get Current User**

```http
GET /api/v1/auth/me HTTP/1.1
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

**3. Get Next Practice Question**

```http
GET /api/v1/questions/next?section=PU HTTP/1.1
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

**4. Submit Answer**

```http
POST /api/v1/attempts HTTP/1.1
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "question_id": "q-042",
  "selected_answer": "C",
  "time_spent_seconds": 45,
  "session_id": "session_550e8400"
}
```

**5. Check Readiness**

```http
GET /api/v1/readiness HTTP/1.1
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📤 RESPONSE FORMAT

### **Success Response Structure**

All successful responses follow this consistent format:

```json
{
  "code": "OK", // Response code (OK, CREATED, ACCEPTED)
  "message": "Request successful", // Human-readable message
  "status": 200, // HTTP status code
  "timestamp": "2025-12-12T10:30:00Z", // ISO 8601 UTC timestamp
  "data": {
    /* resource data */
  },
  "meta": {
    "version": "1.0",
    "requestId": "req_550e8400e29b41d4",
    "processingTimeMs": 45
  }
}
```

### **1. Simple Success Response (200 OK)**

**When:** Successful GET, PUT, or other state-changing operations

```json
{
  "code": "OK",
  "message": "User retrieved",
  "status": 200,
  "timestamp": "2025-12-12T10:30:00Z",
  "data": {
    "id": "user_550e8400",
    "email": "student@example.com",
    "full_name": "Rina Wijaya",
    "subscription_tier": "premium",
    "irt_theta": 0.35,
    "target_score": 700,
    "exam_date": "2026-03-15",
    "is_email_verified": true,
    "created_at": "2025-11-01T14:22:00Z"
  },
  "meta": {
    "version": "1.0",
    "requestId": "req_550e8400e29b41d4",
    "processingTimeMs": 45
  }
}
```

### **2. Paginated List Response (200 OK)**

**When:** Listing multiple resources (questions, attempts, sessions)

```json
{
  "code": "OK",
  "message": "Questions retrieved",
  "status": 200,
  "timestamp": "2025-12-12T10:30:00Z",
  "data": [
    {
      "id": "q-001",
      "section": "PU",
      "sub_type": "vocabulary",
      "text": "Arti kata 'meticulous' adalah...",
      "options": ["Cermat", "Cepat", "Kasar", "Lambat", "Santai"],
      "difficulty_irt": 0.45,
      "discrimination": 0.82,
      "attempt_count": 234,
      "correct_rate": 0.68
    },
    {
      "id": "q-002",
      "section": "PU",
      "sub_type": "analogy",
      "text": "Dua frasa berikut memiliki makna paling dekat...",
      "options": [
        "Kembali + Balik",
        "Pergi + Pindah",
        "Tiba + Sampai",
        "Tinggal + Diam",
        "Ambil + Pegang"
      ],
      "difficulty_irt": 0.62,
      "discrimination": 0.75,
      "attempt_count": 198,
      "correct_rate": 0.71
    }
  ],
  "pagination": {
    "total": 500,
    "page": 1,
    "limit": 10,
    "total_pages": 50,
    "has_next": true,
    "has_prev": false
  },
  "meta": {
    "version": "1.0",
    "requestId": "req_550e8400e29b41d4",
    "processingTimeMs": 234
  }
}
```

### **3. Created Response (201 Created)**

**When:** POST request successfully creates a new resource

```json
{
  "code": "CREATED",
  "message": "Attempt recorded successfully",
  "status": 201,
  "timestamp": "2025-12-12T10:30:00Z",
  "data": {
    "id": "attempt_550e8400",
    "user_id": "user_001",
    "question_id": "q-001",
    "selected_answer": "C",
    "is_correct": true,
    "time_spent_seconds": 45,
    "user_theta_before": 0.25,
    "user_theta_after": 0.35,
    "theta_change": 0.1,
    "feedback_generated": false,
    "session_id": "session_550e8400",
    "created_at": "2025-12-12T10:30:00Z"
  },
  "meta": {
    "version": "1.0",
    "requestId": "req_550e8400e29b41d4",
    "processingTimeMs": 156
  }
}
```

### **4. Accepted Response (202 Accepted)**

**When:** Request submitted for async processing (feedback generation, batch jobs)

```json
{
  "code": "ACCEPTED",
  "message": "Feedback generation queued",
  "status": 202,
  "timestamp": "2025-12-12T10:30:00Z",
  "data": {
    "job_id": "job_550e8400e29b41d4",
    "attempt_id": "attempt_550e8400",
    "status": "queued",
    "estimated_completion_seconds": 8,
    "check_status_url": "/api/v1/jobs/job_550e8400e29b41d4/check"
  },
  "meta": {
    "version": "1.0",
    "requestId": "req_550e8400e29b41d4",
    "processingTimeMs": 12
  }
}
```

### **5. Health Check Response (200 OK)**

**Endpoint:** `GET /api/v1/health`

**Purpose:** Monitor API and dependencies health

```json
{
  "status": "healthy",
  "timestamp": "2025-12-12T10:30:00Z",
  "environment": "production",
  "version": "1.0.0",
  "uptime_seconds": 604800,
  "checks": {
    "database": {
      "status": "healthy",
      "response_time_ms": 5.123,
      "last_checked": "2025-12-12T10:29:55Z"
    },
    "redis": {
      "status": "healthy",
      "response_time_ms": 2.456,
      "last_checked": "2025-12-12T10:29:55Z"
    },
    "llm_api": {
      "status": "healthy",
      "response_time_ms": 245.789,
      "last_checked": "2025-12-12T10:25:00Z"
    }
  }
}
```

**Unhealthy Response (503 Service Unavailable):**

```json
{
  "status": "unhealthy",
  "timestamp": "2025-12-12T10:30:00Z",
  "environment": "production",
  "version": "1.0.0",
  "checks": {
    "database": {
      "status": "unhealthy",
      "response_time_ms": 5000.0,
      "last_checked": "2025-12-12T10:29:55Z",
      "error": "connection refused"
    },
    "redis": {
      "status": "healthy",
      "response_time_ms": 2.456,
      "last_checked": "2025-12-12T10:29:55Z"
    }
  }
}
```

---

## ❌ ERROR HANDLING

### **Error Response Structure**

All error responses follow this consistent format:

```json
{
  "code": "ERROR_CODE", // Uppercase with underscores
  "message": "Error message", // Human-readable description
  "status": 400, // HTTP status code
  "timestamp": "2025-12-12T10:30:00Z",
  "override": false, // Whether client should override behavior
  "errors": [
    // Optional: field-level errors
    {
      "field": "email",
      "error": "email is required",
      "code": "REQUIRED"
    }
  ],
  "action": {
    // Optional: suggested action
    "type": "redirect", // or "retry", "refresh", "logout"
    "message": "Please login again",
    "value": "/login"
  },
  "request_id": "req_550e8400e29b41d4" // For debugging
}
```

### **Error Response Examples**

#### **400 - Bad Request (Validation Error)**

**When:** User submits invalid data or malformed request

```json
{
  "code": "BAD_REQUEST",
  "message": "Validation failed",
  "status": 400,
  "timestamp": "2025-12-12T10:30:00Z",
  "override": false,
  "errors": [
    {
      "field": "email",
      "error": "email is required",
      "code": "REQUIRED"
    },
    {
      "field": "password",
      "error": "password must be at least 8 characters",
      "code": "INVALID_LENGTH"
    },
    {
      "field": "exam_date",
      "error": "exam date must be in the future",
      "code": "INVALID_VALUE"
    }
  ],
  "action": null,
  "request_id": "req_550e8400e29b41d4"
}
```

#### **401 - Unauthorized**

**When:** Missing or invalid authentication token

```json
{
  "code": "UNAUTHORIZED",
  "message": "Invalid or expired token",
  "status": 401,
  "timestamp": "2025-12-12T10:30:00Z",
  "override": false,
  "errors": null,
  "action": {
    "type": "redirect",
    "message": "Please login again",
    "value": "/login"
  },
  "request_id": "req_550e8400e29b41d4"
}
```

#### **403 - Forbidden**

**When:** User lacks permission to access resource

```json
{
  "code": "FORBIDDEN",
  "message": "You don't have permission to access this resource",
  "status": 403,
  "timestamp": "2025-12-12T10:30:00Z",
  "override": false,
  "errors": null,
  "action": null,
  "request_id": "req_550e8400e29b41d4"
}
```

#### **404 - Not Found**

**When:** Requested resource doesn't exist

```json
{
  "code": "NOT_FOUND",
  "message": "User not found",
  "status": 404,
  "timestamp": "2025-12-12T10:30:00Z",
  "override": false,
  "errors": null,
  "action": null,
  "request_id": "req_550e8400e29b41d4"
}
```

#### **409 - Conflict**

**When:** Duplicate resource or state conflict

```json
{
  "code": "CONFLICT",
  "message": "Email already registered",
  "status": 409,
  "timestamp": "2025-12-12T10:30:00Z",
  "override": false,
  "errors": [
    {
      "field": "email",
      "error": "This email is already registered",
      "code": "DUPLICATE"
    }
  ],
  "action": null,
  "request_id": "req_550e8400e29b41d4"
}
```

#### **429 - Too Many Requests**

**When:** Rate limit exceeded

```json
{
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests, please try again later",
  "status": 429,
  "timestamp": "2025-12-12T10:30:00Z",
  "override": false,
  "errors": null,
  "action": {
    "type": "retry",
    "message": "Please try again in 60 seconds",
    "value": "60"
  },
  "request_id": "req_550e8400e29b41d4"
}
```

**Additional Headers:**

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1702390260
Retry-After: 60
```

#### **500 - Internal Server Error**

**When:** Unexpected server error occurs

```json
{
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Internal Server Error",
  "status": 500,
  "timestamp": "2025-12-12T10:30:00Z",
  "override": false,
  "errors": null,
  "action": null,
  "request_id": "req_550e8400e29b41d4"
}
```

#### **503 - Service Unavailable**

**When:** Database/Redis/external service down

```json
{
  "code": "SERVICE_UNAVAILABLE",
  "message": "Service temporarily unavailable",
  "status": 503,
  "timestamp": "2025-12-12T10:30:00Z",
  "override": false,
  "errors": null,
  "action": {
    "type": "retry",
    "message": "Our service is undergoing maintenance. Please try again in a few minutes.",
    "value": "300"
  },
  "request_id": "req_550e8400e29b41d4"
}
```

### **Common Error Codes Reference**

| HTTP Code | Error Code            | Description                     | Action                   |
| --------- | --------------------- | ------------------------------- | ------------------------ |
| 400       | BAD_REQUEST           | Invalid input/malformed request | Fix and retry            |
| 400       | VALIDATION_ERROR      | Validation failed on fields     | Show field errors        |
| 401       | UNAUTHORIZED          | Missing/invalid token           | Redirect to login        |
| 403       | FORBIDDEN             | No permission                   | Show access denied       |
| 404       | NOT_FOUND             | Resource doesn't exist          | Show 404 page            |
| 409       | CONFLICT              | Duplicate/state conflict        | Show conflict message    |
| 429       | RATE_LIMIT_EXCEEDED   | Too many requests               | Retry after delay        |
| 500       | INTERNAL_SERVER_ERROR | Server error                    | Retry or contact support |
| 503       | SERVICE_UNAVAILABLE   | Service down                    | Retry later              |

---

## 🔐 AUTHENTICATION

### **Authentication Method**

**Type:** Bearer Token (JWT)  
**Issuer:** Clerk  
**Algorithm:** RS256

### **How It Works**

1. User authenticates via Clerk UI (login/signup handled by Clerk)
2. Clerk issues JWT token (valid for 1 hour)
3. Token is sent in `Authorization: Bearer <token>` header
4. Backend validates token with Clerk API
5. Token is refreshed automatically by Clerk SDK

**Note:** Login, signup, and logout are handled entirely by Clerk frontend SDK. The backend only validates tokens and manages user data.

### **Token Structure**

JWT tokens include:

- `sub` - Clerk User ID
- `email` - User email
- `email_verified` - Email verification status
- `iat` - Issued at
- `exp` - Expiration time

### **Making Authenticated Requests**

```http
GET /api/v1/auth/me HTTP/1.1
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### **Response When Authenticated**

```json
{
  "code": "OK",
  "message": "Current user retrieved",
  "status": 200,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "clerk_id": "user_2abc123def456",
    "email": "student@example.com",
    "full_name": "Rina Wijaya",
    "subscription_tier": "premium",
    "target_ptn": "UI",
    "target_score": 700,
    "exam_date": "2026-03-15",
    "study_hours_per_week": 10,
    "onboarding_completed": true,
    "irt_theta": 0.35,
    "created_at": "2025-11-01T14:22:00Z"
  }
}
```

---

## 📡 CORE ENDPOINTS

### **Health Check**

#### `GET /api/v1/health`

**Authentication:** Not required  
**Rate Limit:** Unlimited  
**Purpose:** Monitor API and dependencies

**Response:** 200 OK

```json
{
  "status": "healthy",
  "timestamp": "2025-12-12T10:30:00Z",
  "environment": "production",
  "version": "1.0.0",
  "checks": {
    "database": { "status": "healthy", "response_time_ms": 5.1 },
    "redis": { "status": "healthy", "response_time_ms": 2.5 }
  }
}
```

---

### **User Endpoints**

#### `PUT /api/v1/users/me`

**Authentication:** Bearer JWT Required  
**Rate Limit:** Standard (1000/min)  
**Purpose:** Update current user profile and onboarding data

**Request Body:**

```json
{
  "full_name": "Rina Wijaya",
  "target_ptn": "UI",
  "target_score": 700,
  "exam_date": "2026-03-15",
  "study_hours_per_week": 10
}
```

| Field                  | Type    | Required | Description                 |
| ---------------------- | ------- | -------- | --------------------------- |
| `full_name`            | string  | No       | User's display name         |
| `target_ptn`           | string  | No       | Target university           |
| `target_score`         | integer | No       | Target UTBK score (550-750) |
| `exam_date`            | string  | No       | Exam date (YYYY-MM-DD)      |
| `study_hours_per_week` | integer | No       | Study hours per week (5-20) |

**Response:** 200 OK

```json
{
  "code": "OK",
  "message": "User updated",
  "status": 200,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "student@example.com",
    "full_name": "Rina Wijaya",
    "target_ptn": "UI",
    "target_score": 700,
    "exam_date": "2026-03-15",
    "study_hours_per_week": 10,
    "onboarding_completed": true,
    "updated_at": "2025-12-12T10:30:00Z"
  }
}
```

---

#### `POST /api/v1/users/onboarding`

**Authentication:** Bearer JWT Required  
**Rate Limit:** Standard (1000/min)  
**Purpose:** Complete onboarding and save user preferences

**Request Body:**

```json
{
  "target_ptn": "UI",
  "target_score": 700,
  "exam_date": "2026-03-15",
  "study_hours_per_week": 10
}
```

| Field                  | Type    | Required | Description                 |
| ---------------------- | ------- | -------- | --------------------------- |
| `target_ptn`           | string  | Yes      | Target university           |
| `target_score`         | integer | Yes      | Target UTBK score (550-750) |
| `exam_date`            | string  | Yes      | Exam date (YYYY-MM-DD)      |
| `study_hours_per_week` | integer | Yes      | Study hours per week (5-20) |

**Response:** 200 OK

```json
{
  "code": "OK",
  "message": "Onboarding completed",
  "status": 200,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "onboarding_completed": true,
    "target_ptn": "UI",
    "target_score": 700,
    "exam_date": "2026-03-15",
    "study_hours_per_week": 10,
    "initial_readiness": {
      "PU": { "readiness_percentage": 0, "predicted_score_low": 500, "predicted_score_high": 550 },
      "PK": { "readiness_percentage": 0, "predicted_score_low": 500, "predicted_score_high": 550 },
      "PBM": { "readiness_percentage": 0, "predicted_score_low": 500, "predicted_score_high": 550 }
    }
  }
}
```

---

### **Questions Endpoints**

#### `GET /api/v1/questions`

**Authentication:** Bearer JWT Required  
**Rate Limit:** Standard (1000/min)  
**Purpose:** List questions with filters and pagination

**Query Parameters:**

| Parameter        | Type    | Required | Description              | Example                 |
| ---------------- | ------- | -------- | ------------------------ | ----------------------- |
| `section`        | string  | Yes      | PU, PK, or PBM           | `PU`                    |
| `sub_type`       | string  | No       | Question subtype         | `vocabulary`, `analogy` |
| `difficulty_min` | number  | No       | Min IRT difficulty       | `-2`                    |
| `difficulty_max` | number  | No       | Max IRT difficulty       | `2`                     |
| `is_reviewed`    | boolean | No       | Filter reviewed          | `true`                  |
| `page`           | integer | No       | Page number (1-indexed)  | `1`                     |
| `limit`          | integer | No       | Items per page (max 100) | `10`                    |

**Example Request:**

```http
GET /api/v1/questions?section=PU&sub_type=vocabulary&page=1&limit=10
Authorization: Bearer <token>
```

**Response:** 200 OK

```json
{
  "code": "OK",
  "message": "Questions retrieved",
  "status": 200,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "section": "PU",
      "sub_type": "vocabulary",
      "text": "Arti kata 'meticulous' adalah...",
      "options": ["Cermat", "Cepat", "Kasar", "Lambat", "Santai"],
      "correct_answer": "A",
      "difficulty_irt": 0.45,
      "discrimination": 0.82,
      "attempt_count": 234,
      "correct_rate": 0.68,
      "avg_time_seconds": 32
    }
  ],
  "pagination": {
    "total": 500,
    "page": 1,
    "limit": 10,
    "total_pages": 50,
    "has_next": true,
    "has_prev": false
  }
}
```

---

#### `GET /api/v1/questions/next`

**Authentication:** Bearer JWT Required  
**Rate Limit:** Standard (1000/min)  
**Purpose:** Get next adaptive question using IRT algorithm

**Query Parameters:**

| Parameter | Type   | Required | Description    |
| --------- | ------ | -------- | -------------- |
| `section` | string | Yes      | PU, PK, or PBM |

**Example Request:**

```http
GET /api/v1/questions/next?section=PU
Authorization: Bearer <token>
```

**Response:** 200 OK

```json
{
  "code": "OK",
  "message": "Next question selected",
  "status": 200,
  "data": {
    "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "section": "PU",
    "sub_type": "analogy",
    "text": "Dua frasa berikut memiliki makna paling dekat...",
    "options": [
      "Kembali + Balik",
      "Pergi + Pindah",
      "Tiba + Sampai",
      "Tinggal + Diam",
      "Ambil + Pegang"
    ],
    "difficulty_irt": 0.32,
    "discrimination": 0.78
  }
}
```

---

### **Attempts Endpoints**

#### `POST /api/v1/attempts`

**Authentication:** Bearer JWT Required  
**Rate Limit:** Standard (1000/min)  
**Purpose:** Record student's answer attempt

**Request Body:**

```json
{
  "question_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "selected_answer": "C",
  "time_spent_seconds": 45,
  "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

| Field                | Type    | Required | Description             | Example                                |
| -------------------- | ------- | -------- | ----------------------- | -------------------------------------- |
| `question_id`        | string  | Yes      | Question UUID           | `7c9e6679-7425-40de-944b-e07fc1f90ae7` |
| `selected_answer`    | string  | Yes      | Answer A-E              | `C`                                    |
| `time_spent_seconds` | integer | Yes      | Time in seconds (1-600) | `45`                                   |
| `session_id`         | string  | Yes      | Session UUID            | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |

**Example Request:**

```http
POST /api/v1/attempts HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "question_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "selected_answer": "C",
  "time_spent_seconds": 45,
  "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Response:** 201 Created

```json
{
  "code": "CREATED",
  "message": "Attempt recorded",
  "status": 201,
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "question_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "selected_answer": "C",
    "is_correct": true,
    "time_spent_seconds": 45,
    "user_theta_before": 0.25,
    "user_theta_after": 0.35,
    "theta_change": 0.1,
    "feedback_generated": false,
    "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "created_at": "2025-12-12T10:30:00Z"
  }
}
```

---

#### `GET /api/v1/attempts/:attempt_id`

**Authentication:** Bearer JWT Required  
**Rate Limit:** Standard (1000/min)  
**Purpose:** Get attempt details with feedback

**Path Parameters:**

| Parameter    | Type   | Description  |
| ------------ | ------ | ------------ |
| `attempt_id` | string | Attempt UUID |

**Example Request:**

```http
GET /api/v1/attempts/f47ac10b-58cc-4372-a567-0e02b2c3d479
Authorization: Bearer <token>
```

**Response:** 200 OK

```json
{
  "code": "OK",
  "message": "Attempt retrieved",
  "status": 200,
  "data": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "question_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    "selected_answer": "C",
    "correct_answer": "C",
    "is_correct": true,
    "time_spent_seconds": 45,
    "question": {
      "id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
      "text": "Dua frasa berikut memiliki makna paling dekat...",
      "options": [
        "Kembali + Balik",
        "Pergi + Pindah",
        "Tiba + Sampai",
        "Tinggal + Diam",
        "Ambil + Pegang"
      ],
      "explanation": "Tiba dan Sampai memiliki makna yang sama, keduanya berarti tiba di tempat tujuan."
    },
    "feedback": {
      "id": "c56a4180-65aa-42ec-a945-5fd21dec0538",
      "feedback_text": "Sempurna! Tiba dan Sampai adalah sinonim yang memiliki makna hampir identik...",
      "model_used": "mistral",
      "generation_time_ms": 1245,
      "is_helpful": true
    },
    "theta_change": 0.1,
    "created_at": "2025-12-12T10:30:00Z"
  }
}
```

---

#### `PUT /api/v1/attempts/:attempt_id/feedback-rating`

**Authentication:** Bearer JWT Required  
**Rate Limit:** Standard (1000/min)  
**Purpose:** Rate feedback helpfulness (👍 or 👎)

**Path Parameters:**

| Parameter    | Type   | Description  |
| ------------ | ------ | ------------ |
| `attempt_id` | string | Attempt UUID |

**Request Body:**

```json
{
  "is_helpful": true
}
```

| Field        | Type    | Required | Description                                   |
| ------------ | ------- | -------- | --------------------------------------------- |
| `is_helpful` | boolean | Yes      | true = helpful (👍), false = not helpful (👎) |

**Response:** 200 OK

```json
{
  "code": "OK",
  "message": "Feedback rating saved",
  "status": 200,
  "data": {
    "attempt_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "is_helpful": true
  }
}
```

---

### **Readiness Endpoints**

#### `GET /api/v1/readiness`

**Authentication:** Bearer JWT Required  
**Rate Limit:** Standard (1000/min)  
**Purpose:** Get user's readiness dashboard for all sections

**Query Parameters:**

| Parameter | Type   | Description                                     |
| --------- | ------ | ----------------------------------------------- |
| `section` | string | Optional: PU, PK, or PBM (all if not specified) |

**Example Request:**

```http
GET /api/v1/readiness
Authorization: Bearer <token>
```

**Response:** 200 OK

```json
{
  "code": "OK",
  "message": "Readiness data retrieved",
  "status": 200,
  "data": [
    {
      "section": "PU",
      "overall_accuracy": 0.68,
      "readiness_percentage": 72,
      "current_theta": 0.35,
      "predicted_score_low": 680,
      "predicted_score_high": 720,
      "ready_by_date": "2026-02-08",
      "improvement_rate_per_week": 2.1,
      "days_to_ready": 21,
      "total_attempts": 87,
      "recent_accuracy": 0.72,
      "recent_attempts": 15
    },
    {
      "section": "PK",
      "overall_accuracy": 0.55,
      "readiness_percentage": 58,
      "current_theta": 0.1,
      "predicted_score_low": 600,
      "predicted_score_high": 650,
      "ready_by_date": "2026-02-22",
      "improvement_rate_per_week": 1.5,
      "days_to_ready": 35,
      "total_attempts": 92,
      "recent_accuracy": 0.58,
      "recent_attempts": 18
    },
    {
      "section": "PBM",
      "overall_accuracy": 0.7,
      "readiness_percentage": 74,
      "current_theta": 0.4,
      "predicted_score_low": 700,
      "predicted_score_high": 750,
      "ready_by_date": "2026-02-01",
      "improvement_rate_per_week": 2.3,
      "days_to_ready": 14,
      "total_attempts": 78,
      "recent_accuracy": 0.74,
      "recent_attempts": 12
    }
  ]
}
```

---

### **Analytics Endpoints**

#### `GET /api/v1/analytics/progress`

**Authentication:** Bearer JWT Required  
**Rate Limit:** Standard (1000/min)  
**Purpose:** Get user's progress analytics

**Query Parameters:**

| Parameter | Type    | Default | Description           |
| --------- | ------- | ------- | --------------------- |
| `days`    | integer | 7       | 7, 30, or 90 days     |
| `section` | string  | all     | Optional: PU, PK, PBM |

**Example Request:**

```http
GET /api/v1/analytics/progress?days=7
Authorization: Bearer <token>
```

**Response:** 200 OK

```json
{
  "code": "OK",
  "message": "Progress analytics retrieved",
  "status": 200,
  "data": {
    "period_days": 7,
    "total_questions_attempted": 87,
    "total_correct": 61,
    "average_accuracy": 0.7,
    "accuracy_trend": [
      { "date": "2025-12-06", "accuracy": 0.65, "attempts": 12 },
      { "date": "2025-12-07", "accuracy": 0.68, "attempts": 14 },
      { "date": "2025-12-08", "accuracy": 0.72, "attempts": 13 },
      { "date": "2025-12-09", "accuracy": 0.71, "attempts": 11 },
      { "date": "2025-12-10", "accuracy": 0.73, "attempts": 15 },
      { "date": "2025-12-11", "accuracy": 0.72, "attempts": 12 },
      { "date": "2025-12-12", "accuracy": 0.7, "attempts": 10 }
    ],
    "section_breakdown": [
      {
        "section": "PU",
        "attempts": 30,
        "correct": 21,
        "accuracy": 0.7,
        "avg_time_seconds": 42
      },
      {
        "section": "PK",
        "attempts": 28,
        "correct": 15,
        "accuracy": 0.54,
        "avg_time_seconds": 38
      },
      {
        "section": "PBM",
        "attempts": 29,
        "correct": 25,
        "accuracy": 0.86,
        "avg_time_seconds": 35
      }
    ],
    "improvement_this_week": 2.1
  }
}
```

---

### **Payment Endpoints**

#### `POST /api/v1/payments/subscribe`

**Authentication:** Bearer JWT Required  
**Rate Limit:** Premium (100/min)  
**Purpose:** Create subscription via Midtrans

**Request Body:**

```json
{
  "subscription_tier": "premium",
  "plan_duration_days": 30
}
```

| Field                | Type    | Required | Values                    | Description       |
| -------------------- | ------- | -------- | ------------------------- | ----------------- |
| `subscription_tier`  | string  | Yes      | `premium`, `premium_plus` | Subscription plan |
| `plan_duration_days` | integer | Yes      | 30, 180, 365              | Duration in days  |

**Example Request:**

```http
POST /api/v1/payments/subscribe HTTP/1.1
Authorization: Bearer <token>
Content-Type: application/json

{
  "subscription_tier": "premium",
  "plan_duration_days": 30
}
```

**Response:** 201 Created

```json
{
  "code": "CREATED",
  "message": "Payment initiated",
  "status": 201,
  "data": {
    "transaction_id": "txn_550e8400",
    "order_id": "order_550e8400",
    "payment_url": "https://app.midtrans.com/snap/v2/vt/8b2d3a4c",
    "status": "pending",
    "amount_idr": 149000,
    "expires_at": "2025-12-12T11:30:00Z"
  }
}
```

---

### **Job Status Endpoints**

#### `POST /api/v1/jobs/:job_id/check`

**Authentication:** Bearer JWT Required  
**Rate Limit:** Standard (1000/min)  
**Purpose:** Check async job status (feedback generation, etc)

**Path Parameters:**

| Parameter | Type   | Description |
| --------- | ------ | ----------- |
| `job_id`  | string | Job UUID    |

**Example Request:**

```http
POST /api/v1/jobs/job_550e8400e29b41d4/check
Authorization: Bearer <token>
```

**Response (Still Processing):** 202 Accepted

```json
{
  "code": "ACCEPTED",
  "message": "Feedback still generating",
  "status": 202,
  "data": {
    "job_id": "job_550e8400e29b41d4",
    "status": "processing",
    "attempt_id": "attempt_550e8400",
    "estimated_completion_seconds": 4
  }
}
```

**Response (Completed):** 200 OK

```json
{
  "code": "OK",
  "message": "Feedback ready",
  "status": 200,
  "data": {
    "job_id": "job_550e8400e29b41d4",
    "status": "completed",
    "attempt_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "feedback": {
      "id": "c56a4180-65aa-42ec-a945-5fd21dec0538",
      "feedback_text": "Bagus! Jawabanmu sudah tepat...",
      "model_used": "mistral",
      "generation_time_ms": 1456
    }
  }
}
```

---

### **Sessions Endpoints**

#### `GET /api/v1/sessions`

**Authentication:** Bearer JWT Required  
**Rate Limit:** Standard (1000/min)  
**Purpose:** Get user's study session history

**Query Parameters:**

| Parameter | Type    | Default | Description             |
| --------- | ------- | ------- | ----------------------- |
| `page`    | integer | 1       | Page number (1-indexed) |
| `limit`   | integer | 10      | Items per page (max 50) |

**Example Request:**

```http
GET /api/v1/sessions?page=1&limit=10
Authorization: Bearer <token>
```

**Response:** 200 OK

```json
{
  "code": "OK",
  "message": "Sessions retrieved",
  "status": 200,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "started_at": "2025-12-12T09:00:00Z",
      "ended_at": "2025-12-12T09:35:00Z",
      "duration_minutes": 35,
      "questions_attempted": 15,
      "questions_correct": 11,
      "accuracy_in_session": 0.73,
      "section": "PU"
    },
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "started_at": "2025-12-11T14:00:00Z",
      "ended_at": "2025-12-11T14:45:00Z",
      "duration_minutes": 45,
      "questions_attempted": 20,
      "questions_correct": 14,
      "accuracy_in_session": 0.7,
      "section": "PK"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "total_pages": 3,
    "has_next": true,
    "has_prev": false
  }
}
```

---

#### `POST /api/v1/sessions`

**Authentication:** Bearer JWT Required  
**Rate Limit:** Standard (1000/min)  
**Purpose:** Start a new study session

**Request Body:**

```json
{
  "section": "PU"
}
```

| Field     | Type   | Required | Description                    |
| --------- | ------ | -------- | ------------------------------ |
| `section` | string | No       | PU, PK, PBM, or null for mixed |

**Response:** 201 Created

```json
{
  "code": "CREATED",
  "message": "Session started",
  "status": 201,
  "data": {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "started_at": "2025-12-12T10:30:00Z",
    "section": "PU",
    "questions_attempted": 0,
    "questions_correct": 0
  }
}
```

---

#### `PUT /api/v1/sessions/:session_id/end`

**Authentication:** Bearer JWT Required  
**Rate Limit:** Standard (1000/min)  
**Purpose:** End a study session

**Path Parameters:**

| Parameter    | Type   | Description  |
| ------------ | ------ | ------------ |
| `session_id` | string | Session UUID |

**Response:** 200 OK

```json
{
  "code": "OK",
  "message": "Session ended",
  "status": 200,
  "data": {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "started_at": "2025-12-12T10:30:00Z",
    "ended_at": "2025-12-12T11:05:00Z",
    "duration_minutes": 35,
    "questions_attempted": 15,
    "questions_correct": 11,
    "accuracy_in_session": 0.73,
    "section": "PU"
  }
}
```

---

## 📄 PAGINATION

### **Pagination Parameters**

All list endpoints support pagination with these query parameters:

| Parameter | Type    | Default | Max | Description             |
| --------- | ------- | ------- | --- | ----------------------- |
| `page`    | integer | 1       | -   | Page number (1-indexed) |
| `limit`   | integer | 10      | 100 | Items per page          |

### **Pagination Response**

```json
"pagination": {
  "total": 500,              // Total items in collection
  "page": 1,                 // Current page
  "limit": 10,               // Items per page
  "total_pages": 50,         // Total number of pages
  "has_next": true,          // Is there next page?
  "has_prev": false          // Is there previous page?
}
```

### **Pagination Examples**

**Get page 1 with 10 items:**

```http
GET /api/v1/questions?section=PU&page=1&limit=10
```

**Get page 5 with 25 items:**

```http
GET /api/v1/questions?section=PU&page=5&limit=25
```

**Calculate offset for SQL:**

```
offset = (page - 1) * limit
Example: page=3, limit=10 → offset = 20
```

---

## ⏱️ RATE LIMITING

### **Rate Limit Rules**

| Category      | Limit        | Window     | Applies To                     |
| ------------- | ------------ | ---------- | ------------------------------ |
| **Standard**  | 1000 req/min | 60 seconds | Most endpoints                 |
| **Premium**   | 100 req/min  | 60 seconds | Payment endpoints              |
| **Unlimited** | Unlimited    | -          | Health check, public endpoints |

### **Rate Limit Headers**

Every response includes rate limit information:

```http
X-RateLimit-Limit: 1000          # Maximum requests allowed
X-RateLimit-Remaining: 950       # Requests remaining
X-RateLimit-Reset: 1702390260    # Unix timestamp when limit resets
```

### **Exceeding Rate Limit**

When rate limit exceeded, receive 429 response:

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1702390260
```

```json
{
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many requests, please try again later",
  "status": 429,
  "action": {
    "type": "retry",
    "message": "Please try again in 60 seconds",
    "value": "60"
  }
}
```

### **Best Practices**

✅ **DO:**

- Check `X-RateLimit-Remaining` header before making requests
- Implement exponential backoff retry logic
- Cache responses when possible
- Batch requests where applicable

❌ **DON'T:**

- Retry immediately after hitting rate limit
- Use hardcoded delays (use `Retry-After` header instead)
- Make rapid consecutive requests
- Poll endpoints continuously

---

## 🪝 WEBHOOKS

### **Midtrans Payment Webhook**

**Endpoint:** `POST /webhooks/midtrans`

**Authentication:** Signature verification (not Bearer token)  
**Rate Limit:** Unlimited  
**Timeout:** 60 seconds

**Purpose:** Receive payment status updates from Midtrans

### **Webhook Events**

| Event             | When            | Action                |
| ----------------- | --------------- | --------------------- |
| `payment.success` | Payment settled | Activate subscription |
| `payment.failed`  | Payment failed  | Send failure email    |
| `payment.expired` | Payment expired | Mark as expired       |
| `payment.pending` | Payment pending | No action             |

### **Webhook Payload**

```json
{
  "order_id": "order_550e8400",
  "transaction_id": "txn_550e8400",
  "transaction_status": "settlement",
  "transaction_time": "2025-12-12 10:30:00",
  "gross_amount": "149000.00",
  "payment_type": "credit_card",
  "signature_key": "abc123def456..."
}
```

### **Webhook Security**

**Verify signature using:**

```
SHA512(order_id + transaction_status + gross_amount + SERVER_KEY)
```

**Check that:**

1. Signature matches expected value
2. `transaction_status` is valid
3. Amount matches expected price
4. Order exists in database

### **Webhook Response**

**Always respond with 200 OK:**

```json
{
  "status": "received",
  "timestamp": "2025-12-12T10:30:00Z"
}
```

### **Webhook Retry Policy**

Midtrans will retry webhook delivery:

- Max 5 attempts
- 60-second timeout per attempt
- Exponential backoff between retries

---

## 📊 STATUS CODES REFERENCE

### **Success Codes (2xx)**

| Code | Name       | When Used                             |
| ---- | ---------- | ------------------------------------- |
| 200  | OK         | Successful GET or query               |
| 201  | Created    | Successful POST that creates resource |
| 202  | Accepted   | Async operation queued                |
| 204  | No Content | Successful DELETE or empty response   |

### **Client Error Codes (4xx)**

| Code | Name              | Meaning                            |
| ---- | ----------------- | ---------------------------------- |
| 400  | Bad Request       | Invalid input, malformed request   |
| 401  | Unauthorized      | Missing or invalid authentication  |
| 403  | Forbidden         | Authenticated but no permission    |
| 404  | Not Found         | Resource doesn't exist             |
| 409  | Conflict          | Duplicate resource, state conflict |
| 429  | Too Many Requests | Rate limit exceeded                |

### **Server Error Codes (5xx)**

| Code | Name                  | Meaning                              |
| ---- | --------------------- | ------------------------------------ |
| 500  | Internal Server Error | Unexpected server error              |
| 503  | Service Unavailable   | Database/Redis/external service down |

---

## 📋 QUICK REFERENCE

### **Common Requests**

**Get authenticated user:**

```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

**Get next question:**

```http
GET /api/v1/questions/next?section=PU
Authorization: Bearer <token>
```

**Submit answer:**

```http
POST /api/v1/attempts
Authorization: Bearer <token>

{
  "question_id": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "selected_answer": "C",
  "time_spent_seconds": 45,
  "session_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

**Check readiness:**

```http
GET /api/v1/readiness
Authorization: Bearer <token>
```

**Check health:**

```http
GET /api/v1/health
```

---

## 📊 MONITORING (NEW RELIC)

### **APM Integration**

The backend uses New Relic for Application Performance Monitoring:

- **Transaction Tracing:** All API endpoints are automatically traced
- **Error Tracking:** Errors are captured with stack traces
- **Database Monitoring:** PostgreSQL query performance tracked
- **External Services:** LLM API calls monitored for latency

### **Key Metrics Monitored**

| Metric                  | Target   | Alert Threshold |
| ----------------------- | -------- | --------------- |
| API Response Time (P95) | < 500ms  | > 1000ms        |
| Error Rate              | < 0.1%   | > 1%            |
| Throughput              | Variable | -               |
| Database Query Time     | < 100ms  | > 500ms         |
| LLM API Latency         | < 2000ms | > 5000ms        |

### **Custom Events**

```go
// Track feedback generation
newrelic.RecordCustomEvent("FeedbackGenerated", map[string]interface{}{
    "model":           "mistral",
    "generation_ms":   1245,
    "is_correct":      true,
    "section":         "PU",
})

// Track IRT theta updates
newrelic.RecordCustomEvent("ThetaUpdated", map[string]interface{}{
    "theta_before":    0.25,
    "theta_after":     0.35,
    "theta_change":    0.10,
})
```

---

## 🔗 RELATED RESOURCES

- **Database Documentation:** See database schema for data models
- **Product Requirements:** See PRD for feature details
- **Deployment:** See deployment guide for infrastructure setup
- **Monitoring Dashboard:** New Relic APM

---

**Version:** 1.0 | Last Updated: December 2025  
**Status:** Production Ready ✅
