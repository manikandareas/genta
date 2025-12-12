# 📋 GENTA - PRODUCT REQUIREMENTS DOCUMENT (PRD) - UPDATED

**AI-Powered UTBK Prep Platform with Intelligent Feedback System**  
**Version 2.0 | December 2025 (Tech Stack Updated)**

---

## 📚 STRUKTUR UTBK RESMI

UTBK (Ujian Tulis Berbasis Komputer) terdiri dari **7 subtest** dengan total **150 soal**:

### **TPS (Tes Potensi Skolastik) - 90 soal**

| Kode    | Subtest                        | Jumlah Soal | Deskripsi                                                |
| ------- | ------------------------------ | ----------- | -------------------------------------------------------- |
| **PU**  | Penalaran Umum                 | 30 soal     | Penalaran Induktif (10), Deduktif (10), Kuantitatif (10) |
| **PPU** | Pengetahuan dan Pemahaman Umum | 20 soal     | Pengetahuan umum dan pemahaman konteks                   |
| **PBM** | Pemahaman Bacaan dan Menulis   | 20 soal     | Kemampuan membaca kritis dan menulis                     |
| **PK**  | Pengetahuan Kuantitatif        | 20 soal     | Matematika dasar, aljabar, geometri                      |

### **Literasi dan Penalaran - 60 soal**

| Kode    | Subtest                   | Jumlah Soal | Deskripsi                                                 |
| ------- | ------------------------- | ----------- | --------------------------------------------------------- |
| **LBI** | Literasi Bahasa Indonesia | 20 soal     | Membaca kritis dan menulis efektif dalam Bahasa Indonesia |
| **LBE** | Literasi Bahasa Inggris   | 20 soal     | Reading comprehension dan grammar                         |
| **PM**  | Penalaran Matematika      | 20 soal     | Penalaran aljabar, geometri, dan statistik                |

---

## 🎯 EXECUTIVE SUMMARY

### **Product Vision**

Genta is an AI-powered UTBK (Ujian Tulis Berbasis Komputer) preparation platform that provides every student with a personal AI tutor, making high-quality test prep accessible and affordable.

### **Problem Statement**

**Current situation:**

- 1.2M+ students take UTBK annually in Indonesia
- UTBK prep is expensive (Rp 3-5M for good bimbel courses)
- Most prep methods are passive (reading modul, watching videos)
- Students don't get personalized feedback on why they're wrong
- Success rates in top universities are only 15-20% despite prep

**Student pain points:**

- ❌ "I practice 100 questions, but I don't understand why I'm wrong"
- ❌ "Feedback is just copy-paste explanations from books"
- ❌ "I don't know which topics to focus on or if I'm ready"
- ❌ "Good tutors are expensive (Rp 500K+/hour)"

### **Solution**

Genta provides:

1. **AI-Powered Personalized Feedback** - Best-in-class AI (OpenAI/Mistral/OpenRouter) analyzes student mistakes contextually and generates personalized feedback for every question
2. **Adaptive Practice** - IRT algorithm selects questions at the right difficulty level for each student
3. **Simple Readiness Tracking** - Clear "Am I ready?" indicator based on accuracy trends
4. **UTBK-Authentic Questions** - Questions that match real UTBK patterns and difficulty

**Why it's different:**

- ✅ **Contextual AI feedback** (not generic explanations)
- ✅ **Personal AI tutor** (not just practice bank)
- ✅ **Affordable** (Rp 149K/month vs Rp 3-5M bimbel)
- ✅ **Accessible** (24/7 available, no scheduling)
- ✅ **Modern Stack** (Golang backend = lean, fast, cheap deployment)

---

## 📊 MARKET OPPORTUNITY

### **Market Size**

```
Total Addressable Market (TAM):
- Students taking UTBK: 1.2M+ annually
- UTBK prep seekers: 800K+ (70%)
- Willing to pay: 200K+ students (25%)
- Total market value: 200K × Rp 1.8M/year = Rp 360B+

Serviceable Addressable Market (SAM):
- Initial target: students with smartphones (85% in urban areas)
- Urban UTBK takers: ~600K
- SAM: Rp 216B+

Serviceable Obtainable Market (SOM):
- Year 1: 10K students = Rp 1.8B ARR
- Year 3: 50K students = Rp 9B ARR
- Year 5: 100K+ students = Rp 18B+ ARR
```

### **Competitive Landscape**

```
Direct Competitors:
- Zenius (leader, but passive content)
- Ruangguru (good features, poor feedback)
- Pahamify (expensive, limited scope)

Indirect Competitors:
- Offline bimbel (expensive, inconvenient)
- YouTube prep channels (free but unstructured)
- Textbooks/modul (free but outdated)

Genta Competitive Advantage:
✓ Only platform with contextual AI feedback (best-in-class models)
✓ Adaptive practice (personalized difficulty)
✓ Most affordable (Rp 149K vs Rp 500K+ tutoring)
✓ Available 24/7
✓ Cost-optimized Golang backend (best deployment economics)
```

---

## 👥 USER PERSONAS

### **Persona 1: PREMIUM SEEKER (40% of users)**

**Name:** Rina, 17 years old  
**Background:** SMA (2nd year), top 20% student, aiming for UI/ITB  
**Motivation:**

- Target score: 700+ (very high)
- Exam date: 3 months away
- Budget: Rp 2-3M/year for prep (can afford bimbel)
- Pain point: "I need expert feedback, not just answers"

**Goals:**

- Understand WHY I'm wrong on every question
- Track progress daily
- Get strategy tips for question types I struggle with

**Expected use:**

- 1-2 hours/day
- 20-30 questions/day
- Premium subscription (best feedback features)

---

### **Persona 2: BUDGET CONSCIOUS (35% of users)**

**Name:** Bambang, 17 years old  
**Background:** SMA (3rd year), average student, aiming for decent state university  
**Motivation:**

