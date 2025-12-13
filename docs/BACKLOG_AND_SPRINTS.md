# 📋 GENTA - BACKLOG & SPRINT PLANNING

**Development Roadmap untuk AI-Powered UTBK Prep Platform**  
**Version 1.0 | December 2025**

---

## 📊 OVERVIEW

### Development Strategy

- **Approach**: Backend-first, kemudian Frontend
- **Sprint Duration**: 1 minggu per sprint
- **Total MVP Timeline**: 7 minggu (sesuai PRD)
- **Tech Stack**:
  - Backend: Go + Echo + PostgreSQL + Redis + Asynq
  - Frontend: TanStack Start + React 19 + TypeScript

### Priority Legend

- 🔴 **P0** - Critical (Must have for MVP)
- 🟠 **P1** - High (Important for launch)
- 🟡 **P2** - Medium (Nice to have)
- 🟢 **P3** - Low (Post-MVP)

### Story Point Estimation

- **1 SP** = ~2-4 jam
- **2 SP** = ~4-8 jam (1 hari)
- **3 SP** = ~1-2 hari
- **5 SP** = ~2-3 hari
- **8 SP** = ~3-5 hari

---

## 🗂️ EPIC BREAKDOWN

### Epic 1: Infrastructure & Setup

### Epic 2: Authentication & User Management

### Epic 3: Question Bank & Management

### Epic 4: Practice Session & IRT Algorithm

### Epic 5: AI Feedback System

### Epic 6: Readiness & Analytics

### Epic 7: Payment Integration

### Epic 8: Frontend Core

### Epic 9: Frontend Features

### Epic 10: Testing & Polish

---

## 📝 COMPLETE BACKLOG

### EPIC 1: Infrastructure & Setup 🏗️

| ID     | Story                                   | Priority | SP  | Sprint | Status |
| ------ | --------------------------------------- | -------- | --- | ------ | ------ |
| BE-001 | Setup Go project dengan Echo framework  | 🔴 P0    | 2   | 1      | ✅     |
| BE-002 | Setup PostgreSQL dengan pgx driver      | 🔴 P0    | 2   | 1      | ✅     |
| BE-003 | Setup Redis untuk caching & session     | 🔴 P0    | 2   | 1      | ✅     |
| BE-004 | Setup Asynq untuk job queue             | 🔴 P0    | 2   | 1      | ✅     |
| BE-005 | Setup sqlc untuk type-safe SQL          | 🔴 P0    | 2   | 1      | -      |
| BE-006 | Setup database migrations (tern/goose)  | 🔴 P0    | 2   | 1      | ✅     |
| BE-007 | Setup environment config & validation   | 🔴 P0    | 1   | 1      | ✅     |
| BE-008 | Setup logging & error handling          | 🔴 P0    | 2   | 1      | ✅     |
| BE-009 | Setup CI/CD pipeline (GitHub Actions)   | 🟠 P1    | 3   | 1      | ⬜     |
| BE-010 | Setup New Relic monitoring              | 🟠 P1    | 2   | 1      | ✅     |
| BE-011 | Setup Docker & docker-compose           | 🟠 P1    | 2   | 1      | ✅     |
| BE-012 | Create base response & error structures | 🔴 P0    | 2   | 1      | ✅     |

---

### EPIC 2: Authentication & User Management 🔐

| ID     | Story                                                 | Priority | SP  | Sprint | Status |
| ------ | ----------------------------------------------------- | -------- | --- | ------ | ------ |
| BE-013 | Integrate Clerk JWT validation middleware             | 🔴 P0    | 3   | 2      | ✅     |
| BE-014 | Create users table migration                          | 🔴 P0    | 2   | 2      | ✅     |
| BE-015 | Implement user repository (CRUD)                      | 🔴 P0    | 3   | 2      | ⬜     |
| BE-016 | Implement user service layer                          | 🔴 P0    | 2   | 2      | ⬜     |
| BE-017 | `GET /api/v1/auth/me` - Get current user              | 🔴 P0    | 2   | 2      | ✅     |
| BE-018 | `PUT /api/v1/users/me` - Update user profile          | 🔴 P0    | 2   | 2      | ✅     |
| BE-019 | `POST /api/v1/users/onboarding` - Complete onboarding | 🔴 P0    | 3   | 2      | ⬜     |
| BE-020 | Clerk webhook handler (user.created, user.updated)    | 🟠 P1    | 3   | 2      | ⬜     |
| BE-021 | User session management dengan Redis                  | 🟠 P1    | 2   | 2      | -      |
| BE-022 | Rate limiting middleware                              | 🟠 P1    | 2   | 2      | ✅     |

---

### EPIC 3: Question Bank & Management 📚

