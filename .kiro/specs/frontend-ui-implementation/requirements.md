# Requirements Document

## Introduction

This document specifies the requirements for implementing the Genta frontend UI - an AI-powered UTBK (Ujian Tulis Berbasis Komputer) preparation platform. The frontend will provide adaptive learning experiences with real-time AI feedback, readiness tracking across 7 UTBK subtests, and progress analytics. The implementation uses Next.js with ts-rest for API communication, shadcn/ui components, and follows a clean, minimalist design system.

## Glossary

- **UTBK**: Ujian Tulis Berbasis Komputer - Indonesian computer-based university entrance exam
- **TPS**: Tes Potensi Skolastik - Scholastic Potential Test (4 subtests: PU, PPU, PBM, PK)
- **Literasi**: Literacy and Reasoning section (3 subtests: LBI, LBE, PM)
- **IRT**: Item Response Theory - algorithm for adaptive question selection
- **Theta**: IRT ability parameter representing student skill level
- **Readiness**: Percentage indicating student preparedness for exam
- **Session**: A practice session containing multiple question attempts
- **Attempt**: A single question answer submission
- **Feedback**: AI-generated explanation for question answers
- **ts-rest**: Type-safe REST client library for API communication
- **Clerk**: Authentication service provider

## Requirements

### Requirement 1: Onboarding Flow

**User Story:** As a new student, I want to set my exam goals during onboarding, so that the platform can personalize my learning experience.

#### Acceptance Criteria

1.1. WHEN a user with `onboarding_completed: false` accesses the dashboard THEN the System SHALL redirect to the onboarding page
1.2. WHEN the onboarding page loads THEN the System SHALL display a 2-step form for target PTN, target score, exam date, and study hours per week
1.3. WHEN the user submits valid onboarding data THEN the System SHALL call POST /api/v1/users/onboarding and redirect to dashboard
1.4. WHEN the user submits invalid onboarding data THEN the System SHALL display field-level validation errors
1.5. WHEN onboarding completes successfully THEN the System SHALL set `onboarding_completed: true` and initialize readiness data

### Requirement 2: Dashboard Page

**User Story:** As a student, I want to see my readiness overview and quick actions, so that I can track my progress and start practicing efficiently.

#### Acceptance Criteria

2.1. WHEN the dashboard loads THEN the System SHALL display a welcome header with user name, daily progress, and streak count
2.2. WHEN the dashboard loads THEN the System SHALL fetch and display readiness data from GET /api/v1/readiness
2.3. WHEN the dashboard loads THEN the System SHALL display TPS readiness card showing 4 subtests (PU, PPU, PBM, PK) with percentages
2.4. WHEN the dashboard loads THEN the System SHALL display Literasi readiness card showing 3 subtests (LBI, LBE, PM) with percentages
2.5. WHEN the dashboard loads THEN the System SHALL display overall readiness percentage with predicted score range
2.6. WHEN the dashboard loads THEN the System SHALL display an activity heatmap showing practice history
2.7. WHEN the dashboard loads THEN the System SHALL display quick action buttons for starting practice sessions
2.8. WHEN the dashboard loads THEN the System SHALL display countdown banner showing days until exam date
2.9. WHEN a user clicks a subtest card THEN the System SHALL navigate to the detailed readiness page for that section

### Requirement 3: Practice Session Flow

**User Story:** As a student, I want to practice questions adaptively, so that I can improve my skills at the right difficulty level.

#### Acceptance Criteria

3.1. WHEN a user starts a practice session THEN the System SHALL call POST /api/v1/sessions to create a new session
3.2. WHEN a session starts THEN the System SHALL call GET /api/v1/questions/next with the selected section to fetch the first question
3.3. WHEN a question loads THEN the System SHALL display question text, 5 answer options (A-E), timer, and progress indicator
3.4. WHEN a user selects an answer and submits THEN the System SHALL call POST /api/v1/attempts with question_id, selected_answer, time_spent_seconds, and session_id
3.5. WHEN an attempt is recorded THEN the System SHALL display correct/incorrect result with the correct answer highlighted
3.6. WHEN feedback is being generated THEN the System SHALL display a loading indicator and poll POST /api/v1/jobs/:job_id/check
3.7. WHEN feedback is ready THEN the System SHALL display AI-generated feedback with explanation
3.8. WHEN feedback is displayed THEN the System SHALL show thumbs up/down rating buttons
3.9. WHEN a user rates feedback THEN the System SHALL call PUT /api/v1/attempts/:attempt_id/feedback-rating
3.10. WHEN a user clicks next question THEN the System SHALL fetch the next adaptive question
3.11. WHEN a user ends the session THEN the System SHALL call PUT /api/v1/sessions/:session_id/end and display session summary

### Requirement 4: Readiness Detail Page

**User Story:** As a student, I want to see detailed readiness metrics for each subtest, so that I can understand my strengths and weaknesses.

