# 🎨 GENTA - FRONTEND REQUIREMENTS DOCUMENTATION

**AI-Powered UTBK Prep Platform - Frontend Specification**  
**Version 1.0 | December 2025 | TanStack Start + React 18**

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Tech Stack & Architecture](#tech-stack--architecture)
3. [Design System](#design-system)
4. [Page & Screen Specifications](#page--screen-specifications)
5. [User Flows & Interactions](#user-flows--interactions)
6. [API Integration Strategy](#api-integration-strategy)
7. [State Management](#state-management)
8. [Error Handling & Loading States](#error-handling--loading-states)
9. [Performance & Optimization](#performance--optimization)
10. [Accessibility & UX Standards](#accessibility--ux-standards)
11. [Testing Strategy](#testing-strategy)

---

## 🎯 PROJECT OVERVIEW

### **Product Vision**

Genta is an AI-powered UTBK (Ujian Tulis Berbasis Komputer) preparation platform that uses adaptive learning (IRT - Item Response Theory) to personalize question difficulty and provide AI-generated feedback.

### **Target Users**

- **Primary:** Indonesian high school students (age 16-18) preparing for UTBK
- **Secondary:** UTBK tutors, educators, parents monitoring progress
- **Language:** Bahasa Indonesia primary, English secondary

### **Core User Journey**

```
Sign Up → Onboarding → Dashboard → Practice → Feedback → Progress Tracking → Subscription
```

### **Key Features (MVP)**

✅ Adaptive question selection (IRT algorithm)  
✅ Real-time AI-generated feedback  
✅ Readiness score dashboard (7 subtests UTBK)  
✅ Progress analytics  
✅ Payment integration (Midtrans)  
✅ Study session tracking

### **UTBK Subtests (7 Total)**

Platform mendukung semua 7 subtest UTBK resmi:

**TPS (Tes Potensi Skolastik):**

- PU - Penalaran Umum (30 soal)
- PPU - Pengetahuan dan Pemahaman Umum (20 soal)
- PBM - Pemahaman Bacaan dan Menulis (20 soal)
- PK - Pengetahuan Kuantitatif (20 soal)

**Literasi & Penalaran:**

- LBI - Literasi Bahasa Indonesia (20 soal)
- LBE - Literasi Bahasa Inggris (20 soal)
- PM - Penalaran Matematika (20 soal)

---

## 🛠️ TECH STACK & ARCHITECTURE

### **Frontend Stack**

| Layer                | Technology            | Purpose                                  |
| -------------------- | --------------------- | ---------------------------------------- |
| **Framework**        | TanStack Start        | React meta-framework, file-based routing |
| **Runtime**          | React 19              | UI rendering, hooks-based architecture   |
| **Language**         | TypeScript            | Type safety, better DX                   |
| **Styling**          | CSS-in-JS (Tailwind)  | Utility-first, responsive design         |
| **State Management** | TanStack Query        | Server state management, caching         |
| **HTTP Client**      | Fetch API / Axios     | API communication                        |
| **Forms**            | React Hook Form + Zod | Form validation, submission              |
| **Charts**           | Recharts              | Progress analytics visualization         |
| **Authentication**   | Clerk SDK             | User auth, session management            |
| **Build Tool**       | Vite                  | Fast builds and HMR                      |

### **Project Structure**

```
frontend/
├── src/
│   ├── routes/                    # File-based routing (TanStack Start)
│   │   ├── __root.tsx            # Root layout
│   │   ├── index.tsx             # Home page
│   │   ├── auth/
│   │   │   ├── signup.tsx        # Signup flow
│   │   │   └── login.tsx         # Login flow
│   │   ├── dashboard/
│   │   │   ├── index.tsx         # Main dashboard
│   │   │   └── readiness.$section.tsx
│   │   ├── practice/
│   │   │   ├── index.tsx         # Practice selection
│   │   │   └── session.$sessionId.tsx
│   │   ├── analytics/
│   │   │   └── progress.tsx      # Progress page
│   │   ├── settings/
│   │   │   └── profile.tsx       # User settings
│   │   └── payment/
│   │       ├── subscribe.tsx     # Subscription page
│   │       └── success.tsx       # Payment success
│   ├── components/               # Reusable UI components
│   │   ├── common/              # Shared components
│   │   ├── auth/                # Auth-related components
│   │   ├── practice/            # Practice-related components
│   │   └── analytics/           # Analytics components
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useReadiness.ts
│   │   ├── useQuestions.ts
│   │   └── useAttempts.ts
│   ├── services/                # API service layer
│   │   ├── api.ts              # Base API client
│   │   ├── authService.ts
│   │   ├── questionsService.ts
│   │   ├── attemptsService.ts
│   │   └── paymentsService.ts
│   ├── types/                   # TypeScript types/interfaces
│   │   ├── api.ts              # API response types
│   │   ├── domain.ts           # Domain models
│   │   └── ui.ts               # UI types
│   ├── utils/                   # Utility functions
│   │   ├── irt.ts              # IRT calculations (client-side)
│   │   ├── formatting.ts       # Format dates, numbers
│   │   ├── validation.ts       # Form validation
│   │   └── errors.ts           # Error handling
│   ├── styles/                  # Global styles
│   │   ├── globals.css
│   │   └── design-system.css
│   ├── queryClient.ts           # TanStack Query config
│   └── main.tsx                 # Entry point
├── public/                       # Static assets
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript config
└── package.json
```

---

## 🎨 DESIGN SYSTEM

### **Color Palette**

| Token              | Light Mode           | Dark Mode              | Usage            |
| ------------------ | -------------------- | ---------------------- | ---------------- |
| **Primary**        | #218085 (Teal-500)   | #32B8C6 (Teal-300)     | CTAs, highlights |
| **Secondary**      | #5E5240 (Brown-600)  | #77787C (Gray-400)     | Accents          |
| **Background**     | #FCFCF9 (Cream-50)   | #1F2121 (Charcoal-700) | Page background  |
| **Surface**        | #FFFFFF (Cream-100)  | #262828 (Charcoal-800) | Cards, panels    |
| **Text**           | #134252 (Slate-900)  | #F5F5F5 (Gray-200)     | Body text        |
| **Text Secondary** | #626C71 (Slate-500)  | #A7A9A9 (Gray-300)     | Helper text      |
| **Success**        | #208085 (Teal-500)   | #32B8C6 (Teal-300)     | Success states   |
| **Error**          | #C0152F (Red-500)    | #FF5459 (Red-400)      | Error states     |
| **Warning**        | #A84B2F (Orange-500) | #E68161 (Orange-400)   | Warning states   |

### **Typography**

| Scale          | Font Size | Line Height | Font Weight | Usage              |
| -------------- | --------- | ----------- | ----------- | ------------------ |
| **H1**         | 30px      | 1.2         | 600         | Page titles        |
| **H2**         | 24px      | 1.2         | 600         | Section headers    |
| **H3**         | 20px      | 1.2         | 550         | Subsection headers |
| **Body Large** | 16px      | 1.5         | 400         | Main content       |
| **Body**       | 14px      | 1.5         | 400         | Standard text      |
| **Body Small** | 12px      | 1.5         | 400         | Helper text        |
| **Caption**    | 11px      | 1.5         | 400         | Labels, captions   |

**Font Family:** System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif)

### **Spacing Scale**

```
4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 56px, 64px
```

### **Component Library**

**Common Components to Build:**

- Button (primary, secondary, outline, sizes)
- Card (with header, footer, shadow variants)
- Input fields (text, email, password, number)
- Select dropdown
- Checkbox & Radio buttons
- Modal / Dialog
- Toast notifications
- Loading spinner / skeleton
- Alert / Banner
- Tab navigation
- Breadcrumbs
- Badge / Tags
- Progress bar

### **Dark Mode Support**

- Use CSS custom properties with prefers-color-scheme
- Toggle in settings (localStorage + system preference)
- All components must support both themes

---

## 📄 PAGE & SCREEN SPECIFICATIONS

### **1. Landing Page** (`/`)

**Purpose:** Introduce platform, marketing, non-authenticated users

**Sections:**

- Hero banner (CTA to signup)
- Features highlight (3-4 key features)
- Stats/social proof (users, questions, accuracy)
- Pricing plans (Free, Premium, Premium+)
- FAQ section
- Footer with links

**Key Interactions:**

- Responsive across mobile/tablet/desktop
- Hero CTA leads to signup
- Pricing cards are clickable → select tier
- Mobile menu toggle

---

### **2. Authentication Pages** (`/auth/*`)

#### **A. Signup Page** (`/auth/signup`)

**Purpose:** Create new account via Clerk

**Flow:**

1. Email input → Clerk validation
2. Password strength indicator
3. Name input
4. Target university (dropdown select)
5. Target score (range slider 550-750)
6. Exam date picker
7. Submit → Clerk creates account

**Validation:**

- Email format check
- Password min 8 chars, complexity
- Future exam date only
- Score within range

**Error Handling:**

- Display field-level errors (red border, helper text)
- Show email already exists → link to login
- Network errors with retry button

**Success:** Redirect to onboarding

---

#### **B. Login Page** (`/auth/login`)

**Purpose:** Existing users authenticate

**Flow:**

1. Email input
2. Password input
3. Remember me checkbox (optional)
4. Submit button
5. "Forgot password?" link → Clerk flow

**Error Handling:**

- Invalid credentials error
- Account not found → suggest signup
- Network errors with retry

**Success:** Redirect to dashboard

---

### **3. Onboarding Flow** (`/onboarding`)

**Purpose:** Collect essential preferences for personalization (simple, 2 steps only)

**Screens:**

1. **Step 1: Target** - "Mau masuk PTN mana?" + "Target skor berapa?"
2. **Step 2: Schedule** - "Kapan UTBK-nya?" + "Bisa belajar berapa jam/minggu?"

**Why 2 steps only:**

- Tidak ribet, langsung ke inti
- Data yang dikumpulkan cukup untuk personalisasi
- IRT algorithm akan otomatis menyesuaikan difficulty
- User bisa langsung mulai practice

**Technical:**

- Step tracking (1/2, 2/2)
- Progress bar
- Back button to previous step
- All data saved via POST /api/v1/users/onboarding
- Redirect to dashboard after completion
- User with `onboarding_completed: false` auto-redirected here

---

### **4. Dashboard Page** (`/dashboard`)

**Purpose:** Main hub after login, readiness overview

**Layout:**

- Header: Logo, user menu, notifications
- Sidebar: Navigation (Dashboard, Practice, Analytics, Settings)
- Main content:

**A. Welcome Section**

- Greeting: "Halo, [Name]! 👋"
- Today's goal progress
- Streak counter (consecutive study days)

**B. Readiness Cards (responsive grid)**

- 7 cards total, grouped by category:
  - **TPS (Tes Potensi Skolastik):** PU, PPU, PBM, PK
  - **Literasi & Penalaran:** LBI, LBE, PM
- Each card shows:
  - Subtest code & name (e.g., "PU - Penalaran Umum")
  - Accuracy percentage (circular progress)
  - Readiness score (0-100%)
  - Predicted score range
  - "Days to ready" countdown
  - "Practice Now" button
- Layout: 4 cards (TPS) + 3 cards (Literasi) or responsive 2-3 columns

**C. Quick Stats**

- Total questions attempted this week
- Average accuracy
- Study time this week
- Best section

**D. Recent Activity**

- Last 5 attempts (timestamp, question, result, score)
- "View all" link to analytics

**E. CTA Buttons**

- "Start Practice Session" (primary button)
- "View Full Analytics" (secondary)
- "Upgrade to Premium" (if free tier)

**Responsive (7 subtest cards):**

- Mobile: Stack cards vertically (1 column)
- Tablet: 2x grid
- Desktop: 4x grid (TPS row) + 3x grid (Literasi row)

---

### **5. Practice Session** (`/practice/session/:sessionId`)

**Purpose:** Adaptive question practice with feedback

**Layout:**

- Header: Timer, questions remaining, section indicator
- Main area: Question display
- Footer: Answer options

**A. Question Section**

- Question number & total in session (e.g., "5/20")
- Subtest badge (PU/PPU/PBM/PK/LBI/LBE/PM)
- Question text (with potential passage for reading comprehension)
- Difficulty indicator (if visible to user)

**B. Answer Options**

- 5 radio buttons (A-E)
- Each option is clickable
- Selected option highlighted
- Disabled until choice made

**C. Footer Actions**

- Previous button (if applicable)
- Submit answer button (enabled when selection made)
- Timer countdown

**D. After Answer Submitted**

- Show if correct/incorrect immediately
- Brief explanation appear below answer
- Show correct answer highlighted
- Feedback loading indicator (if being generated)
- Navigation: "Next Question" or "End Session"

**E. Feedback Display (Async)**

- If feedback ready: Show full AI-generated feedback
- If still generating: Show "Generating feedback..." + spinner
- Feedback content includes:
  - Explanation why correct/incorrect
  - Learning tip
  - Related concept
- "Helpful?" rating buttons: 👍 (helpful) / 👎 (not helpful)
  - Calls PUT /api/v1/attempts/:attempt_id/feedback-rating
  - Binary choice only (is_helpful: true/false)

**Session Management:**

- Start session via POST /api/v1/sessions
- Save attempt to backend after each submit
- Store session_id for tracking
- Calculate and update theta (IRT ability)
- Auto-save session progress
- End session via PUT /api/v1/sessions/:session_id/end

**Settings Panel** (accessible during session):

- Exit session (with confirmation)
- Show/hide timer
- Adjust text size
- Dark mode toggle

---

### **6. Readiness Dashboard** (`/readiness/:subtest`)

**Purpose:** Detailed view of subtest readiness

**Supported Subtests:**

- TPS: PU, PPU, PBM, PK
- Literasi: LBI, LBE, PM

**Layout:**

- Subtest header: "[Subtest Name] Readiness" (e.g., "Penalaran Umum Readiness")
- Category badge: TPS atau Literasi
- Stats cards (2x2 grid):
  - Overall accuracy %
  - Readiness score %
  - Predicted score (low-high range)
  - Days to ready

**A. Progress Visualization**

- Circular progress ring (readiness %)
- Gauge showing theta ability vs target
- Trend line (accuracy last 30 days)

**B. Detailed Metrics**

- Table with:
  - Total attempts
  - Correct answers
  - Average time per question
  - Improvement rate per week
  - Last practiced (timestamp)

**C. Subtype Breakdown**

- Show accuracy by question subtype based on subtest:
  - PU: Induktif, Deduktif, Kuantitatif
  - PPU: Pengetahuan Umum, Pemahaman Umum
  - PBM: Pemahaman Bacaan, Kemampuan Menulis
  - PK: Aljabar, Geometri, Statistika
  - LBI: Membaca Kritis, Menulis Efektif
  - LBE: Reading Comprehension, Grammar & Vocabulary
  - PM: Penalaran Aljabar, Penalaran Geometri, Penalaran Data
- Identify weak areas
- Link to practice specific subtype

**D. Next Steps**

- If ready: Congratulations message
- If not ready: Estimated completion date + suggested daily practice target
- Recommendation: Practice X questions per day to reach goal

---

### **7. Analytics / Progress Page** (`/analytics/progress`)

**Purpose:** Comprehensive performance tracking

**A. Time Range Filter**

- Tabs: This week, This month, All time
- Custom date picker (optional)

**B. Overview Cards**

- Questions attempted
- Overall accuracy
- Average time per question
- Longest streak (days)

**C. Accuracy Trend Chart**

- Line chart: Last 30 days accuracy by day
- Y-axis: 0-100% accuracy
- X-axis: Date
- Tooltip showing daily stats on hover
- Section selector (show all or specific section)

**D. Section Comparison Chart**

- Bar chart: Accuracy per subtest (PU, PPU, PBM, PK, LBI, LBE, PM)
- Color-coded bars
- Show accuracy % on hover

**E. Performance Metrics Table**

- Section | Attempts | Correct | Accuracy | Avg Time | Improvement
- Sortable columns
- Pagination for history

**F. Question Type Performance**

- Breakdown by sub_type (vocabulary, analogy, logic, etc)
- Show accuracy for each type
- Identify patterns/weak areas

---

### **8. Payment / Subscription Page** (`/payment/subscribe`)

**Purpose:** Upgrade to premium

**Layout:**

**A. Plan Selection Cards (2-3 cards)**

- Free (current)
- Premium (popular badge)
- Premium+ (exclusive)

Each card shows:

- Plan name
- Price per month
- Billing frequency
- Feature list (checkmarks)
- CTA button ("Upgrade Now" or "Current Plan")

**B. Features Comparison Table**

- Feature | Free | Premium | Premium+
- AI Feedback | Limited | Unlimited | Unlimited + Priority
- Custom Study Plans | No | Yes | Yes
- Analytics | Basic | Advanced | Advanced + Export
- Ad-free | No | Yes | Yes

**C. Premium Features Highlight**

- 5 key features with icons
- Why upgrade messaging

**D. FAQ Accordion**

- Common questions about billing
- Refund policy
- Cancellation policy

**E. Checkout Modal (Midtrans)**

- Plan summary
- Price breakdown
- "Pay Now" button → redirect to Midtrans
- Loading state during redirect

---

### **9. Payment Success Page** (`/payment/success`)

**Purpose:** Confirm successful subscription

**Content:**

- Checkmark icon animation
- "Welcome to Premium!" heading
- Confirmation message with order ID
- Subscription details (plan, start date, renewal date)
- Action buttons:
  - "Back to Dashboard"
  - "Start Premium Practice"

**Auto-redirect:** After 5 seconds to dashboard (with option to skip)

---

### **10. Settings / Profile Page** (`/settings/profile`)

**Purpose:** User account & preferences

**Sections:**

**A. Profile Section**

- Avatar upload/change
- Full name (editable)
- Email (read-only, with change option)
- Date joined

**B. Academic Goals**

- Target university (editable)
- Target score (editable range slider)
- Target exam date (editable calendar)
- Save changes button

**C. Preferences**

- Theme toggle (light/dark/system) - stored in localStorage
- Language selector (ID/EN) - stored in localStorage
- Display preferences
  - Text size (slider) - stored in localStorage
  - Show explanation by default (toggle) - stored in localStorage

Note: Notification preferences are out of scope for MVP

**D. Account**

- Subscription status
- Billing history (link to payment page)
- Download account data (GDPR)

**E. Security**

- Change password button → modal
- Active sessions (list devices)
- Logout all other sessions button
- Two-factor auth (future)

**F. Danger Zone**

- Delete account button → confirmation modal
- Data retention policy link

---

## 🔄 USER FLOWS & INTERACTIONS

### **Flow 1: Complete Practice Session**

```
1. User on Dashboard
   ↓
2. Click "Start Practice" or go to Practice menu
   ↓
3. Select subtest (PU/PPU/PBM/PK/LBI/LBE/PM)
   ↓
4. Select sub_type (optional) or "All"
   ↓
5. Select session duration (5, 10, 20 questions) or "Until I'm ready"
   ↓
6. Start session → redirect to /practice/session/:sessionId
   ↓
7. First question loads
   ↓
8. User reads question, selects answer (A-E)
   ↓
9. Click "Submit Answer"
   ↓
10. Show: Correct/incorrect + brief explanation
    Feedback generation starts (async)
    ↓
11. User rates feedback: 👍 helpful / 👎 not helpful (optional)
    → PUT /api/v1/attempts/:attempt_id/feedback-rating
    ↓
12. Update local theta calculation
    ↓
13. Button: "Next Question" or "End Session"
    ↓
    [If Next] → Load next question (IRT selected)
    [If End] → Session summary page
    ↓
14. Session Summary
    - Questions attempted: N
    - Accuracy: X%
    - Time spent: Y minutes
    - Best section: [section]
    - Average time per Q: Z seconds
    ↓
15. Buttons: "Continue Practice" or "Back to Dashboard"
```

---

### **Flow 2: View Readiness & Get Recommendations**

```
1. Dashboard → Click on Readiness card (e.g., PU)
   ↓
2. Navigate to /readiness/PU
   ↓
3. Display detailed metrics:
   - Accuracy trend
   - Days to ready
   - Current theta vs target
   ↓
4. If ready (readiness >= 75%):
   - Show "Selamat! Kamu sudah siap!" message
   - Recommend: Take practice test
   ↓
5. If not ready:
   - Show "Terus semangat!" or "Kamu di jalur yang benar!"
   - Display: "Latihan X hari lagi dengan Y soal/hari"
   - Suggest: Practice specific weak subtype
   ↓
6. "Mulai Latihan" button → Start session for this section
```

---

### **Flow 3: Payment Subscription**

```
1. User on Dashboard (free tier)
   ↓
2. See "Upgrade to Premium" CTA or navigate to Settings
   ↓
3. Go to /payment/subscribe
   ↓
4. View plan options (Free, Premium, Premium+)
   ↓
5. Click "Upgrade Now" on Premium card
   ↓
6. Checkout modal appears:
   - Plan summary
   - Price: Rp 149,000 (monthly)
   - Button: "Pay via Midtrans"
   ↓
7. Click "Pay" → Redirect to Midtrans snap modal
   ↓
8. User selects payment method (credit card, bank transfer, e-wallet)
   ↓
9. Complete payment
   ↓
10. Midtrans sends webhook to backend → subscription activated
    ↓
11. Frontend receives success callback
    ↓
12. Redirect to /payment/success
    ↓
13. Show confirmation, then redirect to dashboard
    ↓
14. Dashboard now shows "Premium" badge
    Premium features unlocked
```

---

### **Flow 4: Check Async Feedback Status**

```
1. User submits answer
   ↓
2. Backend queues feedback generation job → returns job_id
   ↓
3. Frontend shows: "Membuat feedback..." with spinner
   ↓
4. Start polling: POST /api/v1/jobs/:job_id/check every 1 second
   ↓
5. Response 202 (still processing):
   - Update spinner message: "Sebentar lagi..."
   - Show estimated time remaining
   ↓
6. Response 200 (completed):
   - Stop polling
   - Display feedback content
   - Show 👍/👎 rating buttons
   ↓
7. If error/timeout after 30 seconds:
   - Show: "Feedback tidak tersedia, coba lagi nanti"
   - Still allow proceeding to next question
```

---

## 🔌 API INTEGRATION STRATEGY

### **API Communication Layer**

**Base Setup:**

```
- Base URL: https://api.genta.id/api/v1
- Authentication: Bearer token (from Clerk)
- Timeout: 30 seconds
- Auto-retry: Exponential backoff (max 3 attempts)
- Cache: TanStack Query (browser-managed)
```

**HTTP Client Configuration:**

- Set default headers (Authorization, Content-Type)
- Interceptors for error handling
- Request/response logging (development only)
- Mock API for local development (optional)

---

### **Service Layer Organization**

**authService:**

- getCurrentUser() → GET /api/v1/auth/me
- Note: Login, signup, and logout are handled by Clerk SDK directly (no backend endpoints)

**questionsService:**

- getQuestions(section, page, limit) → GET /api/v1/questions
- getNextQuestion(section) → GET /api/v1/questions/next
- getQuestion(id) → GET /api/v1/questions/:id

**attemptsService:**

- createAttempt(data) → POST /api/v1/attempts
- getAttempt(id) → GET /api/v1/attempts/:id
- listAttempts(page, limit) → GET /api/v1/attempts
- rateFeedback(attemptId, isHelpful) → PUT /api/v1/attempts/:attempt_id/feedback-rating

**readinessService:**

- getReadiness(section?) → GET /api/v1/readiness
- getReadinessHistory(section, days) → GET /api/v1/readiness/:section

**userService:**

- updateProfile(data) → PUT /api/v1/users/me
- completeOnboarding(data) → POST /api/v1/users/onboarding

**analyticsService:**

- getProgress(days, section?) → GET /api/v1/analytics/progress

**sessionsService:**

- getSessions(page, limit) → GET /api/v1/sessions
- startSession(section?) → POST /api/v1/sessions
- endSession(sessionId) → PUT /api/v1/sessions/:session_id/end

**paymentsService:**

- subscribe(tier, days) → POST /api/v1/payments/subscribe
- getPaymentStatus(orderId) → GET /api/v1/payments/status/:order_id

**jobsService:**

- checkJobStatus(jobId) → POST /api/v1/jobs/:job_id/check

---

### **Data Fetching Patterns**

**Pattern 1: TanStack Query (Server State)**

Use for data from backend:

- Questions
- Attempts
- Readiness scores
- User profile
- Analytics

Configuration:

```
- Stale time: 5 minutes (varies by endpoint)
- Cache time: 30 minutes
- Refetch on window focus: Yes
- Refetch interval: None (manual refetch)
```

**Pattern 2: Local State (Client State)**

Use for UI-only state:

- Form inputs
- UI toggles (dark mode, sidebar collapse)
- Modal open/close
- Session tracking

**Pattern 3: URL State**

Use for navigation/filtering:

- Query params: ?subtest=PU&page=1
- Route params: /practice/session/:sessionId
- Hash: #readiness-subtest-pu

---

### **Error Handling Strategy**

**Error Types & Handling:**

| Error Type   | Status  | User Message                          | Action                         |
| ------------ | ------- | ------------------------------------- | ------------------------------ |
| Validation   | 400     | "Please check the highlighted fields" | Highlight fields, show errors  |
| Unauthorized | 401     | "Your session expired, please login"  | Redirect to login              |
| Forbidden    | 403     | "You don't have access to this"       | Show info modal or redirect    |
| Not Found    | 404     | "Resource not found"                  | Redirect to dashboard          |
| Rate Limited | 429     | "Too many requests, try again later"  | Show retry button w/ countdown |
| Server Error | 500/503 | "Something went wrong, try again"     | Show retry button, log error   |

**Implementation:**

- Create error boundary component
- Global error interceptor for all API calls
- Toast notification for each error
- Unique error codes for different scenarios
- Error logging to external service (Sentry, etc.)

---

### **Caching Strategy**

**Question Data:**

- Cache questions by section
- Stale after 30 minutes
- Refetch if user opens practice after 1 hour
- Clear cache on logout

**User Data:**

- Cache readiness scores
- Stale after 5 minutes (update frequently)
- Refetch on dashboard load
- Clear on logout

**Analytics:**

- Cache progress data
- Stale after 15 minutes
- Refetch when user navigates to analytics page

**Session Data:**

- Don't cache attempt submissions
- Always fresh from backend
- Cache session metadata only

---

### **Polling & Real-time Updates**

**Feedback Generation Status:**

- Poll job status: `/api/v1/jobs/:jobId/check`
- Interval: 1 second
- Max duration: 30 seconds
- Stop on: Complete, error, or timeout
- Show progress: "Generating feedback... (2/8 sec)"

**Readiness Updates:**

- Background refetch every 5 minutes
- Silent update (no notification)
- Only refetch when user is on dashboard/analytics

---

## 🎛️ STATE MANAGEMENT

### **Global State (TanStack Query)**

Manage server state:

- User authentication status
- Current user profile
- Readiness data
- Questions cache
- Attempts history

**Setup:**

- QueryClientProvider at root
- Default options configured
- Devtools in development
- Persistence (optional) to localStorage

### **Component State (useState)**

Local component state:

- Form inputs (questions, answers)
- Modal open/close
- Accordion expanded/collapsed
- Loading indicators
- Sorting/filtering preferences

### **Context (for UI state)**

- Theme context (dark/light mode)
- User preferences context
- Notification context

### **SessionStorage / LocalStorage**

Persist across page reloads:

- User theme preference
- Session ID (during active session)
- Form draft (if user navigates away)
- Last visited page (breadcrumb navigation)

---

## ⚠️ ERROR HANDLING & LOADING STATES

### **Loading States**

**Skeleton Screens:**

- Dashboard readiness cards
- Questions list
- Analytics charts
- Profile page

**Spinners:**

- Small spinner for buttons ("Submitting...")
- Center spinner for full-page loads
- Inline spinners for async feedback

**Disabled States:**

- Submit button disabled while loading
- Input fields disabled during API call
- Navigation disabled during transition

---

### **Empty States**

**No Questions Found:**

```
Icon: Search icon
Heading: "No questions found"
Message: "Try adjusting your filters"
CTA: "Clear filters" or "Browse all"
```

**No Attempts Yet:**

```
Icon: Target icon
Heading: "No practice yet"
Message: "Start your first practice session"
CTA: "Start Practicing"
```

**No Data for Period:**

```
Icon: Calendar icon
Heading: "No data for this period"
Message: "Try selecting a different date range"
CTA: "View all time"
```

---

### **Error Boundaries**

**Scope:** Wrap major sections

- Practice session section
- Dashboard section
- Analytics section

**Fallback UI:**

- Show error icon
- Error message ("Something went wrong")
- Retry button
- Contact support link

---

## 🚀 PERFORMANCE & OPTIMIZATION

### **Code Splitting**

- Route-based splitting (each page lazy-loaded)
- Component-based splitting (heavy components)
- Vendor bundle separate

### **Image Optimization**

- Use WebP format where supported
- Responsive images (srcset)
- Lazy load below-fold images
- Optimize illustrations (SVG where possible)

### **Bundle Size Targets**

- Initial JS: < 200KB
- Total CSS: < 50KB
- Images: < 2MB total

### **Caching Headers**

- Static assets: 1 year cache + versioning
- API responses: 5-30 min based on data type
- HTML: No cache (must revalidate)

### **Network Optimization**

- API requests batching (get multiple resources in one call)
- Debounce search queries (200ms)
- Cancel previous requests on new request
- Compress responses (gzip)

### **Render Optimization**

- Memoize expensive components (React.memo)
- useCallback for event handlers
- useMemo for computed values
- Virtual scrolling for long lists

### **Monitoring**

- Track Core Web Vitals (LCP, CLS, FID/INP)
- Monitor API response times
- Track error rates
- Monitor bundle size

---

## ♿ ACCESSIBILITY & UX STANDARDS

### **WCAG 2.1 Level AA Compliance**

**Keyboard Navigation:**

- All interactive elements focusable (Tab key)
- Focus visible (visible focus ring)
- Logical tab order
- Escape key closes modals/dropdowns

**Screen Reader Support:**

- Semantic HTML (buttons, links, headings)
- ARIA labels for icons
- Form labels associated with inputs
- Skip navigation link

**Color & Contrast:**

- Minimum 4.5:1 contrast ratio (normal text)
- 3:1 for large text / UI components
- Don't rely on color alone (use icons/text too)

**Responsive Design:**

- Works at all viewport sizes (320px - 4K)
- Touch-friendly tap targets (min 48x48px)
- Readable at 200% zoom
- No horizontal scrolling at 320px width

**Motion & Animation:**

- Respect `prefers-reduced-motion`
- No flashing (> 3 per second)
- Animations purposeful, not distracting

### **Internationalization (i18n)**

**Language Support:**

- Bahasa Indonesia (primary)
- English (secondary)
- Switch in settings
- Persist user preference

**Implementation:**

- i18n library (react-i18next or i18n-next)
- All strings in translation files
- Dates/times formatted per locale
- Numbers formatted per locale

---

## ✅ TESTING STRATEGY

### **Unit Tests**

Target: 80% code coverage

Components to test:

- Custom hooks
- Utility functions
- Components with logic
- Form validation

Tools:

- Vitest + React Testing Library
- jsdom for DOM simulation

---

### **Integration Tests**

Test flows:

- Authentication flow (signup, login)
- Practice session flow (select, answer, submit)
- Payment flow (view plans, checkout)
- Error handling (API errors, network issues)

---

### **E2E Tests**

Use Playwright or Cypress

Scenarios:

- User signup → dashboard → practice → feedback
- View readiness dashboard
- Purchase subscription
- Change settings
- Error recovery (network retry)

Coverage: Critical user paths

---

### **Performance Tests**

- Lighthouse CI (PageSpeed Insights)
- Bundle size monitoring
- API response time thresholds
- Load time targets

---

### **Accessibility Testing**

- Axe accessibility audit
- Manual keyboard navigation
- Screen reader testing (NVDA, JAWS)
- Color contrast verification

---

### **Visual Regression Testing**

- Percy or BackstopJS
- Capture screenshots on PR
- Flag visual changes
- Before/after comparison

---

## 📱 RESPONSIVE BREAKPOINTS

| Device  | Width      | Columns | Grid         |
| ------- | ---------- | ------- | ------------ |
| Mobile  | 320-639px  | 1       | Single stack |
| Tablet  | 640-1023px | 2       | 2-column     |
| Desktop | 1024px+    | 3+      | Multi-column |

**Key considerations:**

- Touch targets at least 48px
- Font sizes scale with viewport
- Images scale responsively
- Navigation collapses to mobile menu

---

## 🔐 Security Best Practices

**Frontend Security:**

- Sanitize user input (prevent XSS)
- Store JWT securely (HttpOnly cookies preferred)
- HTTPS only (no HTTP)
- Content Security Policy headers
- No sensitive data in localStorage
- Validate all API responses
- CSRF protection with SameSite cookies
- Escape HTML content

**Data Privacy:**

- No caching of sensitive data
- Clear data on logout
- GDPR compliance (data export, deletion)
- No logging of personal data
- PII never in error messages

---

## 📊 Analytics & Monitoring

**Events to Track:**

- User signup/login
- Practice session start/complete
- Question submitted
- Payment initiated/completed
- Error occurred
- Page viewed
- Feature used

**Metrics to Monitor:**

- User engagement (DAU, MAU)
- Practice completion rate
- Subscription conversion rate
- Error rate by page
- API latency
- Frontend performance (Core Web Vitals)

---

## 🔄 Deployment & Environments

**Environments:**

- **Local:** Development, hot reload
- **Staging:** Pre-production testing
- **Production:** Live users

**Deployment Process:**

1. Merge to main branch
2. Run tests & linting
3. Build optimized bundle
4. Deploy to CDN + server
5. Smoke tests
6. Monitor for errors

**Feature Flags:**

- New features behind feature flags
- Gradual rollout (5%, 25%, 100%)
- Ability to kill switch if errors

---

## 📅 Development Phases

### **Phase 1: MVP (Weeks 1-4)**

- Authentication (Clerk)
- Dashboard + basic UI
- Practice sessions (simplified)
- Readiness dashboard
- Basic analytics

### **Phase 2: AI & Polish (Weeks 5-6)**

- AI feedback integration
- Async job polling
- Error handling polish
- Performance optimization
- Accessibility audit

### **Phase 3: Payments & Features (Weeks 7-8)**

- Midtrans integration
- Subscription management
- Premium features
- Settings page
- Email notifications

### **Phase 4: Testing & Launch (Weeks 9+)**

- Full test coverage
- E2E testing
- Performance testing
- Security audit
- Beta launch

---

**Version:** 1.0 | Last Updated: December 2025  
**Status:** Requirements Complete, Ready for Development ✅