| ID     | Story                                                     | Priority | SP  | Sprint | Status |
| ------ | --------------------------------------------------------- | -------- | --- | ------ | ------ |
| BE-023 | Create question_banks table migration                     | 🔴 P0    | 2   | 2      | ⬜     |
| BE-024 | Create questions table migration                          | 🔴 P0    | 2   | 2      | ⬜     |
| BE-025 | Implement question repository                             | 🔴 P0    | 3   | 2      | ⬜     |
| BE-026 | Implement question service layer                          | 🔴 P0    | 2   | 2      | ⬜     |
| BE-027 | `GET /api/v1/questions` - List questions with filters     | 🔴 P0    | 3   | 2      | ⬜     |
| BE-028 | `GET /api/v1/questions/:id` - Get question detail         | 🔴 P0    | 2   | 2      | ⬜     |
| BE-029 | `GET /api/v1/questions/next` - Get next adaptive question | 🔴 P0    | 5   | 3      | ⬜     |
| BE-030 | Question seeding script (initial 100+ questions)          | 🔴 P0    | 3   | 3      | ⬜     |
| BE-031 | Question import from JSON/CSV                             | 🟠 P1    | 3   | 3      | ⬜     |

---

### EPIC 4: Practice Session & IRT Algorithm 🎯

| ID     | Story                                                      | Priority | SP  | Sprint | Status |
| ------ | ---------------------------------------------------------- | -------- | --- | ------ | ------ |
| BE-032 | Create attempts table migration                            | 🔴 P0    | 2   | 3      | ⬜     |
| BE-033 | Create user_study_sessions table migration                 | 🔴 P0    | 2   | 3      | ⬜     |
| BE-034 | Implement IRT algorithm (theta calculation)                | 🔴 P0    | 5   | 3      | ⬜     |
| BE-035 | Implement attempt repository                               | 🔴 P0    | 3   | 3      | ⬜     |
| BE-036 | Implement attempt service layer                            | 🔴 P0    | 3   | 3      | ⬜     |
| BE-037 | `POST /api/v1/attempts` - Record answer attempt            | 🔴 P0    | 3   | 3      | ⬜     |
| BE-038 | `GET /api/v1/attempts/:id` - Get attempt with feedback     | 🔴 P0    | 2   | 3      | ⬜     |
| BE-039 | `PUT /api/v1/attempts/:id/feedback-rating` - Rate feedback | 🔴 P0    | 2   | 3      | ⬜     |
| BE-040 | Implement session repository                               | 🔴 P0    | 2   | 3      | ⬜     |
| BE-041 | `POST /api/v1/sessions` - Start study session              | 🔴 P0    | 2   | 3      | ⬜     |
| BE-042 | `PUT /api/v1/sessions/:id/end` - End study session         | 🔴 P0    | 2   | 3      | ⬜     |
| BE-043 | `GET /api/v1/sessions` - List user sessions                | 🔴 P0    | 2   | 3      | ⬜     |
| BE-044 | Update user theta after attempt                            | 🔴 P0    | 3   | 3      | ⬜     |
| BE-045 | Question selection based on user theta                     | 🔴 P0    | 3   | 3      | ⬜     |

---

### EPIC 5: AI Feedback System 🤖

| ID     | Story                                                | Priority | SP  | Sprint | Status |
| ------ | ---------------------------------------------------- | -------- | --- | ------ | ------ |
| BE-046 | Create attempt_feedback table migration              | 🔴 P0    | 2   | 4      | ⬜     |
| BE-047 | Setup LLM client (Mistral/OpenRouter)                | 🔴 P0    | 3   | 4      | ⬜     |
| BE-048 | Design feedback prompt templates                     | 🔴 P0    | 3   | 4      | ⬜     |
| BE-049 | Implement feedback generation service                | 🔴 P0    | 5   | 4      | ⬜     |
| BE-050 | Implement Asynq task for async feedback              | 🔴 P0    | 3   | 4      | ⬜     |
| BE-051 | Feedback caching in Redis                            | 🔴 P0    | 2   | 4      | ⬜     |
| BE-052 | `POST /api/v1/jobs/:job_id/check` - Check job status | 🔴 P0    | 2   | 4      | ⬜     |
| BE-053 | Implement hybrid model selection (Mistral/Claude)    | 🟠 P1    | 3   | 4      | ⬜     |
| BE-054 | Feedback quality logging & metrics                   | 🟠 P1    | 2   | 4      | ⬜     |
| BE-055 | Fallback mechanism jika LLM gagal                    | 🟠 P1    | 2   | 4      | ⬜     |

---

### EPIC 6: Readiness & Analytics 📊

| ID     | Story                                                  | Priority | SP  | Sprint | Status |
| ------ | ------------------------------------------------------ | -------- | --- | ------ | ------ |
| BE-056 | Create user_readiness table migration                  | 🔴 P0    | 2   | 4      | ⬜     |
| BE-057 | Implement readiness calculation service                | 🔴 P0    | 3   | 4      | ⬜     |
| BE-058 | `GET /api/v1/readiness` - Get user readiness dashboard | 🔴 P0    | 3   | 4      | ⬜     |
| BE-059 | Implement predicted score calculation                  | 🔴 P0    | 2   | 4      | ⬜     |
| BE-060 | Implement ready_by_date calculation                    | 🔴 P0    | 2   | 4      | ⬜     |
| BE-061 | `GET /api/v1/analytics/progress` - Progress analytics  | 🔴 P0    | 3   | 5      | ⬜     |
| BE-062 | Asynq batch job untuk update readiness                 | 🟠 P1    | 3   | 5      | ⬜     |
| BE-063 | Section-wise accuracy breakdown                        | 🟠 P1    | 2   | 5      | ⬜     |