#### Acceptance Criteria

4.1. WHEN the readiness detail page loads THEN the System SHALL call GET /api/v1/readiness/:section
4.2. WHEN data loads THEN the System SHALL display overall accuracy, readiness percentage, and predicted score range
4.3. WHEN data loads THEN the System SHALL display current theta vs target theta visualization
4.4. WHEN data loads THEN the System SHALL display accuracy trend chart for the last 30 days
4.5. WHEN data loads THEN the System SHALL display subtype breakdown with accuracy per question type
4.6. WHEN data loads THEN the System SHALL display days to ready countdown and estimated completion date
4.7. WHEN readiness is below 75% THEN the System SHALL display recommended daily practice target
4.8. WHEN readiness is 75% or above THEN the System SHALL display congratulations message

### Requirement 5: Analytics/Progress Page

**User Story:** As a student, I want to view comprehensive analytics, so that I can track my improvement over time.

#### Acceptance Criteria

5.1. WHEN the analytics page loads THEN the System SHALL call GET /api/v1/analytics/progress with configurable days parameter
5.2. WHEN data loads THEN the System SHALL display overview cards with total questions, accuracy, and streak
5.3. WHEN data loads THEN the System SHALL display accuracy trend line chart
5.4. WHEN data loads THEN the System SHALL display section comparison bar chart for all 7 subtests
5.5. WHEN data loads THEN the System SHALL display performance metrics table with sortable columns
5.6. WHEN a user changes the time range filter THEN the System SHALL refetch data with the new days parameter

### Requirement 6: Settings/Profile Page

**User Story:** As a student, I want to manage my profile and preferences, so that I can customize my learning experience.

#### Acceptance Criteria

6.1. WHEN the settings page loads THEN the System SHALL display current user profile from GET /api/v1/users/me
6.2. WHEN a user updates profile fields THEN the System SHALL call PUT /api/v1/users/me with updated data
6.3. WHEN the settings page loads THEN the System SHALL display academic goals (target PTN, score, exam date) as editable fields
6.4. WHEN the settings page loads THEN the System SHALL display theme toggle (light/dark/system) stored in localStorage
6.5. WHEN a user changes theme THEN the System SHALL apply the theme immediately and persist to localStorage
6.6. WHEN the settings page loads THEN the System SHALL display subscription status and tier

### Requirement 7: Error Handling and Loading States

**User Story:** As a student, I want clear feedback during loading and errors, so that I understand the system state.

#### Acceptance Criteria

7.1. WHEN data is loading THEN the System SHALL display skeleton loaders matching the content layout
7.2. WHEN an API call fails with 401 THEN the System SHALL redirect to the sign-in page
7.3. WHEN an API call fails with 400 THEN the System SHALL display field-level validation errors
7.4. WHEN an API call fails with 500 THEN the System SHALL display a retry button with error message
7.5. WHEN an API call fails with 429 THEN the System SHALL display rate limit message with countdown
7.6. WHEN no data exists for a section THEN the System SHALL display appropriate empty state with CTA

### Requirement 8: Responsive Design

**User Story:** As a student, I want to use the platform on any device, so that I can practice anywhere.

#### Acceptance Criteria

8.1. WHEN viewed on mobile (< 640px) THEN the System SHALL display single-column layout with stacked cards
8.2. WHEN viewed on tablet (640px - 1024px) THEN the System SHALL display 2-column grid for readiness cards
8.3. WHEN viewed on desktop (> 1024px) THEN the System SHALL display full layout with sidebar navigation
8.4. WHEN viewed on any device THEN the System SHALL maintain readable text sizes and touch-friendly targets

### Requirement 9: API Integration with ts-rest

**User Story:** As a developer, I want type-safe API communication, so that I can catch errors at compile time.

#### Acceptance Criteria

9.1. WHEN making server-side API calls THEN the System SHALL use createServerApiClient from api.server.ts
9.2. WHEN making client-side API calls THEN the System SHALL use useApiClient hook from index.ts
9.3. WHEN API responses are received THEN the System SHALL validate response types against OpenAPI contract
9.4. WHEN API errors occur THEN the System SHALL handle them consistently using the error response structure

### Requirement 10: Project Structure Convention

**User Story:** As a developer, I want consistent project structure, so that the codebase is maintainable and scalable.

#### Acceptance Criteria

10.1. WHEN adding new features THEN the Developer SHALL create feature folders under `features/[feature-name]/` with `components/`, `hooks/`, `types/`, and `mock/` subfolders
10.2. WHEN naming files THEN the Developer SHALL use kebab-case format (e.g., `activity-heatmap.tsx`, `use-readiness.ts`)
10.3. WHEN creating components THEN the Developer SHALL export them through an `index.ts` barrel file in the feature folder
10.4. WHEN creating shared UI components THEN the Developer SHALL place them in `components/ui/` using shadcn/ui conventions