- Target score: 600-650 (good enough)
- Exam date: 2 months away
- Budget: Rp 500K/year max (can't afford bimbel)
- Pain point: "I need affordable access to quality prep"

**Goals:**

- Practice lots of questions (volume)
- Get basic feedback on mistakes
- Know if I'm on track for readiness

**Expected use:**

- 45-60 min/day
- 15-20 questions/day
- Free tier or trial, may upgrade later

---

### **Persona 3: LAST-MINUTE CRAMPER (15% of users)**

**Name:** Diana, 17 years old  
**Background:** SMA (3rd year), underperformer, needs quick improvement  
**Motivation:**

- Target score: 550+ (just pass)
- Exam date: 4 weeks away
- Budget: Can spend if it works
- Pain point: "I wasted time, now I need to catch up fast"

**Goals:**

- Focus on weak areas only
- Get intensive feedback
- Reach 70%+ accuracy quickly

**Expected use:**

- 3-4 hours/day
- 40-50 questions/day
- Premium subscription for boost

---

## 🎯 PRODUCT SCOPE

### **MVP Release Scope (January 2026)**

#### **IN SCOPE - MVP Must-Haves**

✅ User authentication (Clerk)  
✅ 1000+ UTBK-pattern questions (7 subtests sesuai UTBK resmi)  
✅ Adaptive practice with IRT algorithm  
✅ AI feedback generation (Best-in-class model selection)  
✅ Simple readiness calculation  
✅ Basic dashboard  
✅ Question + feedback display UI  
✅ Basic analytics (accuracy by subtest)  
✅ Free tier + Premium tier (Rp 149K/month)  
✅ Mobile-responsive design

#### **OUT OF SCOPE - Phase 2+**

❌ Video explanations (Phase 2: AI-generated videos)  
❌ Live tutoring (Phase 2: expert tutors)  
❌ School dashboard features (Phase 2: classroom management)  
❌ CPNS/SBMPTN exams (Phase 2+: other exam types)  
❌ Offline mode  
❌ Native mobile app (Phase 2: iOS/Android)  
❌ Advanced gamification (streaks, daily challenges on hold)  
❌ Social features (communities, friend comparison)  
❌ Video content library

### **Why These Boundaries?**

- Video = 400+ hours development (Phase 2)
- Tutoring = need hiring tutors (revenue model different)
- School features = B2B sales complexity
- Other exams = content curation time (6+ months)

---

## ✨ CORE FEATURES

### **Feature 1: ADAPTIVE PRACTICE WITH AI FEEDBACK** ⭐⭐⭐

**User Flow:**

```
1. Student starts practice session
   ↓
2. System selects question at student's difficulty level
   (using IRT algorithm based on current theta)
   ↓
3. Student reads question (text + options)
   ↓
4. Student selects answer (A, B, C, D, E)
   ↓
5. System shows: "Correct!" or "Incorrect"
   ↓
6. AI generates personalized feedback (Best-in-class LLM)
   - Why the chosen answer is wrong (if incorrect)
   - Why the correct answer is right
   - Learning strategy for this question type
   - Reference to related concept
   ↓
7. Student reads feedback (engaging, specific)
   ↓
8. System updates student theta (IRT recalculation)
   ↓
9. Next question auto-selected at new difficulty level
   ↓
10. Repeat (Loop is addictive, learning-focused)
```

**Feedback Example (Real Case):**

```
Question: "Sebuah perusahaan mengalami penurunan penjualan 30%
bulan pertama, lalu 20% bulan kedua. Kenaikan berapa % agar
kembali normal?"

Student answer: B) 367.5M ❌
Correct answer: C) 400M ✅

AI Feedback (Best-in-class model generated):
"Hmm, I see what happened! 🔍

You calculated: 70% × 80% = 56%, then 100-56 = 44%
But you made a small mistake → you used wrong base amount.

Pattern I noticed: You rush on 'multi-step percentage' problems.

Strategy tip:
→ Circle all percentage numbers FIRST
→ Ask: 'Which amount is the BASE?'
→ Calculate step-by-step (don't chain)

Try this on the next percentage problem! ✅"
```

**Why this works:**

- ✅ Specific (addresses exact mistake)
- ✅ Respectful (not condescending)
- ✅ Actionable (gives strategy)
- ✅ Encouraging (positive tone)
- ✅ Fast (generated in <2 seconds)

**Technical Requirements:**

- LLM API integration (feedback generation via best-in-class model)
- Real-time IRT calculation
- Prompt engineering (optimize feedback quality)
- Caching strategy (reduce API calls, manage costs)
- Async job queue (background feedback processing with Asynq)

**Metrics:**

- Feedback quality: >70% students rate 4-5 stars
- Feedback read rate: >85% (engagement)
- Student improvement: 15%+ accuracy gain per 10 questions

---

### **Feature 2: SIMPLE READINESS TRACKING**

**What Student Sees (Dashboard):**

```
┌─────────────────────────────────────────┐
│   📊 YOUR READINESS                     │
│   ████████░░░░░░░░░░ 62%                │
│                                         │
│   📈 Predicted Score: 650-700           │
│   ⏰ Ready by: Feb 10, 2026             │
│   ⚠️  3 weeks left                      │
│                                         │
│   TPS (Tes Potensi Skolastik):          │
│   • PU - Penalaran Umum: 68% ✓          │
│   • PPU - Peng. & Pemahaman: 65% ✓      │
│   • PBM - Bacaan & Menulis: 70% ✓       │
│   • PK - Peng. Kuantitatif: 55% ⚠️      │
│                                         │
│   LITERASI & PENALARAN:                 │
│   • LBI - Literasi B. Indo: 72% ✓       │
│   • LBE - Literasi B. Inggris: 58% ⚠️   │
│   • PM - Penalaran Matematika: 52% ⚠️   │
└─────────────────────────────────────────┘
```

**Formula (Simple, Transparent):**

```
Readiness = (Current Accuracy / Target 75%) × 100

Example:
- Current accuracy: 62%
- Target: 75%
- Readiness = (62 / 75) × 100 = 82.7%

Predicted Score Mapping:
- 50% readiness → 550-600 score
- 65% readiness → 600-650 score
- 80% readiness → 650-700 score
- 95% readiness → 700+ score

Ready Date Calculation:
- Current rate of improvement: +2% per week
- Current readiness: 62%
- Target: 75%
- Time needed: (75-62) / 2 = 6.5 weeks
- Ready by: Feb 10, 2026
```

**Why Simple is Better:**

- ✅ Easy to understand (no black-box ML)
- ✅ Transparent (student sees the math)
- ✅ Motivating ("Am I ready?" answered clearly)
- ✅ Fast to implement (2 hours coding)
- ✅ Accurate enough for MVP

**Metrics:**

- Dashboard check rate: >3x per week
- Readiness prediction accuracy: ±5% vs actual UTBK score
- Motivational effect: 20%+ improvement in engagement

---

### **Feature 3: UTBK-PATTERN QUESTIONS**

**Question Bank:**

```
Total: 1000+ questions (sesuai struktur UTBK resmi)

Distribution:
┌─────────────────────────────────────┬────────┬──────────────────────────┐
│ Subtest                             │ Count  │ Subtypes                 │
├─────────────────────────────────────┼────────┼──────────────────────────┤
│ TPS (Tes Potensi Skolastik)         │        │                          │
├─────────────────────────────────────┼────────┼──────────────────────────┤
│ PU - Penalaran Umum                 │ 150    │                          │
│ ├─ Penalaran Induktif               │ 50     │                          │
│ ├─ Penalaran Deduktif               │ 50     │                          │
│ └─ Penalaran Kuantitatif            │ 50     │                          │
│                                     │        │                          │
│ PPU - Pengetahuan & Pemahaman Umum  │ 100    │                          │
│ ├─ Pengetahuan Umum                 │ 50     │                          │
│ └─ Pemahaman Umum                   │ 50     │                          │
│                                     │        │                          │
│ PBM - Pemahaman Bacaan & Menulis    │ 100    │                          │
│ ├─ Pemahaman Bacaan                 │ 50     │                          │
│ └─ Kemampuan Menulis                │ 50     │                          │
│                                     │        │                          │
│ PK - Pengetahuan Kuantitatif        │ 100    │                          │
│ ├─ Aljabar                          │ 35     │                          │
│ ├─ Geometri                         │ 35     │                          │
│ └─ Statistika                       │ 30     │                          │
│                                     │        │                          │
├─────────────────────────────────────┼────────┼──────────────────────────┤
│ LITERASI & PENALARAN                │        │                          │
├─────────────────────────────────────┼────────┼──────────────────────────┤
│ LBI - Literasi Bahasa Indonesia     │ 100    │                          │
│ ├─ Membaca Kritis                   │ 50     │                          │
│ └─ Menulis Efektif                  │ 50     │                          │
│                                     │        │                          │
│ LBE - Literasi Bahasa Inggris       │ 100    │                          │
│ ├─ Reading Comprehension            │ 50     │                          │
│ └─ Grammar & Vocabulary             │ 50     │                          │
│                                     │        │                          │
│ PM - Penalaran Matematika           │ 100    │                          │
│ ├─ Penalaran Aljabar                │ 35     │                          │
│ ├─ Penalaran Geometri               │ 35     │                          │
│ └─ Penalaran Data & Statistik       │ 30     │                          │
│                                     │        │                          │
├─────────────────────────────────────┼────────┼──────────────────────────┤
│ TOTAL                               │ 750+   │                          │
└─────────────────────────────────────┴────────┴──────────────────────────┘

Catatan: Jumlah soal per subtest di UTBK sebenarnya:
- PU: 30 soal (Induktif 10, Deduktif 10, Kuantitatif 10)
- PPU: 20 soal
- PBM: 20 soal
- PK: 20 soal
- LBI: 20 soal
- LBE: 20 soal
- PM: 20 soal
Total: 150 soal per ujian
```

**Question Authenticity Checklist:**

- ✅ Sentence structure matches real UTBK
- ✅ Reading length authentic (250-500 words for passages)
- ✅ Question types match exam patterns
- ✅ Vocabulary level A2-B2 CEFR
- ✅ Difficulty calibrated via IRT
- ✅ Two independent reviewers approved

**Question Curation Timeline:**

```
Week 1-2: Analyze 300+ real UTBK questions
Week 2-4: Generate/curate 500-600 questions
Week 4-6: 2-reviewer validation
Week 5-6: IRT calibration (assign difficulty)

Result: 500-600 validated questions ready by Week 6
Cost: Rp 5-10M (teacher validation)
```

**Metrics:**

- Question quality: 0 ambiguous questions (2-reviewer approved)
- Authenticity: >90% student agreement ("feels like real UTBK")
- Difficulty spread: Even distribution across IRT difficulty range

---

## 🏗️ TECHNICAL ARCHITECTURE (UPDATED)

### **Tech Stack - REVISED**

**Frontend:**

- Framework: TanStack Start (React 19 + TypeScript, full-stack capabilities)
- Styling: TailwindCSS
- State: TanStack Query (data fetching) + TanStack Router
- UI: Custom components + shadcn/ui
- Forms: React Hook Form + Zod
- Authentication: Clerk (frontend integration)
- Deployment: Vercel (serverless)

**Backend:**

- Language: Go (Golang) 1.23+
- Framework: Echo (lightweight, fast HTTP framework)
- Database: PostgreSQL 16+ with pgx driver
- Monitoring: New Relic (APM, error tracking, infrastructure monitoring)
- ORM/Query: sqlc (type-safe SQL)
- Authentication: Clerk (server-side validation)
- Async Jobs: Asynq (task queue for LLM calls, notifications)
- Caching: Redis (session management, rate limiting, theta caching)
- Email: Resend (transactional emails, password reset, notifications)
- Deployment: Railway, Render, or DigitalOcean (cheap VPS with Docker)

**AI/ML:**

- Feedback Model: Best-in-class selection (see AI Model Selection section)
- Algorithm: IRT (Item Response Theory) custom implementation in Go
- LLM Prompting: Careful prompt engineering + iteration

**Infrastructure:**

- Backend Hosting: Railway/Render/DO (Rp 500K-1.5M/month, vs AWS Rp 5-10M)
- Frontend Hosting: Vercel (generous free tier, then pay-as-you-go)
- Database: Managed PostgreSQL 16+ (Railway/Render/Supabase, Rp 1-3M/month)
- Redis: Managed Redis (Railway/Upstash, Rp 500K-1M/month)
- Auth: Clerk (Rp 0 for MVP tier, pay-per-user at scale)
- Email: Resend (Rp 0 for 100 emails/day, then pay-as-you-go)
- Storage: S3 or Backblaze B2 (cheap object storage, Rp 100K-500K/month)
- Monitoring: New Relic (APM, logs, infrastructure) - free tier available

**Payment:**

- Gateway: Midtrans (local, cheaper, Indonesian-optimized) or Stripe
- Webhook Handling: Built into Echo backend

### **Cost Optimization Strategy - Golang Advantage**

```
Frontend Hosting:
├─ Vercel: Free tier + pay-as-you-go (~Rp 0-500K/month)
└─ TanStack Start handles full-stack

Backend Hosting (Golang = HUGE savings):
├─ Railway: Rp 500K-1M/month for Golang app
├─ Render: Rp 500K-2M/month (includes free tier)
├─ DigitalOcean VPS: Rp 500K-2M/month (full control)
└─ Comparison: Node.js NestJS would cost 3-5x more

Database:
├─ Managed PostgreSQL: Rp 1-3M/month
├─ Supabase: Rp 0-2M/month (generous free tier)
└─ Self-managed on VPS: Rp 500K (included in VPS)

Cache/Session:
├─ Upstash Redis (serverless): Rp 500K-1M/month
├─ Railway Redis: Rp 500K/month
└─ Redis on VPS: Rp 0 (included)

Total Backend Costs (with Golang):
├─ Lean setup: Rp 2-5M/month
├─ Generous setup: Rp 5-8M/month
└─ Comparison to Node.js: Would be Rp 10-20M/month

SAVINGS: 50-75% less than Node.js backend infrastructure
```

### **System Architecture Diagram**

```
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND (TanStack Start)                  │
│  ┌──────────────┬──────────────┬──────────────┐            │
│  │ Auth Screen  │ Practice UI   │ Dashboard    │            │
│  │ (Clerk)      │ Question      │ Readiness    │            │
│  │              │ + Feedback    │ Stats        │            │
│  └──────────────┴──────────────┴──────────────┘            │
└────────────────────┬─────────────────────────────────────────┘
                     │ HTTPS/REST API
┌────────────────────▼─────────────────────────────────────────┐
│                   BACKEND (Go + Echo)                        │
│  ┌──────────────────────────────────────────────────┐       │
│  │  Auth Service      (Clerk JWT validation)        │       │
│  │  Question Service  (fetch, filter via pgx)       │       │
│  │  Attempt Service   (save answers, fast inserts)  │       │
│  │  IRT Service       (calculate theta, select Q)   │       │
│  │  Feedback Service  (LLM API integration + cache) │       │
│  │  Readiness Service (calculate + predict)         │       │
│  │  Payment Service   (Midtrans integration)        │       │
│  │  Job Queue Service (Asynq for async tasks)       │       │
│  │  Email Service     (Resend for transactional)    │       │
│  └──────────────────────────────────────────────────┘       │
└────────────┬──────────────┬──────────────┬──────────────────┘
             │              │              │
    ┌────────▼──────┐  ┌───▼──────────┐  ┌▼─────────────────┐
    │  PostgreSQL   │  │ Redis Cache  │  │ LLM API Provider│
    │  (Users,      │  │ (Sessions,   │  │ (OpenAI/Mistral│
    │   Questions,  │  │  Theta,      │  │ /OpenRouter)   │
    │   Attempts)   │  │  Rate limit) │  └────────────────┘
    └───────────────┘  └──────────────┘
          ↓                    ↓                    ↓
    ┌────────────┐      ┌──────────┐      ┌──────────────┐
    │ Asynq Jobs │      │ Resend   │      │ Midtrans     │
    │ (Feedback  │      │ (Email)  │      │ (Payments)   │
    │ generation)│      └──────────┘      └──────────────┘
    └────────────┘
```

---

## 🤖 AI MODEL SELECTION FOR FEEDBACK GENERATION

### **Three Tier Strategy**

**The Challenge:** Need best feedback quality while managing costs at scale

**Solution:** Multi-tier model selection based on:

1. Feedback complexity
2. User tier (free vs premium)
3. Cost optimization
4. Latency requirements

### **Option 1: OpenAI (Best Quality, Highest Cost)**

**Model:** GPT-4o mini or GPT-4 turbo  
**Cost:** $0.015-0.03 per feedback (Rp 240-480 per feedback)

**Pros:**

- ✅ Best feedback quality (most consistent)
- ✅ Best reasoning for complex problems
- ✅ Strong contextual understanding
- ✅ Best for edge cases

**Cons:**

- ❌ Highest cost per request
- ❌ At scale: Rp 600K-1.2M/day (1000+ feedbacks/day)
- ❌ Overkill for simple mistakes

**Best For:**

- Premium users (willing to pay more)
- Complex reading comprehension questions
- Strategy-heavy feedback

**Implementation:**

```go
// openai/feedback.go
func GenerateFeedback(ctx context.Context, attempt *models.Attempt) (string, error) {
    client := openai.NewClient(os.Getenv("OPENAI_API_KEY"))

    resp, err := client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
        Model: "gpt-4o-mini",
        Messages: []openai.ChatCompletionMessage{
            {
                Role: "system",
                Content: systemPrompt, // Detailed UTBK tutor prompt
            },
            {
                Role: "user",
                Content: userPrompt, // Attempt + question data
            },
        },
        Temperature: 0.7,
        MaxTokens: 150,
    })
    return resp.Choices[0].Message.Content, err
}
```

---

### **Option 2: Mistral (Best Value, Good Quality)**

**Model:** mistral-small-latest or mistral-large  
**Cost:** $0.0014-0.006 per feedback (Rp 22-96 per feedback)

**Pros:**

- ✅ 10-15x cheaper than OpenAI
- ✅ Good quality for most use cases
- ✅ Fast response times
- ✅ Strong on Indonesian language

**Cons:**

- ⚠️ Slightly less consistent than GPT-4
- ⚠️ Sometimes verbose (need prompt tuning)

**Best For:**

- Default feedback for most questions
- Cost-conscious deployment
- Large scale (1000+ feedbacks/day)

**Implementation:**

```go
// mistral/feedback.go
func GenerateFeedback(ctx context.Context, attempt *models.Attempt) (string, error) {
    client := mistral.NewClient(os.Getenv("MISTRAL_API_KEY"))

    resp, err := client.Chat(ctx, &mistral.ChatRequest{
        Model: "mistral-small-latest",
        Messages: []mistral.Message{
            {
                Role: "system",
                Content: systemPrompt,
            },
            {
                Role: "user",
                Content: userPrompt,
            },
        },
        Temperature: 0.7,
        MaxTokens: 150,
    })
    return resp.Choices[0].Message.Content, err
}
```

---

### **Option 3: OpenRouter (Flexibility, Decent Costs)**

**Models:** Claude 3.5 Sonnet, Llama 3.1, GPT-4, Mistral, etc.  
**Cost:** $0.003-0.015 per feedback (Rp 48-240 per feedback, varies by model)

**Pros:**

- ✅ Access to 100+ models via single API
- ✅ A/B test different models easily
- ✅ Fallback to cheaper model if expensive one fails
- ✅ Good Indonesian support across models
- ✅ Rate limiting handled by OpenRouter

**Cons:**

- ⚠️ Slight latency increase (routing overhead)
- ⚠️ Model performance varies

**Best For:**

- Experimentation phase (MVP)
- A/B testing feedback quality
- Flexible fallback strategy

**Implementation:**

```go
// openrouter/feedback.go
func GenerateFeedback(ctx context.Context, attempt *models.Attempt, modelRoute string) (string, error) {
    client := openrouter.NewClient(os.Getenv("OPENROUTER_API_KEY"))

    models := map[string]bool{
        "claude": true,      // Claude 3.5 Sonnet (best reasoning)
        "gpt4": true,        // GPT-4 (high quality)
        "mistral": true,     // Mistral (cost-effective)
        "llama": true,       // Llama 3.1 (open-source quality)
    }

    resp, err := client.ChatCompletion(ctx, &openrouter.ChatCompletionRequest{
        Model: selectModel(modelRoute, attempt),
        Messages: []openrouter.Message{...},
        Temperature: 0.7,
        MaxTokens: 150,
    })
    return resp.Choices[0].Message.Content, err
}

// Smart model selection based on question complexity
func selectModel(route string, attempt *models.Attempt) string {
    if attempt.Question.Complexity == "high" {
        return "openrouter/anthropic/claude-3.5-sonnet" // Best for complex
    }
    return "openrouter/mistral/mistral-small" // Cost-effective
}
```

---

### **RECOMMENDATION: Hybrid Strategy (Best of All Worlds)**

**For MVP Launch:**

```
Question Difficulty & Cost Optimization:

FREE TIER (Limited):
├─ Simple questions (vocab, basic math): Mistral small
├─ Cost: ~Rp 22 per feedback
└─ Quality target: 3.5/5 stars

PREMIUM TIER (Unlimited):
├─ Easy questions: Mistral small (Rp 22/feedback)
├─ Medium questions: Mistral large (Rp 96/feedback)
├─ Hard questions: Claude via OpenRouter (Rp 240/feedback)
├─ Critical errors: GPT-4o mini (Rp 240/feedback)
└─ Average cost: Rp 50-80/feedback

Smart Routing Logic:
├─ If question complexity == HIGH
│  └─ Use best model (OpenRouter Claude)
├─ Else if user == premium
│  └─ Use good model (Mistral large)
└─ Else
   └─ Use fast model (Mistral small)

Daily Cost Projection (1000 feedbacks/day):
├─ Free tier only: Rp 22K/day = Rp 660K/month
├─ 60% free, 40% premium: Rp 45K/day = Rp 1.35M/month
├─ Current backend cost: Rp 5M/month
├─ LLM cost allocation: Rp 1.35M/month
└─ Total: Rp 6.35M/month (still very affordable)
```

**Migration Path to Scale:**

```
Month 1-2 (MVP): Mistral only (learn, optimize prompts)
  ├─ Cost: Rp 500K-1M/month
  └─ Quality: 70%+ satisfaction

Month 3 (Growth): Add OpenRouter as fallback
  ├─ Use Mistral for 80%, Claude for 20% (complex)
  └─ Cost: Rp 1-2M/month

Month 4-6 (Scaling): Full hybrid routing
  ├─ Mistral small (50%), Mistral large (30%), Claude (20%)
  └─ Cost: Rp 1.5-2.5M/month (at 10K DAU)

Month 6+ (Profitability): Fine-tune cheaper models
  ├─ Consider open-source models (Llama 3.1 via OpenRouter)
  ├─ Custom fine-tuned model on OpenRouter
  └─ Projected cost: Rp 1-1.5M/month (at 50K DAU)
```

---

## 📱 USER INTERFACE & EXPERIENCE

### **Key Screens (Simplified)**

#### **1. Login/Signup**

```
┌──────────────────────────┐
│   GENTA                  │
│                          │
│ [LOGIN WITH CLERK]       │
│                          │
│ Email/SSO/OAuth options  │
│ (GitHub, Google, Apple)  │
└──────────────────────────┘
```

#### **2. Onboarding (Exam Setup) - 2 Steps Only**

```
Step 1:
┌──────────────────────────────────┐
│ Halo! Mau masuk PTN mana? 🎯     │
│                                  │
│ Target PTN: [Pilih: UI/ITB/...]  │
│ Target Score: [Slider: 550-750]  │
│                                  │
│           [LANJUT]               │
└──────────────────────────────────┘

Step 2:
┌──────────────────────────────────┐
│ Kapan UTBK-nya? 📅               │
│                                  │
│ Tanggal Ujian: [Date picker]     │
│ Jam Belajar/Minggu: [5-20 jam]   │
│                                  │
│           [MULAI BELAJAR]        │
└──────────────────────────────────┘
```

**Why 2 steps only:**

- Tidak ribet, langsung ke inti
- Data yang dikumpulkan cukup untuk personalisasi
- IRT algorithm akan otomatis menyesuaikan difficulty
- User bisa langsung mulai practice

#### **3. Practice Screen**

```
┌───────────────────────────────────┐
│ PU | Q 5 of ∞ | ████░░ Medium    │
├───────────────────────────────────┤
│ Dua frasa berikut memiliki makna  │
│ yang paling dekat...               │
│                                   │
│ ○ A) Kembali + Balik             │
│ ○ B) Pergi + Pindah              │
│ ○ C) Tiba + Sampai ← (correct)   │
│ ○ D) Tinggal + Diam              │
│ ○ E) Ambil + Pegang              │
│                                   │
│ ⏱ 00:32s  [SUBMIT]               │
└───────────────────────────────────┘
```

#### **4. Feedback Screen**

```
┌───────────────────────────────────┐
│ ✅ CORRECT! (32 seconds)          │
│                                   │
│ Your answer: C) Tiba + Sampai    │
│                                   │
│ 💡 AI Tutor Feedback:             │
│ "Great! These two words are       │
│  true synonyms. Both mean the     │
│  same thing in Indonesian!        │
│                                   │
│  Notice: Similar-sounding words   │
│  (homophone) are tricky. Always   │
│  check: Do they mean the SAME?   │
│  Or just SOUND similar?"          │
│                                   │
│ [NEXT QUESTION]                   │
└───────────────────────────────────┘
```

#### **5. Dashboard**

```
┌─────────────────────────────────────────┐
│ Hello, Rina! 👋                         │
├─────────────────────────────────────────┤
│ 📊 YOUR READINESS: 68%                  │
│ ██████████░░░░░░░░ (target 75)          │
│ Predicted: 670-720 ✓                    │
│ Ready by: Feb 8, 2026                   │
│                                         │
│ TPS (Tes Potensi Skolastik):            │
│ PU: 72% ✓   PPU: 65% ✓                  │
│ PBM: 70% ✓  PK: 55% ⚠️                  │
│                                         │
│ LITERASI & PENALARAN:                   │
│ LBI: 75% ✓  LBE: 58% ⚠️  PM: 52% ⚠️    │
│                                         │
│ SESSION STATS:                          │
│ Today: 12 questions | 83% acc           │
│ Week: 87 questions | 71% acc            │
│                                         │
│ [START PRACTICE] [VIEW HISTORY]         │
└─────────────────────────────────────────┘
```

---

## 📊 SUCCESS METRICS & KPIs

### **User Engagement**

```
Metric                      Target      Measurement
────────────────────────────────────────────────────
Daily Active Users (DAU)    250+ (Week 1)    >80% users use 3x/week
Session Length              25-35 min        Average session duration
Questions/Session           20-30 Q          Typical practice count
Feedback Read Rate          >85%             % viewing full feedback
7-Day Retention             28%+             % users back within 7d
30-Day Retention            18%+             % users back within 30d
NPS (Net Promoter Score)    15+              Would recommend score
```

### **Learning Outcomes**

```
Metric                           Target          Measurement
──────────────────────────────────────────────────────────────
Accuracy Improvement/10 Q        +2-3%           Trend analysis
Readiness Prediction Accuracy    ±5% vs UTBK     Post-exam validation
Feedback Quality Rating          4.2/5.0 stars   👍/👎 thumbs rating
Student Confidence Gain          +25%            Pre/post survey
```

### **Business Metrics**

```
Metric                      Target (Month 3)    Measurement
────────────────────────────────────────────────────────────
Signups                     10,000+             Marketing trackable
Premium Conversion          8-12%               (free-to-paid)
Premium Subscribers         800-1,200           Active subscriptions
Monthly Recurring Revenue   Rp 120-180M         Chargeable MRR
Customer Acquisition Cost   <Rp 50K             Marketing spend / signups
Churn Rate                  <5%/month           Cancellations/month
Customer Lifetime Value     >Rp 2.5M            LTV formula
```

### **Technical Metrics**

```
Metric                      Target              Measurement
────────────────────────────────────────────────────────────
API Response Time           <100ms              P95 latency (Golang)
Feedback Generation Time    <2 seconds          LLM API + processing
System Uptime               99.5%+              Availability monitoring
Error Rate                  <0.1%                5xx errors / total
Mobile Performance (LCP)    <2.5s               Lighthouse score
Cost per MAU                <Rp 500/user        Infrastructure + API
```

---

## 📅 TIMELINE & ROADMAP

### **Phase 1: MVP (January 2026 - Launch)**

**Week 0-1: Foundation (Parallel hiring + setup)**

- Golang backend setup (Echo scaffolding)
- TanStack Start frontend setup
- PostgreSQL + Clerk integration
- CI/CD pipeline (GitHub Actions + Railway/Render)
- Hiring: 1 Golang engineer + 1 Frontend engineer + 1 content lead

**Week 2-3: Core Features**

- User auth (Clerk integration, JWT validation)
- Question CRUD via pgx
- IRT algorithm implementation
- Dashboard layout
- Basic analytics

**Week 4-5: AI Feedback Engine** ⭐

- LLM API integration (Mistral or OpenRouter)
- Prompt engineering + testing
- Asynq job queue for async feedback generation
- Feedback caching in Redis
- Quality assurance

**Week 6-7: Polish & Launch**

- Mobile responsiveness
- Bug fixes
- Performance optimization (Golang = super fast)
- Beta testing (50 users)
- Production deployment to Railway/Render

**Launch Metrics:**

- 500-1K signups (influencer seeding)
- 100-120 premium subscribers
- 70%+ feedback quality rating

---

### **Phase 2: Growth (February-June 2026)**

**Features:**

- School partnerships (B2B licensing)
- Mobile web optimization (PWA)
- Advanced Resend email marketing (newsletters, digests)
- Extended video explanations consideration
- Performance optimizations

**Infrastructure:**

- Scale Golang backend horizontally (cheap in Go)
- Upgrade Redis tier if needed
- PostgreSQL optimization (indexing, replication)

**Business:**

- 10,000+ signups
- 800-1,200 premium subs
- 5-10 school partnerships
- Rp 120-180M MRR

---

### **Phase 3: Scale (July-December 2026)**

**Features:**

- CPNS exam prep (new module)
- Live tutoring marketplace (if metrics support)
- Community features
- International expansion prep

**Business:**

- 50,000+ signups
- 2,500 premium subs
- 20+ schools
- Rp 450M+ ARR
- Profitability path

---

## 💰 FINANCIAL PLAN (UPDATED WITH GOLANG SAVINGS)

### **Pricing Model**

**Free Tier:**

- 10 questions/day (limited practice)
- Basic feedback (summary only)
- No readiness predictions
- Ads supported

**Premium Tier (Rp 149K/month):**

- Unlimited questions
- Full AI feedback (best-in-class model)
- Readiness tracking + predictions
- No ads
- Priority support
- Dark mode

**Premium Plus (TBD Phase 2):**

- Everything in Premium
- Personalized study plan
- Weekly progress report
- Live Q&A sessions
- Rp 299K/month (TBD)

### **Cost Structure (GOLANG OPTIMIZED)**

```
MONTHLY OPERATING COSTS:

PAYROLL (55% of budget - 1 fewer engineer):
├─ Golang Backend Engineer (1x): Rp 200-300K
├─ Frontend Engineer (1x): Rp 150-250K
├─ Content Lead (1x): Rp 50-80K
└─ Subtotal: Rp 500-700K/month

INFRASTRUCTURE (15% of budget - Major Golang savings):
├─ Backend (Railway/Render): Rp 500K-1.5M
├─ Database (Managed PostgreSQL): Rp 1-2M
├─ Redis Cache: Rp 500K-1M
├─ Frontend (Vercel): Rp 0-500K
└─ Subtotal: Rp 2.5-5M/month

API COSTS (15% of budget):
├─ Feedback LLM (Mistral/OpenRouter): Rp 1-2M
├─ Resend (Email): Rp 200K
├─ Clerk Auth: Rp 0 (generous free tier)
└─ Subtotal: Rp 1.2-2.2M/month

MARKETING (10% of budget):
├─ Influencer seeding: Rp 5-10M (launch)
├─ Social ads: Rp 5-10M (ongoing)
└─ Subtotal: Rp 5-10M/month

OTHER (5% of budget):
├─ Tools (GitHub, etc): Rp 500K
├─ Monitoring (New Relic): Rp 500K (free tier available)
├─ Contingency: Rp 1M
└─ Subtotal: Rp 2M/month

TOTAL: Rp 11-19M/month

BREAKDOWN BY STAGE:
├─ MVP Phase: Rp 11-15M/month
├─ Growth Phase: Rp 13-18M/month
└─ Scale Phase: Rp 15-22M/month (with more features)

Comparison (Node.js would cost):
├─ Vercel + Railway: Rp 15-20M/month
├─ With infrastructure scaling: Rp 20-30M/month
└─ SAVINGS with Golang: 30-40% reduction
```

### **Revenue Projections**

```
MONTH 1 (Jan 2026 - Launch):
├─ Signups: 1,000
├─ Premium: 80-120 subs
├─ MRR: Rp 12-18M
├─ Costs: Rp 13-15M
└─ Net: -Rp 1-3M (launch month)

MONTH 3 (Mar 2026 - After promo):
├─ Signups: 10,000+
├─ Premium: 800-1,200 subs
├─ MRR: Rp 120-180M
├─ Costs: Rp 14-16M
├─ School partnerships: 5-10 schools
└─ Net: +Rp 100-160M

MONTH 6 (Jun 2026):
├─ Signups: 25,000+
├─ Premium: 1,500-2,000 subs
├─ MRR: Rp 225-300M
├─ Costs: Rp 15-18M
├─ School revenue: Rp 50-100M
└─ Net: +Rp 250-400M

YEAR 1 (Jun 2025-Dec 2026):
├─ Total signups: 50,000+
├─ Premium subs: 2,500+
├─ ARR: Rp 450M+
├─ School revenue: Rp 200M+
├─ Total revenue: Rp 650M+
├─ Profitability: Achieving (Month 18+)
└─ Note: Golang reduced infrastructure by 30-40%
```

### **Unit Economics**

```
Revenue per Premium User:
├─ Price: Rp 149K/month
├─ Annual: Rp 1.788M
├─ Lifetime (18 months): Rp 2.682M

Cost per User (Infrastructure):
├─ Backend: Rp 500 (shared Golang app)
├─ Database: Rp 300 (PostgreSQL row)
├─ Redis: Rp 200 (cache hit)
├─ LLM: Rp 50-100 (feedback generation)
└─ Total per transaction: Rp 1,000-1,200

CAC (Customer Acquisition Cost):
├─ Influencer seeding: Rp 50K-100K per signup
├─ Organic/word-of-mouth: Rp 5K-10K
├─ School partnerships: Rp 2K-5K
└─ Average target: <Rp 50K

LTV/CAC Ratio:
├─ LTV: Rp 2.682M (18 months)
├─ CAC: Rp 50K
└─ Ratio: 53.6x (EXCELLENT - target >3x)

Payback Period:
├─ Revenue: Rp 149K/month
├─ CAC: Rp 50K
└─ Payback: ~3.4 months (STRONG)
```

---

## 🚀 GO-TO-MARKET STRATEGY

### **Pre-Launch (Week 1-2)**

```
Influencer Seeding:
├─ Target: 5-10 YouTube creators (100K+ subs, UTBK focus)
├─ Offer: Free 1-month premium + affiliate commission (Rp 50K per paid signup)
├─ Content: Review video showing AI feedback in action
├─ Expected: 500-1K signups from seeding

School Partnerships:
├─ Target: 15-20 top SMAN (Jakarta, Surabaya, Medan, Bandung)
├─ Offer: Free access for all students (limited time)
├─ Pitch: "This is THE UTBK prep tool with AI feedback"
├─ Expected: 2-3K student signups

Early Adopters:
├─ Reddit: r/Indonesia, r/UTBK communities
├─ TikTok: Short clips of feedback in action (10-20 seconds)
├─ Twitter/X: Join UTBK prep discussions
├─ Expected: 200-500 organic signups
```

### **Post-Launch (Month 1-3)**

```
Content Marketing:
├─ Blog 1: "Kenapa AI Feedback > Modul Statis?"
├─ Blog 2: "Data-Driven UTBK Strategies (dengan data real)"
├─ Blog 3: "How 70% of Our Users Improved 15%+ in 2 Weeks"
├─ SEO target: "UTBK prep", "soal UTBK", "latihan UTBK"
├─ Expected: 300+ organic traffic/month

Paid Ads:
├─ TikTok/Instagram: "Personal AI tutor for UTBK"
├─ Google Ads: High-intent keywords
├─ Target CAC: <Rp 50K
├─ Budget: Rp 5-10M/month

Referral Program:
├─ Offer: Rp 50K for each friend who upgrades to premium
├─ Viral coefficient: Target 1.5x
├─ Expected: 10-15% of signups from referrals
```

---

## 🔍 ASSUMPTIONS & CONSTRAINTS

### **Key Assumptions**

```
✓ AI feedback quality will drive retention (critical)
✓ Hybrid model strategy (Mistral + OpenRouter) will balance cost/quality
✓ Golang backend will reduce costs by 30-40% vs Node.js
✓ Clerk auth will simplify user management
✓ Students prefer feedback over video content
✓ LLM can generate quality feedback <2s with good prompts
✓ IRT algorithm will personalize difficulty effectively
✓ Rp 149K/month is sweet spot for conversion
✓ Indonesian edu market ready for AI tutors
✓ 15-20% of UTBK takers are digital-first
```

### **Technical Constraints**

```
⚠️ LLM quality variance (depends on prompt engineering)
⚠️ IRT calibration needs 100+ attempts per question
⚠️ Golang learning curve (if team new to it)
⚠️ Database scale for 100K+ users (need optimization)
⚠️ Real-time calculation for readiness predictions
⚠️ Asynq job queue latency (async feedback)
```

### **Market Constraints**

```
⚠️ Bimbel market fragmented (low barriers to entry)
⚠️ Free content abundance (YouTube, Khan Academy)
⚠️ Student churn post-exam (need retention features)
⚠️ School partnerships: slow sales cycle
⚠️ Competition ramping (others will copy)
```

### **Mitigation Strategies**

```
AI Quality:
├─ Weekly prompt optimization based on feedback
├─ A/B test different LLM models via OpenRouter
├─ Human review of 10% sample
└─ Fallback chain: GPT-4 → Claude → Mistral

Golang Learning:
├─ Hire experienced Golang engineer
├─ Use well-tested libraries (Echo, pgx, sqlc)
├─ Reference: production Golang projects
└─ Time buffer for learning curve: +2 weeks

IRT Calibration:
├─ Start with pre-calibrated questions (expert-vetted)
├─ Dynamic recalibration as user data grows
└─ Fallback to difficulty zones if insufficient data

Churn Prevention:
├─ Phase 2: Video solutions + community
├─ Phase 2: Live tutoring marketplace
└─ Engagement: Daily challenges, streaks

Competitive Moat:
├─ Feedback quality = hard to copy (proprietary prompts)
├─ User data = IRT algorithm improves with scale
├─ First-mover advantage in feedback space
└─ Network effects (school partnerships)
```

---

## 👥 TEAM & RESOURCES (GOLANG-FOCUSED)

### **Hiring Requirements**

**Role 1: Golang Backend Engineer** (CRITICAL HIRE)

- Stack: Golang (1.23+), Echo, PostgreSQL, pgx, Asynq, Redis
- Experience: 2+ years Golang, preferably in startups
- Must have: Production Golang experience
- Nice to have: Experience with IRT algorithms, LLM integration
- Salary: Rp 200-300K/month
- Start: Immediately (Week 0)

**Role 2: Frontend Engineer (TanStack Start)**

- Stack: TanStack Start, React 19, TypeScript, TailwindCSS
- Experience: 2+ years modern React
- Must have: TypeScript fluency
- Nice to have: TanStack Router, query optimization
- Salary: Rp 150-250K/month
- Start: Immediately (Week 0)

**Role 3: Content Lead**

- UTBK expertise + project management
- Coordinate 2-reviewer question validation
- Manage IRT calibration
- Salary: Rp 50-80K/month (flexible)
- Start: Immediately (Week 0)

**You: Founder/Product Manager**

- Full-time
- Vision, strategy, customer feedback, fundraising
- Equity-focused
- Help with backend (if you want to learn Golang)

### **Other Resources**

- 5-10 question reviewers (contractors): Rp 100-200K per 50 questions
- Design system: Use TailwindCSS + shadcn/ui (no full-time designer needed)
- DevOps: Configure Railway/Render CI/CD (can do yourself initially)

---

## 🎓 RISKS & MITIGATION

### **Risk 1: Golang Engineer Hiring (NEW)**

**Risk:** Hard to find good Golang engineers in Indonesia  
**Probability:** High  
**Impact:** High (project delayed)

**Mitigation:**

- Start hiring ASAP (Week -2)
- Consider remote hiring (Singapore, Thailand)
- Offer equity + learning opportunity
- Have Node.js backup candidate just in case
- Partner with Golang communities

---

### **Risk 2: AI Feedback Quality Issues**

**Risk:** LLM generates low-quality or incorrect feedback  
**Probability:** Medium  
**Impact:** High (kills differentiation)

**Mitigation:**

- Use hybrid model strategy (Mistral + Claude fallback)
- Weekly feedback quality review (human experts)
- A/B test different prompts via OpenRouter
- User feedback rating system (👍/👎)
- Fallback: Show standard explanation if confidence <60%

---

### **Risk 3: Competitive Response**

**Risk:** Zenius/Ruangguru copy AI feedback feature  
**Probability:** High  
**Impact:** Medium (market share pressure)

**Mitigation:**

- Build feedback moat through quality + volume
- Acquire users fast in early months
- Network effects: more users = better feedback data
- Phase 2: Add features they can't easily copy (tutoring marketplace)

---

### **Risk 4: User Churn Post-Exam**

**Risk:** 80% churn after UTBK (March 2026)  
**Probability:** High  
**Impact:** High (revenue cliff)

**Mitigation:**

- Phase 2: Add CPNS exam prep (June 2026)
- Build school partnerships (recurring school revenue)
- Retention features: referral rewards, community
- Messaging: "Ace your university entrance exams"

---

### **Risk 5: Slow School Sales Cycle**

**Risk:** Schools slow to onboard/integrate  
**Probability:** High  
**Impact:** Medium (slower Phase 2 revenue)

**Mitigation:**

- Early proof-of-concept: 2-3 pilot schools (free)
- Student driver: viral from students → ask schools
- Simple school dashboard (Phase 2): minimal integration
- Flexible pricing: per-student, site license options

---

## 📋 SUCCESS CRITERIA (MVP LAUNCH)

### **Technical ✅**

- Golang backend responds <100ms (P95 latency)
- LLM feedback generated <2 seconds with good quality
- Mistral/OpenRouter integration working reliably
- Clerk authentication fully functional
- Asynq job queue processing feedback async
- Zero critical bugs in production (48-hour fix SLA)
- Database queries optimized (<200ms)

### **Product ✅**

- 25%+ users complete 3+ sessions (habit formation)
- 85%+ read full feedback (engagement)
- Feedback sentiment positive (85%+ 4-5 stars)
- Readiness predictions accurate within ±5% of actual UTBK
- IRT algorithm selecting appropriate difficulty

### **Business ✅**

- 1,000+ signups in first week
- 8-12% premium conversion rate
- 500 influencer signups
- 2,000 school signups
- NPS ≥15
- CAC <Rp 50K

### **Content ✅**

- 500-600 questions deployed
- 2-reviewer validated (zero ambiguous questions)
- IRT calibrated based on 100+ attempts/question
- Difficulty distribution even across range

### **Infrastructure ✅**

- Backend costs <Rp 2M/month (Golang efficiency)
- 99.5%+ uptime (Railway/Render reliability)
- LLM API costs <Rp 2M/month at scale
- Total OpEx <Rp 15M/month

---

## 📊 APPENDIX

### **Glossary**

- **CAT**: Computerized Adaptive Testing (difficulty adjusts per answer)
- **IRT**: Item Response Theory (model for question difficulty)
- **Theta**: Student ability score in IRT model
- **DAU**: Daily Active Users
- **MRR**: Monthly Recurring Revenue
- **Churn**: % of users/subscribers leaving per month
- **NPS**: Net Promoter Score (customer satisfaction metric)
- **TAM/SAM/SOM**: Total/Serviceable/Obtainable Addressable Market
- **Clerk**: Managed authentication service (SSO, social auth)
- **Asynq**: Task queue library for Golang (background jobs)
- **pgx**: PostgreSQL driver for Golang (type-safe)
- **Echo**: Lightweight HTTP framework for Golang
- **TanStack**: Modern React query/routing library ecosystem

### **Tech Stack Summary**

| Layer    | Old            | New                               | Benefit                   |
| -------- | -------------- | --------------------------------- | ------------------------- |
| Frontend | React + NestJS | TanStack Start                    | Full-stack, better DX     |
| Auth     | Firebase       | Clerk                             | Simpler, more features    |
| Backend  | Node.js/NestJS | Golang/Echo                       | 30-40% cost savings       |
| Database | Drizzle ORM    | pgx + sqlc                        | Type-safe SQL             |
| Queue    | Bull           | Asynq                             | Lightweight, fast         |
| Caching  | Redis          | Redis                             | Same, cheaper with Golang |
| Email    | Nodemailer     | Resend                            | Better transactional      |
| LLM      | Mistral        | Hybrid (Mistral/OpenRouter/GPT-4) | Better flexibility        |

### **References**

- Golang Best Practices: Echo documentation, CQRS patterns
- LLM Integration: OpenAI, Mistral, OpenRouter documentation
- IRT Algorithm: "Introduction to Item Response Theory" - Baker & Kim
- AI Feedback: Research on conversational agents in education
- Market Size: Statistics Kementerian Pendidikan Indonesia

### **Document Info**

- Document Owner: [Your Name] (Founder/PM)
- Last Updated: December 12, 2025
- Version: 2.0 (Tech Stack Updated)
- Status: Ready for Engineering
- Next Review: Post-launch (February 2026)

---

**END OF UPDATED PRD**

Ready for implementation with Golang + TanStack Start! 🚀