---

### EPIC 7: Payment Integration 💳

| ID     | Story                                                   | Priority | SP  | Sprint | Status |
| ------ | ------------------------------------------------------- | -------- | --- | ------ | ------ |
| BE-064 | Create payment_subscriptions table migration            | 🟠 P1    | 2   | 5      | ⬜     |
| BE-065 | Setup Midtrans SDK integration                          | 🟠 P1    | 3   | 5      | ⬜     |
| BE-066 | `POST /api/v1/payments/subscribe` - Create subscription | 🟠 P1    | 3   | 5      | ⬜     |
| BE-067 | `POST /webhooks/midtrans` - Handle payment webhook      | 🟠 P1    | 3   | 5      | ⬜     |
| BE-068 | Subscription status check middleware                    | 🟠 P1    | 2   | 5      | ⬜     |
| BE-069 | Free tier rate limiting (10 questions/day)              | 🟠 P1    | 2   | 5      | ⬜     |

---

### EPIC 8: Frontend Core 🎨

| ID     | Story                                    | Priority | SP  | Sprint | Status |
| ------ | ---------------------------------------- | -------- | --- | ------ | ------ |
| FE-001 | Setup TanStack Start project             | 🔴 P0    | 2   | 5      | ⬜     |
| FE-002 | Setup TailwindCSS + shadcn/ui            | 🔴 P0    | 2   | 5      | ⬜     |
| FE-003 | Setup TanStack Query untuk data fetching | 🔴 P0    | 2   | 5      | ⬜     |
| FE-004 | Setup Clerk frontend integration         | 🔴 P0    | 3   | 5      | ⬜     |
| FE-005 | Setup API client dengan ts-rest          | 🔴 P0    | 2   | 5      | ⬜     |
| FE-006 | Setup Zod schemas (shared validation)    | 🔴 P0    | 2   | 5      | ⬜     |
| FE-007 | Setup OpenAPI contract definitions       | 🔴 P0    | 3   | 5      | ⬜     |
| FE-008 | Create base layout components            | 🔴 P0    | 3   | 5      | ⬜     |
| FE-009 | Create responsive navigation             | 🔴 P0    | 2   | 5      | ⬜     |
| FE-010 | Setup error boundary & loading states    | 🔴 P0    | 2   | 5      | ⬜     |

---

### EPIC 9: Frontend Features 📱

| ID     | Story                                       | Priority | SP  | Sprint | Status |
| ------ | ------------------------------------------- | -------- | --- | ------ | ------ |
| FE-011 | Login/Signup page (Clerk UI)                | 🔴 P0    | 2   | 6      | ⬜     |
| FE-012 | Onboarding Step 1 - Target PTN & Score      | 🔴 P0    | 3   | 6      | ⬜     |
| FE-013 | Onboarding Step 2 - Exam Date & Study Hours | 🔴 P0    | 3   | 6      | ⬜     |
| FE-014 | Dashboard - Readiness overview              | 🔴 P0    | 5   | 6      | ⬜     |
| FE-015 | Dashboard - Section cards (7 subtests)      | 🔴 P0    | 3   | 6      | ⬜     |
| FE-016 | Dashboard - Session stats                   | 🔴 P0    | 2   | 6      | ⬜     |
| FE-017 | Practice - Question display                 | 🔴 P0    | 3   | 6      | ⬜     |
| FE-018 | Practice - Answer selection & submission    | 🔴 P0    | 3   | 6      | ⬜     |
| FE-019 | Practice - Timer component                  | 🔴 P0    | 2   | 6      | ⬜     |
| FE-020 | Practice - Feedback display                 | 🔴 P0    | 3   | 6      | ⬜     |
| FE-021 | Practice - Feedback rating (👍/👎)          | 🔴 P0    | 2   | 6      | ⬜     |
| FE-022 | Practice - Session summary                  | 🔴 P0    | 3   | 6      | ⬜     |
| FE-023 | Analytics - Progress charts                 | 🟠 P1    | 3   | 7      | ⬜     |
| FE-024 | Analytics - Section breakdown               | 🟠 P1    | 2   | 7      | ⬜     |
| FE-025 | Settings - Profile management               | 🟠 P1    | 2   | 7      | ⬜     |
| FE-026 | Settings - Subscription management          | 🟠 P1    | 2   | 7      | ⬜     |
| FE-027 | Payment - Subscription page                 | 🟠 P1    | 3   | 7      | ⬜     |
| FE-028 | Payment - Midtrans checkout integration     | 🟠 P1    | 3   | 7      | ⬜     |
| FE-029 | Payment - Success/failure pages             | 🟠 P1    | 2   | 7      | ⬜     |

---

### EPIC 10: Testing & Polish 🧪

| ID     | Story                                 | Priority | SP  | Sprint | Status |
| ------ | ------------------------------------- | -------- | --- | ------ | ------ |
| QA-001 | Unit tests untuk IRT algorithm        | 🔴 P0    | 3   | 7      | ⬜     |
| QA-002 | Unit tests untuk feedback service     | 🔴 P0    | 2   | 7      | ⬜     |
| QA-003 | Integration tests untuk API endpoints | 🟠 P1    | 5   | 7      | ⬜     |
| QA-004 | E2E tests untuk critical flows        | 🟠 P1    | 5   | 7      | ⬜     |
| QA-005 | Performance testing & optimization    | 🟠 P1    | 3   | 7      | ⬜     |
| QA-006 | Security audit (OWASP checklist)      | 🟠 P1    | 3   | 7      | ⬜     |
| QA-007 | Accessibility audit (WCAG 2.1)        | 🟠 P1    | 2   | 7      | ⬜     |
| QA-008 | Mobile responsiveness testing         | 🔴 P0    | 2   | 7      | ⬜     |
| QA-009 | Bug fixes & polish                    | 🔴 P0    | 5   | 7      | ⬜     |
| QA-010 | Documentation update                  | 🟠 P1    | 2   | 7      | ⬜     |

---

## 🏃 SPRINT BREAKDOWN

---

### SPRINT 1: Backend Foundation (Week 1)

**Goal**: Setup infrastructure & project scaffolding  
**Total SP**: ~22 SP

#### Tasks:

| ID     | Task                         | SP  | Acceptance Criteria                                      |
| ------ | ---------------------------- | --- | -------------------------------------------------------- |
| BE-001 | Setup Go project dengan Echo | 2   | Project structure sesuai best practice, hot reload works |
| BE-002 | Setup PostgreSQL dengan pgx  | 2   | Connection pool configured, health check endpoint works  |
| BE-003 | Setup Redis                  | 2   | Redis connected, basic get/set works                     |
| BE-004 | Setup Asynq                  | 2   | Worker running, sample task processed                    |
| BE-005 | Setup sqlc                   | 2   | Queries generated, type-safe                             |
| BE-006 | Setup migrations             | 2   | Migration up/down works                                  |
| BE-007 | Environment config           | 1   | .env loaded, validation works                            |
| BE-008 | Logging & error handling     | 2   | Structured logging, custom errors                        |
| BE-009 | CI/CD pipeline               | 3   | GitHub Actions runs tests & builds                       |
| BE-010 | New Relic monitoring         | 2   | APM connected, traces visible                            |
| BE-011 | Docker setup                 | 2   | docker-compose up works                                  |
| BE-012 | Base response structures     | 2   | Standard response format implemented                     |

#### Deliverables:

- ✅ Running Go backend dengan Echo
- ✅ PostgreSQL + Redis connected
- ✅ Asynq worker running
- ✅ CI/CD pipeline active
- ✅ Docker development environment
- ✅ Health check endpoint: `GET /api/v1/health`

#### Definition of Done:

```bash
# All these should work:
docker-compose up -d
curl http://localhost:8080/api/v1/health
# Returns: {"status": "healthy", ...}
```

---

### SPRINT 2: Auth & Question Bank (Week 2-3)

**Goal**: User authentication & question management  
**Total SP**: ~38 SP

#### Tasks:

| ID     | Task                     | SP  | Acceptance Criteria            |
| ------ | ------------------------ | --- | ------------------------------ |
| BE-013 | Clerk JWT middleware     | 3   | JWT validated, user extracted  |
| BE-014 | Users table migration    | 2   | Table created with all columns |
| BE-015 | User repository          | 3   | CRUD operations work           |
| BE-016 | User service             | 2   | Business logic implemented     |
| BE-017 | GET /auth/me             | 2   | Returns current user           |
| BE-018 | PUT /users/me            | 2   | Updates user profile           |
| BE-019 | POST /users/onboarding   | 3   | Saves onboarding data          |
| BE-020 | Clerk webhooks           | 3   | User sync works                |
| BE-021 | Session management       | 2   | Redis sessions work            |
| BE-022 | Rate limiting            | 2   | 1000 req/min enforced          |
| BE-023 | Question banks migration | 2   | Table created                  |
| BE-024 | Questions migration      | 2   | Table created with IRT fields  |
| BE-025 | Question repository      | 3   | CRUD + filters work            |
| BE-026 | Question service         | 2   | Business logic implemented     |
| BE-027 | GET /questions           | 3   | List with pagination & filters |
| BE-028 | GET /questions/:id       | 2   | Returns question detail        |

#### Deliverables:

- ✅ Clerk authentication working
- ✅ User CRUD endpoints
- ✅ Onboarding flow backend
- ✅ Question listing with filters
- ✅ Rate limiting active

#### API Endpoints Ready:

```
GET  /api/v1/health
GET  /api/v1/auth/me
PUT  /api/v1/users/me
POST /api/v1/users/onboarding
GET  /api/v1/questions
GET  /api/v1/questions/:id
```

---

### SPRINT 3: Practice & IRT (Week 3-4)

**Goal**: Core practice flow dengan IRT algorithm  
**Total SP**: ~42 SP

#### Tasks:

| ID     | Task                              | SP  | Acceptance Criteria             |
| ------ | --------------------------------- | --- | ------------------------------- |
| BE-029 | GET /questions/next (adaptive)    | 5   | Returns question based on theta |
| BE-030 | Question seeding                  | 3   | 100+ questions seeded           |
| BE-031 | Question import                   | 3   | JSON/CSV import works           |
| BE-032 | Attempts migration                | 2   | Table created                   |
| BE-033 | Sessions migration                | 2   | Table created                   |
| BE-034 | IRT algorithm                     | 5   | Theta calculation accurate      |
| BE-035 | Attempt repository                | 3   | CRUD works                      |
| BE-036 | Attempt service                   | 3   | Business logic + IRT            |
| BE-037 | POST /attempts                    | 3   | Records attempt, updates theta  |
| BE-038 | GET /attempts/:id                 | 2   | Returns attempt with feedback   |
| BE-039 | PUT /attempts/:id/feedback-rating | 2   | Saves rating                    |
| BE-040 | Session repository                | 2   | CRUD works                      |
| BE-041 | POST /sessions                    | 2   | Starts session                  |
| BE-042 | PUT /sessions/:id/end             | 2   | Ends session with stats         |
| BE-043 | GET /sessions                     | 2   | Lists user sessions             |
| BE-044 | Update user theta                 | 3   | Theta updated after attempt     |
| BE-045 | Question selection logic          | 3   | Selects based on theta ± 0.5    |

#### Deliverables:

- ✅ IRT algorithm implemented
- ✅ Adaptive question selection
- ✅ Attempt recording with theta update
- ✅ Session management
- ✅ 100+ seeded questions

#### API Endpoints Ready:

```
GET  /api/v1/questions/next?section=PU
POST /api/v1/attempts
GET  /api/v1/attempts/:id
PUT  /api/v1/attempts/:id/feedback-rating
POST /api/v1/sessions
PUT  /api/v1/sessions/:id/end
GET  /api/v1/sessions
```

#### IRT Formula Reference:

```go
// Probability of correct answer (3PL model)
P(θ) = c + (1-c) / (1 + exp(-a(θ-b)))

// Where:
// θ = user ability (theta)
// a = discrimination parameter
// b = difficulty parameter
// c = guessing parameter

// Theta update after attempt:
θ_new = θ_old + (is_correct - P(θ)) * learning_rate
```

---

### SPRINT 4: AI Feedback & Readiness (Week 4-5)

**Goal**: LLM feedback generation & readiness dashboard  
**Total SP**: ~38 SP

#### Tasks:

| ID     | Task                   | SP  | Acceptance Criteria              |
| ------ | ---------------------- | --- | -------------------------------- |
| BE-046 | Feedback migration     | 2   | Table created                    |
| BE-047 | LLM client setup       | 3   | Mistral/OpenRouter connected     |
| BE-048 | Prompt templates       | 3   | Quality prompts designed         |
| BE-049 | Feedback service       | 5   | Generates quality feedback       |
| BE-050 | Asynq feedback task    | 3   | Async generation works           |
| BE-051 | Feedback caching       | 2   | Redis cache works                |
| BE-052 | POST /jobs/:id/check   | 2   | Returns job status               |
| BE-053 | Hybrid model selection | 3   | Mistral/Claude routing           |
| BE-054 | Feedback metrics       | 2   | Logging implemented              |
| BE-055 | LLM fallback           | 2   | Fallback to standard explanation |
| BE-056 | Readiness migration    | 2   | Table created                    |
| BE-057 | Readiness service      | 3   | Calculation implemented          |
| BE-058 | GET /readiness         | 3   | Returns dashboard data           |
| BE-059 | Predicted score calc   | 2   | Score prediction works           |
| BE-060 | Ready by date calc     | 2   | Date prediction works            |

#### Deliverables:

- ✅ AI feedback generation working
- ✅ Async job processing
- ✅ Feedback caching
- ✅ Readiness dashboard API
- ✅ Score predictions

#### API Endpoints Ready:

```
POST /api/v1/jobs/:job_id/check
GET  /api/v1/readiness
GET  /api/v1/readiness?section=PU
```

#### Prompt Template Example:

```
You are a friendly UTBK tutor helping Indonesian students.

Question: {question_text}
Student's answer: {selected_answer}
Correct answer: {correct_answer}
Is correct: {is_correct}

Generate personalized feedback in Indonesian:
1. If wrong: Explain why their answer is incorrect
2. Explain why the correct answer is right
3. Give a strategy tip for this question type
4. Keep it encouraging and under 150 words
```

---

### SPRINT 5: Payment & Frontend Setup (Week 5-6)

**Goal**: Payment integration & frontend foundation  
**Total SP**: ~40 SP

#### Backend Tasks:

| ID     | Task                     | SP  | Acceptance Criteria   |
| ------ | ------------------------ | --- | --------------------- |
| BE-061 | GET /analytics/progress  | 3   | Returns progress data |
| BE-062 | Readiness batch job      | 3   | Updates all users     |
| BE-063 | Section accuracy         | 2   | Breakdown works       |
| BE-064 | Payments migration       | 2   | Table created         |
| BE-065 | Midtrans SDK             | 3   | SDK integrated        |
| BE-066 | POST /payments/subscribe | 3   | Creates payment       |
| BE-067 | Midtrans webhook         | 3   | Handles callbacks     |
| BE-068 | Subscription middleware  | 2   | Checks tier           |
| BE-069 | Free tier limiting       | 2   | 10 questions/day      |

#### Frontend Tasks:

| ID     | Task                 | SP  | Acceptance Criteria     |
| ------ | -------------------- | --- | ----------------------- |
| FE-001 | TanStack Start setup | 2   | Project running         |
| FE-002 | TailwindCSS + shadcn | 2   | Styling works           |
| FE-003 | TanStack Query       | 2   | Data fetching works     |
| FE-004 | Clerk frontend       | 3   | Auth UI works           |
| FE-005 | API client           | 2   | ts-rest configured      |
| FE-006 | Zod schemas          | 2   | Validation works        |
| FE-007 | OpenAPI contracts    | 3   | Types generated         |
| FE-008 | Base layouts         | 3   | Layout components ready |
| FE-009 | Navigation           | 2   | Responsive nav works    |
| FE-010 | Error/loading states | 2   | UX states handled       |

#### Deliverables:

- ✅ Payment flow working
- ✅ Subscription management
- ✅ Frontend project setup
- ✅ Clerk auth integrated
- ✅ API client ready

#### API Endpoints Ready:

```
GET  /api/v1/analytics/progress
POST /api/v1/payments/subscribe
POST /webhooks/midtrans
```

---

### SPRINT 6: Frontend Features (Week 6)

**Goal**: Core frontend pages  
**Total SP**: ~34 SP

#### Tasks:

| ID     | Task                | SP  | Acceptance Criteria |
| ------ | ------------------- | --- | ------------------- |
| FE-011 | Login/Signup        | 2   | Clerk UI integrated |
| FE-012 | Onboarding Step 1   | 3   | Target PTN & score  |
| FE-013 | Onboarding Step 2   | 3   | Exam date & hours   |
| FE-014 | Dashboard readiness | 5   | Overview displayed  |
| FE-015 | Section cards       | 3   | 7 subtests shown    |
| FE-016 | Session stats       | 2   | Today/week stats    |
| FE-017 | Question display    | 3   | Question rendered   |
| FE-018 | Answer submission   | 3   | Submit works        |
| FE-019 | Timer component     | 2   | Timer works         |
| FE-020 | Feedback display    | 3   | AI feedback shown   |
| FE-021 | Feedback rating     | 2   | 👍/👎 works         |
| FE-022 | Session summary     | 3   | Summary displayed   |

#### Deliverables:

- ✅ Complete auth flow
- ✅ Onboarding flow
- ✅ Dashboard page
- ✅ Practice session flow
- ✅ Feedback display

#### Pages Ready:

```
/login
/signup
/onboarding
/dashboard
/practice
/practice/[session_id]
```

---

### SPRINT 7: Polish & Launch (Week 7)

**Goal**: Testing, polish, dan launch preparation  
**Total SP**: ~42 SP

#### Frontend Tasks:

| ID     | Task                  | SP  | Acceptance Criteria |
| ------ | --------------------- | --- | ------------------- |
| FE-023 | Analytics charts      | 3   | Charts rendered     |
| FE-024 | Section breakdown     | 2   | Breakdown displayed |
| FE-025 | Profile settings      | 2   | Profile editable    |
| FE-026 | Subscription settings | 2   | Tier displayed      |
| FE-027 | Payment page          | 3   | Plans displayed     |
| FE-028 | Midtrans checkout     | 3   | Checkout works      |
| FE-029 | Payment result pages  | 2   | Success/fail shown  |

#### QA Tasks:

| ID     | Task                  | SP  | Acceptance Criteria  |
| ------ | --------------------- | --- | -------------------- |
| QA-001 | IRT unit tests        | 3   | 90%+ coverage        |
| QA-002 | Feedback unit tests   | 2   | 80%+ coverage        |
| QA-003 | API integration tests | 5   | All endpoints tested |
| QA-004 | E2E tests             | 5   | Critical flows pass  |
| QA-005 | Performance testing   | 3   | <100ms P95           |
| QA-006 | Security audit        | 3   | OWASP checklist pass |
| QA-007 | Accessibility audit   | 2   | WCAG 2.1 AA          |
| QA-008 | Mobile testing        | 2   | Responsive works     |
| QA-009 | Bug fixes             | 5   | Critical bugs fixed  |
| QA-010 | Documentation         | 2   | Docs updated         |

#### Deliverables:

- ✅ All pages complete
- ✅ Payment flow working
- ✅ Tests passing
- ✅ Performance optimized
- ✅ Ready for production

#### Launch Checklist:

- [ ] All P0 features complete
- [ ] 500+ questions seeded
- [ ] CI/CD to production
- [ ] Monitoring active
- [ ] Error tracking configured
- [ ] Backup strategy in place
- [ ] SSL certificates
- [ ] Domain configured

---

## 📁 PROJECT STRUCTURE REFERENCE

### Backend Structure (Go + Echo)

```
apps/backend/
├── cmd/
│   └── server/
│       └── main.go              # Entry point
├── internal/
│   ├── config/
│   │   └── config.go            # Environment config
│   ├── database/
│   │   ├── migrations/          # SQL migrations
│   │   │   ├── 001_create_users.sql
│   │   │   ├── 002_create_questions.sql
│   │   │   ├── 003_create_attempts.sql
│   │   │   └── ...
│   │   └── database.go          # DB connection
│   ├── model/
│   │   ├── user.go
│   │   ├── question.go
│   │   ├── attempt.go
│   │   ├── session.go
│   │   ├── readiness.go
│   │   └── payment.go
│   ├── repository/
│   │   ├── repositories.go      # DI container
│   │   ├── user.go
│   │   ├── question.go
│   │   ├── attempt.go
│   │   └── ...
│   ├── service/
│   │   ├── services.go          # DI container
│   │   ├── auth.go
│   │   ├── user.go
│   │   ├── question.go
│   │   ├── attempt.go
│   │   ├── irt.go               # IRT algorithm
│   │   ├── feedback.go          # LLM integration
│   │   ├── readiness.go
│   │   └── payment.go
│   ├── handler/
│   │   ├── handlers.go          # DI container
│   │   ├── health.go
│   │   ├── auth.go
│   │   ├── user.go
│   │   ├── question.go
│   │   ├── attempt.go
│   │   ├── session.go
│   │   ├── readiness.go
│   │   ├── analytics.go
│   │   └── payment.go
│   ├── router/
│   │   ├── router.go            # Main router
│   │   ├── auth.go
│   │   ├── user.go
│   │   ├── question.go
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.go              # Clerk JWT
│   │   ├── ratelimit.go
│   │   ├── subscription.go
│   │   └── logging.go
│   ├── lib/
│   │   ├── job/                 # Asynq jobs
│   │   │   ├── feedback.go
│   │   │   └── readiness.go
│   │   ├── llm/                 # LLM clients
│   │   │   ├── mistral.go
│   │   │   └── openrouter.go
│   │   └── clerk/               # Clerk SDK
│   │       └── clerk.go
│   ├── errs/
│   │   └── errors.go            # Custom errors
│   └── server/
│       └── server.go            # Server struct
├── db/
│   └── queries/                 # sqlc queries
│       ├── users.sql
│       ├── questions.sql
│       └── ...
├── sqlc.yaml
├── Taskfile.yaml                # Task runner
├── Dockerfile
├── .env.example
└── go.mod
```

### Frontend Structure (TanStack Start)

```
apps/frontend/
├── src/
│   ├── api/
│   │   ├── index.ts             # API client
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── question.ts
│   │   ├── attempt.ts
│   │   ├── session.ts
│   │   ├── readiness.ts
│   │   └── payment.ts
│   ├── components/
│   │   ├── ui/                  # shadcn components
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   ├── dashboard/
│   │   │   ├── ReadinessCard.tsx
│   │   │   ├── SectionCard.tsx
│   │   │   └── SessionStats.tsx
│   │   ├── practice/
│   │   │   ├── QuestionCard.tsx
│   │   │   ├── AnswerOptions.tsx
│   │   │   ├── Timer.tsx
│   │   │   ├── FeedbackCard.tsx
│   │   │   └── SessionSummary.tsx
│   │   └── common/
│   │       ├── Loading.tsx
│   │       └── ErrorBoundary.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useUser.ts
│   │   ├── useQuestions.ts
│   │   ├── useAttempts.ts
│   │   ├── useSessions.ts
│   │   └── useReadiness.ts
│   ├── routes/
│   │   ├── __root.tsx
│   │   ├── index.tsx            # Landing/redirect
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── onboarding/
│   │   │   ├── index.tsx
│   │   │   └── step-$step.tsx
│   │   ├── dashboard/
│   │   │   └── index.tsx
│   │   ├── practice/
│   │   │   ├── index.tsx
│   │   │   └── $sessionId.tsx
│   │   ├── analytics/
│   │   │   └── index.tsx
│   │   ├── settings/
│   │   │   └── index.tsx
│   │   └── payment/
│   │       ├── subscribe.tsx
│   │       ├── success.tsx
│   │       └── failed.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   └── constants.ts
│   └── styles/
│       └── globals.css
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

### Packages Structure

```
packages/
├── zod/                         # Shared Zod schemas
│   └── src/
│       ├── index.ts
│       ├── user.ts
│       ├── question.ts
│       ├── attempt.ts
│       ├── session.ts
│       ├── readiness.ts
│       └── payment.ts
├── openapi/                     # API contracts
│   └── src/
│       ├── contracts/
│       │   ├── index.ts
│       │   ├── auth.ts
│       │   ├── user.ts
│       │   ├── question.ts
│       │   ├── attempt.ts
│       │   ├── session.ts
│       │   ├── readiness.ts
│       │   └── payment.ts
│       └── index.ts
└── emails/                      # Email templates
    └── src/
        ├── welcome.tsx
        └── subscription.tsx
```

---

## 🔧 DEVELOPMENT COMMANDS

### Backend Commands

```bash
# Navigate to backend
cd apps/backend

# Run development server
task dev

# Run migrations
task migrate:up
task migrate:down
task migrate:create NAME=add_users

# Generate sqlc
task sqlc:generate

# Run tests
task test
task test:coverage

# Build
task build

# Docker
docker-compose up -d
docker-compose down
```

### Frontend Commands

```bash
# Navigate to frontend
cd apps/frontend

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build
pnpm build

# Type check
pnpm typecheck

# Lint
pnpm lint
```

### Monorepo Commands

```bash
# Root directory
pnpm install          # Install all dependencies
pnpm dev              # Run all dev servers
pnpm build            # Build all packages
turbo run build       # Build with Turborepo
turbo run test        # Run all tests
```

---

## 📊 SPRINT VELOCITY TRACKING

| Sprint | Planned SP | Completed SP | Velocity | Notes              |
| ------ | ---------- | ------------ | -------- | ------------------ |
| 1      | 22         | -            | -        | Foundation         |
| 2      | 38         | -            | -        | Auth & Questions   |
| 3      | 42         | -            | -        | Practice & IRT     |
| 4      | 38         | -            | -        | AI & Readiness     |
| 5      | 40         | -            | -        | Payment & FE Setup |
| 6      | 34         | -            | -        | FE Features        |
| 7      | 42         | -            | -        | Polish & Launch    |

**Total MVP SP**: ~256 SP

---

## 🎯 DEFINITION OF DONE (DoD)

### For Backend Tasks:

- [ ] Code written & compiles
- [ ] Unit tests written (80%+ coverage)
- [ ] API endpoint documented
- [ ] Error handling implemented
- [ ] Logging added
- [ ] Code reviewed
- [ ] Merged to main

### For Frontend Tasks:

- [ ] Component implemented
- [ ] Responsive design verified
- [ ] Loading/error states handled
- [ ] Accessibility checked
- [ ] TypeScript types correct
- [ ] Code reviewed
- [ ] Merged to main

### For Sprint:

- [ ] All P0 tasks completed
- [ ] No critical bugs
- [ ] Demo-able to stakeholders
- [ ] Documentation updated

---

## 📝 NOTES & DEPENDENCIES

### External Dependencies:

- **Clerk**: Auth provider - setup account & get API keys
- **Mistral/OpenRouter**: LLM provider - setup account & get API keys
- **Midtrans**: Payment gateway - setup sandbox account
- **Resend**: Email service - setup account
- **New Relic**: Monitoring - setup account
- **Railway/Render**: Hosting - setup account

### Critical Path:

```
Sprint 1 (Foundation)
    ↓
Sprint 2 (Auth + Questions)
    ↓
Sprint 3 (Practice + IRT) ← CRITICAL: IRT algorithm
    ↓
Sprint 4 (AI Feedback) ← CRITICAL: LLM integration
    ↓
Sprint 5 (Payment + FE Setup)
    ↓
Sprint 6 (FE Features)
    ↓
Sprint 7 (Polish + Launch)
```

### Risk Items:

1. **IRT Algorithm** - Complex math, needs thorough testing
2. **LLM Quality** - Prompt engineering iteration needed
3. **Clerk Integration** - First time setup may have issues
4. **Question Content** - Need 500+ quality questions

---

## 📅 MILESTONE DATES

| Milestone         | Target Date  | Status |
| ----------------- | ------------ | ------ |
| Sprint 1 Complete | Week 1 End   | ⬜     |
| Sprint 2 Complete | Week 2 End   | ⬜     |
| Sprint 3 Complete | Week 3-4 End | ⬜     |
| Sprint 4 Complete | Week 4-5 End | ⬜     |
| Sprint 5 Complete | Week 5-6 End | ⬜     |
| Sprint 6 Complete | Week 6 End   | ⬜     |
| Sprint 7 Complete | Week 7 End   | ⬜     |
| **MVP Launch**    | **Week 7+**  | ⬜     |

---

**Document Version**: 1.0  
**Last Updated**: December 2025  
**Status**: Ready for Development 🚀
