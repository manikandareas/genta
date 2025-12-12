# 🗄️ GENTA - DATABASE DOCUMENTATION

**AI-Powered UTBK Prep Platform - Database Schema & Queries**  
**Version 1.0 | December 2025**

---

## 📋 TABLE OF CONTENTS

1. [Database Overview](#database-overview)
2. [Schema Design](#schema-design)
3. [Table Definitions](#table-definitions)
4. [Indexes & Performance](#indexes--performance)
5. [SQL Schema Creation](#sql-schema-creation)
6. [Sample Queries](#sample-queries)
7. [Performance Optimization](#performance-optimization)
8. [Backup & Maintenance](#backup--maintenance)

---

## 📊 DATABASE OVERVIEW

### **UTBK Subtests (7 Total)**

Database mendukung semua 7 subtest UTBK resmi:

| Kode | Nama Subtest                   | Kategori | Jumlah Soal |
| ---- | ------------------------------ | -------- | ----------- |
| PU   | Penalaran Umum                 | TPS      | 30          |
| PPU  | Pengetahuan dan Pemahaman Umum | TPS      | 20          |
| PBM  | Pemahaman Bacaan dan Menulis   | TPS      | 20          |
| PK   | Pengetahuan Kuantitatif        | TPS      | 20          |
| LBI  | Literasi Bahasa Indonesia      | Literasi | 20          |
| LBE  | Literasi Bahasa Inggris        | Literasi | 20          |
| PM   | Penalaran Matematika           | Literasi | 20          |

### **Database Type**

- **DBMS:** PostgreSQL 16+
- **Driver:** pgx (Go native driver)
- **Query Generator:** sqlc (type-safe SQL)
- **Connection Pooling:** pgx with min 5, max 25 connections
- **Encoding:** UTF-8 (full Indonesian character support)
- **Monitoring:** New Relic PostgreSQL integration

### **Design Principles**

```
✅ Normalization: 3NF for data integrity
✅ Scalability: Indexed for 100K+ users
✅ Performance: Denormalization where needed
✅ Type Safety: Strong ENUM types for states
✅ Audit Trail: created_at + updated_at on key tables
✅ Soft Deletes: is_deleted flag for data recovery
✅ Foreign Keys: Referential integrity enforced
```

### **Database Size Estimation**

```
Assumption: 50K users, 100K questions, 5M attempts

users table: 50K rows × ~2KB = ~100MB
questions table: 100K rows × ~3KB = ~300MB
attempts table: 5M rows × ~1KB = ~5GB
question_banks table: 100K rows × ~100B = ~10MB
user_readiness table: 50K rows × ~500B = ~25MB
feedback_cache table: 5M rows × ~800B = ~4GB (optional)

TOTAL: ~9.5-10GB (comfortable on managed PostgreSQL)
```

---

## 🏗️ SCHEMA DESIGN

### **Entity Relationship Diagram (Conceptual)**

```
┌─────────────────────────────────────────────────┐
│                    users                        │
│  ├─ id (PK)                                     │
│  ├─ email (UK)                                  │
│  ├─ clerk_id (UK)                               │
│  ├─ full_name                                   │
│  ├─ subscription_tier                           │
│  ├─ irt_theta (current ability)                 │
│  └─ created_at / updated_at                     │
└────────┬──────────────────────────────────────┘
         │ 1:N
         │
    ┌────▼────────────────────────────────────────┐
    │            user_readiness                   │
    │  ├─ user_id (FK, PK)                        │
    │  ├─ section (PU/PPU/PBM/PK/LBI/LBE/PM)      │
    │  ├─ current_accuracy                        │
    │  ├─ readiness_score                         │
    │  ├─ predicted_score                         │
    │  └─ ready_by_date                           │
    └────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│                 questions                       │
│  ├─ id (PK)                                     │
│  ├─ question_bank_id (FK)                       │
│  ├─ section (PU/PPU/PBM/PK/LBI/LBE/PM)          │
│  ├─ difficulty_irt                              │
│  ├─ text                                        │
│  ├─ options (A-E)                               │
│  ├─ correct_answer                              │
│  ├─ explanation                                 │
│  └─ created_at                                  │
└────────┬──────────────────────────────────────┘
         │ 1:N
         │
    ┌────▼──────────────────────────────────────┐
    │             attempts                       │
    │  ├─ id (PK)                                │
    │  ├─ user_id (FK)                           │
    │  ├─ question_id (FK)                       │
    │  ├─ selected_answer                        │
    │  ├─ is_correct                             │
    │  ├─ time_spent_seconds                     │
    │  ├─ user_theta_before                      │
    │  ├─ user_theta_after                       │
    │  ├─ feedback_generated                     │
    │  ├─ created_at                             │
    │  └─ deleted_at (soft delete)               │
    └────────────────────────────────────────────┘
         │ 1:1
         ├─────────────────────────────────────┐
         │                                     │
    ┌────▼───────────────────────┐  ┌─────────▼──────────────────┐
    │    feedback_cache           │  │  attempt_feedback           │
    │  ├─ attempt_id (PK, FK)    │  │  ├─ id (PK)               │
    │  ├─ feedback_text           │  │  ├─ attempt_id (FK)      │
    │  ├─ model_used              │  │  ├─ feedback_text         │
    │  ├─ generation_time_ms      │  │  ├─ feedback_quality      │
    │  ├─ created_at              │  │  ├─ helpful_rating        │
    │  └─ expires_at              │  │  └─ created_at            │
    └────────────────────────────┘  └─────────────────────────────┘
```

### **Table Grouping Strategy**

**Core Tables** (Critical for app functionality):

- users, questions, attempts, user_readiness

**Feature Tables** (Optional but important):

- attempt_feedback, question_banks, user_study_sessions

**Support Tables** (Payments):

- payment_subscriptions

**Note:** Error logging dan monitoring dihandle oleh New Relic, bukan database.

---

## 📝 TABLE DEFINITIONS

### **1. users**

Primary table for user management, integrated with Clerk.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url VARCHAR(500),

    -- Subscription & tier management
    subscription_tier VARCHAR(50) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'premium_plus')),
    subscription_start_date TIMESTAMP,
    subscription_end_date TIMESTAMP,
    is_subscription_active BOOLEAN DEFAULT false,

    -- IRT algorithm tracking
    irt_theta DECIMAL(5, 3) DEFAULT 0.0,  -- Current ability (typically -3 to +3)
    irt_variance DECIMAL(5, 3) DEFAULT 0.5,  -- Uncertainty in estimate
    irt_last_updated TIMESTAMP,

    -- User preferences (collected during onboarding)
    target_ptn VARCHAR(100),  -- UI, ITB, UNPAD, etc.
    target_score INTEGER,  -- 550-750
    exam_date DATE,
    study_hours_per_week SMALLINT,  -- 5-20
    onboarding_completed BOOLEAN DEFAULT false,

    -- Account status
    is_email_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP  -- Soft delete
);

-- Indexes
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);
```

---

### **2. questions**

UTBK question bank with IRT calibration.

```sql
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_bank_id UUID REFERENCES question_banks(id),

    -- Question metadata (7 subtests sesuai UTBK resmi)
    -- TPS: PU (Penalaran Umum), PPU (Pengetahuan & Pemahaman Umum),
    --      PBM (Pemahaman Bacaan & Menulis), PK (Pengetahuan Kuantitatif)
    -- Literasi: LBI (Literasi Bahasa Indonesia), LBE (Literasi Bahasa Inggris),
    --           PM (Penalaran Matematika)
    section VARCHAR(10) NOT NULL CHECK (section IN ('PU', 'PPU', 'PBM', 'PK', 'LBI', 'LBE', 'PM')),
    sub_type VARCHAR(50),  -- induktif, deduktif, kuantitatif, aljabar, geometri, etc.

    -- IRT calibration
    difficulty_irt DECIMAL(4, 2),  -- IRT difficulty parameter (-2 to +2 typically)
    discrimination DECIMAL(4, 3),  -- Item discrimination (0.3-1.5)
    guessing_param DECIMAL(4, 3),  -- Guessing probability (0-0.3, higher for MC)

    -- Question content
    text TEXT NOT NULL,  -- Main question/passage text
    option_a VARCHAR(500) NOT NULL,
    option_b VARCHAR(500) NOT NULL,
    option_c VARCHAR(500) NOT NULL,
    option_d VARCHAR(500) NOT NULL,
    option_e VARCHAR(500) NOT NULL,
    correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D', 'E')),

    -- Explanation & references
    explanation TEXT,  -- Why is this answer correct?
    explanation_en TEXT,  -- English version for backup
    strategy_tip TEXT,  -- Learning strategy
    related_concept VARCHAR(255),  -- e.g., "percentage_calculation"

    -- Step-by-step solution (optional, untuk soal math/kuantitatif)
    -- Format: [{"order": 1, "title": "Identifikasi", "content": "..."}, ...]
    solution_steps JSONB,

    -- Status
    is_active BOOLEAN DEFAULT true,  -- Soft delete flag

    -- Usage stats (denormalized for performance)
    attempt_count INTEGER DEFAULT 0,
    correct_rate DECIMAL(5, 3),  -- 0.00-1.00
    avg_time_seconds SMALLINT,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_questions_section ON questions(section);
CREATE INDEX idx_questions_sub_type ON questions(sub_type);
CREATE INDEX idx_questions_difficulty_irt ON questions(difficulty_irt);
CREATE INDEX idx_questions_question_bank_id ON questions(question_bank_id);
CREATE INDEX idx_questions_is_active ON questions(is_active);
CREATE INDEX idx_questions_section_difficulty ON questions(section, difficulty_irt);  -- Composite
```

---

### **3. attempts**

User answer attempts with IRT tracking (core table - most queried).

```sql
CREATE TABLE attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    question_id UUID NOT NULL REFERENCES questions(id),

    -- Answer data
    selected_answer CHAR(1) NOT NULL CHECK (selected_answer IN ('A', 'B', 'C', 'D', 'E')),
    is_correct BOOLEAN GENERATED ALWAYS AS (
        selected_answer = (SELECT correct_answer FROM questions WHERE id = question_id)
    ) STORED,
    time_spent_seconds SMALLINT NOT NULL,

    -- IRT tracking
    user_theta_before DECIMAL(5, 3),  -- Ability before this attempt
    user_theta_after DECIMAL(5, 3),  -- Ability after this attempt
    theta_change DECIMAL(5, 3),  -- How much did user's ability change?

    -- Feedback tracking
    feedback_generated BOOLEAN DEFAULT false,
    feedback_model_used VARCHAR(50),  -- 'mistral', 'openai', 'claude'
    feedback_generation_ms INTEGER,  -- How long did feedback take?
    feedback_helpful BOOLEAN,  -- User rating: helpful (true) or not helpful (false)

    -- Session context
    session_id VARCHAR(100),  -- Group of consecutive attempts
    attempt_number_in_session SMALLINT,  -- Position in session

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP  -- Soft delete
);

-- Indexes (CRITICAL for query performance)
CREATE INDEX idx_attempts_user_id ON attempts(user_id);
CREATE INDEX idx_attempts_question_id ON attempts(question_id);
CREATE INDEX idx_attempts_created_at ON attempts(created_at);
CREATE INDEX idx_attempts_is_correct ON attempts(is_correct);
CREATE INDEX idx_attempts_user_created ON attempts(user_id, created_at DESC);  -- Composite
CREATE INDEX idx_attempts_session_id ON attempts(session_id);

-- Partition for large table (if needed)
-- PARTITION BY RANGE (created_at)
```

---

### **4. user_readiness**

Denormalized readiness scores (updated frequently, read often).

```sql
CREATE TABLE user_readiness (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    section VARCHAR(10) NOT NULL,  -- PU, PPU, PBM, PK, LBI, LBE, PM (7 subtests UTBK)

    -- Accuracy metrics (last 10 attempts)
    recent_attempts_count INTEGER DEFAULT 0,
    recent_correct_count INTEGER DEFAULT 0,
    recent_accuracy DECIMAL(5, 3),  -- 0.00-1.00

    -- Overall metrics
    total_attempts_count INTEGER DEFAULT 0,
    total_correct_count INTEGER DEFAULT 0,
    overall_accuracy DECIMAL(5, 3),

    -- Readiness calculation
    current_theta DECIMAL(5, 3),  -- Current IRT ability
    target_theta DECIMAL(5, 3) DEFAULT 0.5,  -- What score does student need?
    readiness_percentage DECIMAL(5, 3),  -- 0-100%

    -- Prediction
    predicted_score_low INTEGER,  -- e.g., 650
    predicted_score_high INTEGER,  -- e.g., 700
    ready_by_date DATE,  -- When will student be ready?

    -- Trend analysis
    improvement_rate_per_week DECIMAL(5, 3),  -- How much accuracy improves per week?
    days_to_ready INTEGER,  -- Calculated from improvement_rate

    -- Last update
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by_job_id VARCHAR(100)  -- Track what job updated this
);

-- Composite Primary Key for section tracking
ALTER TABLE user_readiness ADD CONSTRAINT pk_user_readiness
    PRIMARY KEY (user_id, section);

-- Indexes
CREATE INDEX idx_readiness_readiness_percentage ON user_readiness(readiness_percentage DESC);
CREATE INDEX idx_readiness_last_updated ON user_readiness(last_updated DESC);
CREATE INDEX idx_readiness_section ON user_readiness(section);
```

---

### **5. attempt_feedback**

AI-generated feedback linked to attempts.

```sql
CREATE TABLE attempt_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL UNIQUE REFERENCES attempts(id),

    -- Feedback content
    feedback_text TEXT NOT NULL,
    feedback_lang VARCHAR(10) DEFAULT 'id',  -- 'id' or 'en'

    -- Quality metrics (binary rating: helpful or not)
    is_helpful BOOLEAN,  -- User rating: true = helpful (👍), false = not helpful (👎), null = not rated

    -- Generation metadata
    model_used VARCHAR(50) NOT NULL,  -- 'mistral', 'openai', 'claude'
    prompt_version VARCHAR(20),  -- Track prompt iterations
    generation_time_ms INTEGER,
    token_count_input INTEGER,
    token_count_output INTEGER,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_feedback_attempt_id ON attempt_feedback(attempt_id);
CREATE INDEX idx_feedback_is_helpful ON attempt_feedback(is_helpful);
CREATE INDEX idx_feedback_model_used ON attempt_feedback(model_used);
CREATE INDEX idx_feedback_created_at ON attempt_feedback(created_at DESC);
```

---

### **6. question_banks**

Metadata for question sets (e.g., "UTBK Real 2024", "Practice Set 1").

```sql
CREATE TABLE question_banks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Bank metadata
    name VARCHAR(255) NOT NULL,
    description TEXT,
    source VARCHAR(100),  -- 'official_utbk', 'practice_set', 'user_created'

    -- Content stats (7 subtests sesuai UTBK resmi)
    total_questions INTEGER DEFAULT 0,
    -- TPS (Tes Potensi Skolastik)
    questions_pu INTEGER DEFAULT 0,   -- Penalaran Umum
    questions_ppu INTEGER DEFAULT 0,  -- Pengetahuan & Pemahaman Umum
    questions_pbm INTEGER DEFAULT 0,  -- Pemahaman Bacaan & Menulis
    questions_pk INTEGER DEFAULT 0,   -- Pengetahuan Kuantitatif
    -- Literasi & Penalaran
    questions_lbi INTEGER DEFAULT 0,  -- Literasi Bahasa Indonesia
    questions_lbe INTEGER DEFAULT 0,  -- Literasi Bahasa Inggris
    questions_pm INTEGER DEFAULT 0,   -- Penalaran Matematika

    -- Review status
    is_reviewed BOOLEAN DEFAULT false,
    review_date DATE,
    reviewer_notes TEXT,

    -- IRT calibration status
    is_calibrated BOOLEAN DEFAULT false,
    calibration_date DATE,
    calibration_sample_size INTEGER,  -- How many attempts used for calibration?

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_question_banks_source ON question_banks(source);
CREATE INDEX idx_question_banks_is_reviewed ON question_banks(is_reviewed);
```

---

### **7. user_study_sessions**

Track continuous study sessions (for engagement analytics).

```sql
CREATE TABLE user_study_sessions (
    id VARCHAR(100) PRIMARY KEY,  -- session_id
    user_id UUID NOT NULL REFERENCES users(id),

    -- Session timing
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    duration_minutes SMALLINT,  -- Calculated from started_at to ended_at

    -- Session stats
    questions_attempted INTEGER DEFAULT 0,
    questions_correct INTEGER DEFAULT 0,
    accuracy_in_session DECIMAL(5, 3),

    -- Section focus
    section VARCHAR(10),  -- PU, PPU, PBM, PK, LBI, LBE, PM, or NULL for mixed

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_sessions_user_id ON user_study_sessions(user_id);
CREATE INDEX idx_sessions_started_at ON user_study_sessions(started_at DESC);
CREATE INDEX idx_sessions_created_at ON user_study_sessions(created_at DESC);
```

---

### **8. payment_subscriptions**

Subscription transactions (for Midtrans integration).

```sql
CREATE TABLE payment_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),

    -- Midtrans transaction
    midtrans_transaction_id VARCHAR(255) UNIQUE,
    midtrans_order_id VARCHAR(255) UNIQUE,

    -- Subscription details
    subscription_tier VARCHAR(50) NOT NULL,  -- 'premium', 'premium_plus'
    plan_duration_days INTEGER,  -- 30, 180, 365
    price_idr BIGINT NOT NULL,  -- In rupiah

    -- Status
    payment_status VARCHAR(50),  -- 'pending', 'success', 'failed', 'expired'
    subscription_start_date DATE,
    subscription_end_date DATE,

    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_payments_user_id ON payment_subscriptions(user_id);
CREATE INDEX idx_payments_midtrans_transaction_id ON payment_subscriptions(midtrans_transaction_id);
CREATE INDEX idx_payments_payment_status ON payment_subscriptions(payment_status);
CREATE INDEX idx_payments_subscription_end_date ON payment_subscriptions(subscription_end_date);
```

---

---

## 🔍 INDEXES & PERFORMANCE

### **Index Strategy**

```sql
-- PRIMARY KEY (automatic index)
-- All tables have 'id UUID PRIMARY KEY'

-- UNIQUE KEY indexes (data integrity)
CREATE UNIQUE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_attempt_feedback_attempt_id ON attempt_feedback(attempt_id);
CREATE UNIQUE INDEX idx_payments_midtrans_order_id ON payment_subscriptions(midtrans_order_id);

-- FOREIGN KEY indexes (automatic in PostgreSQL)
-- user_id, question_id, etc. referenced in WHERE clauses

-- RANGE/TIMESTAMP indexes (sorting, filtering)
CREATE INDEX idx_attempts_created_at ON attempts(created_at DESC);
CREATE INDEX idx_sessions_started_at ON user_study_sessions(started_at DESC);
CREATE INDEX idx_error_logs_created_at ON error_logs(created_at DESC);

-- COMPOSITE indexes (multi-column queries)
CREATE INDEX idx_attempts_user_created ON attempts(user_id, created_at DESC);
CREATE INDEX idx_questions_section_difficulty ON questions(section, difficulty_irt);
CREATE INDEX idx_user_readiness_ready_percentage ON user_readiness(readiness_percentage DESC);

-- FILTER/PARTIAL indexes (optional, for specific queries)
CREATE INDEX idx_users_active_premium ON users(id)
    WHERE is_active = true AND subscription_tier = 'premium';

CREATE INDEX idx_attempts_incorrect ON attempts(user_id, created_at DESC)
    WHERE is_correct = false;  -- Only index wrong answers (smaller index)

-- GIN indexes (for future full-text search on feedback)
CREATE INDEX idx_feedback_text_gin ON attempt_feedback USING gin(to_tsvector('indonesian', feedback_text));
```

### **Index Maintenance**

```sql
-- Check unused indexes
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY relpages DESC;

-- Reindex specific table (maintenance)
REINDEX TABLE attempts;

-- Vacuum & analyze for query optimization
VACUUM ANALYZE attempts;
VACUUM ANALYZE user_readiness;

-- Monitor index size
SELECT indexname, pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid) DESC;
```

---

## 🗂️ SQL SCHEMA CREATION

### **Complete Database Creation Script**

```sql
-- File: database/schema.sql
-- Description: Complete Genta database schema
-- Created: December 2025
-- Usage: psql -U postgres -d ngerti_db -f schema.sql

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For fuzzy search

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url VARCHAR(500),

    subscription_tier VARCHAR(50) DEFAULT 'free'
        CHECK (subscription_tier IN ('free', 'premium', 'premium_plus')),
    subscription_start_date TIMESTAMP,
    subscription_end_date TIMESTAMP,
    is_subscription_active BOOLEAN DEFAULT false,

    irt_theta DECIMAL(5, 3) DEFAULT 0.0,
    irt_variance DECIMAL(5, 3) DEFAULT 0.5,
    irt_last_updated TIMESTAMP,

    target_ptn VARCHAR(100),
    target_score INTEGER,
    exam_date DATE,
    study_hours_per_week SMALLINT,
    onboarding_completed BOOLEAN DEFAULT false,

    is_email_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_onboarding ON users(onboarding_completed);

-- ============================================
-- 2. QUESTION_BANKS TABLE
-- ============================================
CREATE TABLE question_banks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    source VARCHAR(100),

    -- Content stats (7 subtests sesuai UTBK resmi)
    total_questions INTEGER DEFAULT 0,
    -- TPS (Tes Potensi Skolastik)
    questions_pu INTEGER DEFAULT 0,   -- Penalaran Umum
    questions_ppu INTEGER DEFAULT 0,  -- Pengetahuan & Pemahaman Umum
    questions_pbm INTEGER DEFAULT 0,  -- Pemahaman Bacaan & Menulis
    questions_pk INTEGER DEFAULT 0,   -- Pengetahuan Kuantitatif
    -- Literasi & Penalaran
    questions_lbi INTEGER DEFAULT 0,  -- Literasi Bahasa Indonesia
    questions_lbe INTEGER DEFAULT 0,  -- Literasi Bahasa Inggris
    questions_pm INTEGER DEFAULT 0,   -- Penalaran Matematika

    is_reviewed BOOLEAN DEFAULT false,
    review_date DATE,
    reviewer_notes TEXT,

    is_calibrated BOOLEAN DEFAULT false,
    calibration_date DATE,
    calibration_sample_size INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_question_banks_source ON question_banks(source);

-- ============================================
-- 3. QUESTIONS TABLE
-- ============================================
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_bank_id UUID REFERENCES question_banks(id),

    -- 7 subtests sesuai UTBK resmi
    section VARCHAR(10) NOT NULL CHECK (section IN ('PU', 'PPU', 'PBM', 'PK', 'LBI', 'LBE', 'PM')),
    sub_type VARCHAR(50),

    difficulty_irt DECIMAL(4, 2),
    discrimination DECIMAL(4, 3),
    guessing_param DECIMAL(4, 3),

    text TEXT NOT NULL,
    option_a VARCHAR(500) NOT NULL,
    option_b VARCHAR(500) NOT NULL,
    option_c VARCHAR(500) NOT NULL,
    option_d VARCHAR(500) NOT NULL,
    option_e VARCHAR(500) NOT NULL,
    correct_answer CHAR(1) NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D', 'E')),

    explanation TEXT,
    explanation_en TEXT,
    strategy_tip TEXT,
    related_concept VARCHAR(255),

    -- Step-by-step solution (optional, untuk soal math/kuantitatif)
    solution_steps JSONB,

    is_active BOOLEAN DEFAULT true,

    attempt_count INTEGER DEFAULT 0,
    correct_rate DECIMAL(5, 3),
    avg_time_seconds SMALLINT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_questions_section ON questions(section);
CREATE INDEX idx_questions_sub_type ON questions(sub_type);
CREATE INDEX idx_questions_difficulty_irt ON questions(difficulty_irt);
CREATE INDEX idx_questions_section_difficulty ON questions(section, difficulty_irt);
CREATE INDEX idx_questions_is_active ON questions(is_active);

-- ============================================
-- 4. ATTEMPTS TABLE (CORE)
-- ============================================
CREATE TABLE attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id),

    selected_answer CHAR(1) NOT NULL CHECK (selected_answer IN ('A', 'B', 'C', 'D', 'E')),
    is_correct BOOLEAN GENERATED ALWAYS AS (
        selected_answer = (SELECT correct_answer FROM questions WHERE id = question_id)
    ) STORED,
    time_spent_seconds SMALLINT NOT NULL,

    user_theta_before DECIMAL(5, 3),
    user_theta_after DECIMAL(5, 3),
    theta_change DECIMAL(5, 3),

    feedback_generated BOOLEAN DEFAULT false,
    feedback_model_used VARCHAR(50),
    feedback_generation_ms INTEGER,
    feedback_helpful BOOLEAN,  -- User rating: true = 👍, false = 👎

    session_id VARCHAR(100),
    attempt_number_in_session SMALLINT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_attempts_user_id ON attempts(user_id);
CREATE INDEX idx_attempts_question_id ON attempts(question_id);
CREATE INDEX idx_attempts_created_at ON attempts(created_at DESC);
CREATE INDEX idx_attempts_user_created ON attempts(user_id, created_at DESC);
CREATE INDEX idx_attempts_session_id ON attempts(session_id);
CREATE INDEX idx_attempts_feedback_helpful ON attempts(feedback_helpful);

-- ============================================
-- 5. USER_READINESS TABLE
-- ============================================
CREATE TABLE user_readiness (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- 7 subtests sesuai UTBK resmi
    section VARCHAR(10) NOT NULL CHECK (section IN ('PU', 'PPU', 'PBM', 'PK', 'LBI', 'LBE', 'PM')),

    recent_attempts_count INTEGER DEFAULT 0,
    recent_correct_count INTEGER DEFAULT 0,
    recent_accuracy DECIMAL(5, 3),

    total_attempts_count INTEGER DEFAULT 0,
    total_correct_count INTEGER DEFAULT 0,
    overall_accuracy DECIMAL(5, 3),

    current_theta DECIMAL(5, 3),
    target_theta DECIMAL(5, 3) DEFAULT 0.5,
    readiness_percentage DECIMAL(5, 3),

    predicted_score_low INTEGER,
    predicted_score_high INTEGER,
    ready_by_date DATE,

    improvement_rate_per_week DECIMAL(5, 3),
    days_to_ready INTEGER,

    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by_job_id VARCHAR(100),

    PRIMARY KEY (user_id, section)
);

CREATE INDEX idx_readiness_readiness_percentage ON user_readiness(readiness_percentage DESC);
CREATE INDEX idx_readiness_section ON user_readiness(section);

-- ============================================
-- 6. ATTEMPT_FEEDBACK TABLE
-- ============================================
CREATE TABLE attempt_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL UNIQUE REFERENCES attempts(id) ON DELETE CASCADE,

    feedback_text TEXT NOT NULL,
    feedback_lang VARCHAR(10) DEFAULT 'id',

    feedback_quality_rating DECIMAL(2, 1),
    is_helpful BOOLEAN,
    helpful_rating INTEGER,

    model_used VARCHAR(50) NOT NULL,
    prompt_version VARCHAR(20),
    generation_time_ms INTEGER,
    token_count_input SMALLINT,
    token_count_output SMALLINT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feedback_attempt_id ON attempt_feedback(attempt_id);
CREATE INDEX idx_feedback_model_used ON attempt_feedback(model_used);
CREATE INDEX idx_feedback_created_at ON attempt_feedback(created_at DESC);

-- ============================================
-- 7. USER_STUDY_SESSIONS TABLE
-- ============================================
CREATE TABLE user_study_sessions (
    id VARCHAR(100) PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    duration_minutes SMALLINT,

    questions_attempted INTEGER DEFAULT 0,
    questions_correct INTEGER DEFAULT 0,
    accuracy_in_session DECIMAL(5, 3),

    section VARCHAR(10),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON user_study_sessions(user_id);
CREATE INDEX idx_sessions_started_at ON user_study_sessions(started_at DESC);

-- ============================================
-- 8. PAYMENT_SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE payment_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),

    midtrans_transaction_id VARCHAR(255) UNIQUE,
    midtrans_order_id VARCHAR(255) UNIQUE,

    subscription_tier VARCHAR(50) NOT NULL,
    plan_duration_days INTEGER,
    price_idr BIGINT NOT NULL,

    payment_status VARCHAR(50),
    subscription_start_date DATE,
    subscription_end_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_user_id ON payment_subscriptions(user_id);
CREATE INDEX idx_payments_payment_status ON payment_subscriptions(payment_status);

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update user.updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_questions_updated_at
BEFORE UPDATE ON questions
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_readiness_updated_at
BEFORE UPDATE ON user_readiness
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Calculate is_correct based on correct_answer
CREATE OR REPLACE FUNCTION check_question_correctness()
RETURNS TRIGGER AS $$
BEGIN
    -- Ensure question has correct answer set
    IF NEW.correct_answer IS NULL THEN
        RAISE EXCEPTION 'correct_answer cannot be NULL';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_questions_check_correct
BEFORE INSERT OR UPDATE ON questions
FOR EACH ROW EXECUTE FUNCTION check_question_correctness();

-- ============================================
-- SCHEMA COMPLETE
-- ============================================
```

---

## 📊 SAMPLE QUERIES

### **Query 0: Complete User Onboarding**

```sql
-- File: queries/complete_onboarding.sql
-- Purpose: Save onboarding data and create initial readiness records
-- Used by: POST /api/v1/users/onboarding

-- Step 1: Update user with onboarding data
UPDATE users
SET
    target_ptn = $2,
    target_score = $3,
    exam_date = $4,
    study_hours_per_week = $5,
    onboarding_completed = true,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;

-- Step 2: Create initial readiness records for all sections
INSERT INTO user_readiness (user_id, section, readiness_percentage, predicted_score_low, predicted_score_high)
VALUES
    ($1, 'PU', 0, 500, 550),
    ($1, 'PK', 0, 500, 550),
    ($1, 'PBM', 0, 500, 550)
ON CONFLICT (user_id, section) DO NOTHING;
```

---

### **Query 1: Get Student's Current Readiness (Dashboard)**

```sql
-- File: queries/readiness.sql
-- Purpose: Get readiness dashboard for user
-- Used by: Frontend dashboard
-- Expected result: Single row per section

SELECT
    ur.section,
    ur.overall_accuracy,
    ur.readiness_percentage,
    ur.predicted_score_low,
    ur.predicted_score_high,
    ur.ready_by_date,
    ur.improvement_rate_per_week,
    ur.days_to_ready,
    u.target_score,
    u.exam_date
FROM user_readiness ur
JOIN users u ON ur.user_id = u.id
WHERE ur.user_id = $1
ORDER BY ur.section;
```

**Expected Output:**

```
section | overall_accuracy | readiness_percentage | predicted_score_low | ...
PU      | 0.68            | 72                  | 680                 |
PK      | 0.55            | 58                  | 600                 |
PBM     | 0.70            | 74                  | 700                 |
```

---

### **Query 2: Select Next Question for Student (IRT Algorithm)**

```sql
-- File: queries/select_next_question.sql
-- Purpose: Get next question at appropriate difficulty for student
-- Used by: Practice session
-- Logic: Select question at difficulty matching user's theta ± 0.5

SELECT
    q.id,
    q.section,
    q.text,
    q.option_a, q.option_b, q.option_c, q.option_d, q.option_e,
    q.difficulty_irt,
    q.discrimination,
    q.sub_type,
    EXTRACT(EPOCH FROM (NOW() - q.created_at)) / 86400 AS days_since_created
FROM questions q
WHERE
    q.section = $1  -- Section user is practicing
    AND q.difficulty_irt BETWEEN $2 - 0.5 AND $2 + 0.5  -- $2 = user theta
    AND q.is_reviewed = true
    AND q.is_ambiguous = false
    AND q.deleted_at IS NULL
    -- Avoid recently answered questions
    AND q.id NOT IN (
        SELECT question_id FROM attempts
        WHERE user_id = $3
        AND created_at > NOW() - INTERVAL '7 days'
    )
ORDER BY
    ABS(q.difficulty_irt - $2),  -- Closest to user's ability
    RANDOM()  -- Add randomness to avoid same question order
LIMIT 1;
```

**Golang Usage (with sqlc):**

```go
// queries/queries.sql generates this:
type SelectNextQuestionParams struct {
    Section string
    Theta   float64
    UserID  uuid.UUID
}

func (q *Queries) SelectNextQuestion(ctx context.Context, section string, theta float64, userID uuid.UUID) (*Question, error) {
    // Auto-generated by sqlc
}
```

---

### **Query 3: Record Student Attempt & Update IRT**

```sql
-- File: queries/create_attempt.sql
-- Purpose: Insert attempt and calculate new theta
-- Used by: After student answers question

-- Step 1: Insert attempt
INSERT INTO attempts (
    user_id,
    question_id,
    selected_answer,
    time_spent_seconds,
    user_theta_before,
    session_id,
    attempt_number_in_session
) VALUES (
    $1,  -- user_id
    $2,  -- question_id
    $3,  -- selected_answer (A-E)
    $4,  -- time_spent_seconds
    $5,  -- current theta from users table
    $6,  -- session_id
    $7   -- attempt_number
)
RETURNING id, is_correct;

-- Step 2: Calculate new theta (done in application code with IRT algorithm)
-- Step 3: Update user's theta
UPDATE users
SET
    irt_theta = $1,  -- New calculated theta
    irt_variance = $2,  -- Updated variance
    irt_last_updated = CURRENT_TIMESTAMP
WHERE id = $3
RETURNING irt_theta;

-- Step 4: Update theta_after in attempt
UPDATE attempts
SET user_theta_after = $1
WHERE id = $2;
```

---

### **Query 4: Get Session Statistics**

```sql
-- File: queries/session_stats.sql
-- Purpose: Get detailed session performance
-- Used by: Session review screen

SELECT
    COUNT(*) as total_questions,
    SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_count,
    ROUND(
        100.0 * SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) / COUNT(*),
        2
    ) as accuracy_percentage,
    AVG(time_spent_seconds) as avg_time_seconds,
    MIN(time_spent_seconds) as min_time_seconds,
    MAX(time_spent_seconds) as max_time_seconds,
    q.section,
    json_agg(json_build_object(
        'questionId', a.question_id,
        'isCorrect', a.is_correct,
        'userAnswer', a.selected_answer,
        'correctAnswer', q.correct_answer,
        'timeSpent', a.time_spent_seconds
    )) as question_breakdown
FROM attempts a
JOIN questions q ON a.question_id = q.id
WHERE
    a.user_id = $1
    AND a.session_id = $2
GROUP BY q.section;
```

**Expected Output:**

```json
{
  "total_questions": 15,
  "correct_count": 11,
  "accuracy_percentage": 73.33,
  "avg_time_seconds": 45,
  "section": "PU",
  "question_breakdown": [
    {
      "questionId": "uuid-1",
      "isCorrect": true,
      "userAnswer": "B",
      "correctAnswer": "B",
      "timeSpent": 32
    },
    ...
  ]
}
```

---

### **Query 5: Calculate Readiness (Batch Job)**

```sql
-- File: queries/batch_update_readiness.sql
-- Purpose: Update readiness for all active users
-- Used by: Asynq background job (runs every 6 hours)

WITH attempt_stats AS (
    SELECT
        a.user_id,
        q.section,
        COUNT(*) as total_attempts,
        SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END) as correct_attempts,
        ROUND(
            100.0 * SUM(CASE WHEN a.is_correct THEN 1 ELSE 0 END) / COUNT(*),
            2
        ) as overall_accuracy,
        AVG(a.user_theta_after) as current_theta
    FROM attempts a
    JOIN questions q ON a.question_id = q.id
    WHERE a.deleted_at IS NULL
    GROUP BY a.user_id, q.section
),
readiness_calc AS (
    SELECT
        ast.user_id,
        ast.section,
        ast.overall_accuracy,
        ast.current_theta,
        ROUND(
            (ast.overall_accuracy::DECIMAL / 75.0) * 100,
            2
        ) as readiness_percentage,
        CASE
            WHEN ast.overall_accuracy >= 90 THEN 1
            WHEN ast.overall_accuracy >= 80 THEN 2
            WHEN ast.overall_accuracy >= 70 THEN 3
            WHEN ast.overall_accuracy >= 60 THEN 4
            ELSE 5
        END as predicted_score_band,
        ROUND(
            (EXTRACT(EPOCH FROM (NOW() - MAX(a.created_at))) / 86400) / 7.0,
            2
        ) as weeks_studying
    FROM attempt_stats ast
    LEFT JOIN attempts a ON a.user_id = ast.user_id AND a.section = ast.section
    GROUP BY ast.user_id, ast.section, ast.overall_accuracy, ast.current_theta
)
UPDATE user_readiness
SET
    overall_accuracy = rc.overall_accuracy,
    current_theta = rc.current_theta,
    readiness_percentage = rc.readiness_percentage,
    predicted_score_low = CASE rc.predicted_score_band
        WHEN 1 THEN 700 WHEN 2 THEN 650 WHEN 3 THEN 600 WHEN 4 THEN 550 ELSE 500
    END,
    predicted_score_high = CASE rc.predicted_score_band
        WHEN 1 THEN 750 WHEN 2 THEN 700 WHEN 3 THEN 650 WHEN 4 THEN 600 ELSE 550
    END,
    ready_by_date = CURRENT_DATE + INTERVAL '7 days' *
        GREATEST(1, (75.0 - rc.overall_accuracy) / 2),
    last_updated = CURRENT_TIMESTAMP,
    updated_by_job_id = $1
FROM readiness_calc rc
WHERE user_readiness.user_id = rc.user_id
    AND user_readiness.section = rc.section;
```

---

### **Query 6: Get All Questions by Section (with Filters)**

```sql
-- File: queries/get_questions_by_section.sql
-- Purpose: Fetch question bank for admin/content team
-- Used by: Content management dashboard

SELECT
    q.id,
    q.section,
    q.sub_type,
    q.difficulty_irt,
    q.text,
    q.correct_answer,
    q.is_reviewed,
    q.is_ambiguous,
    q.attempt_count,
    CASE
        WHEN q.correct_rate IS NOT NULL THEN ROUND(q.correct_rate * 100, 1)
        ELSE NULL
    END as correct_rate_percentage,
    q.avg_time_seconds,
    COUNT(qrl.id) as review_count
FROM questions q
LEFT JOIN question_review_logs qrl ON q.id = qrl.question_id
WHERE
    q.section = $1  -- 'PU', 'PK', or 'PBM'
    AND q.deleted_at IS NULL
    AND ($2::VARCHAR IS NULL OR q.sub_type = $2)  -- Optional sub_type filter
    AND ($3::BOOLEAN IS NULL OR q.is_reviewed = $3)  -- Optional review filter
GROUP BY
    q.id, q.section, q.sub_type, q.difficulty_irt,
    q.text, q.correct_answer, q.is_reviewed, q.is_ambiguous,
    q.attempt_count, q.correct_rate, q.avg_time_seconds
ORDER BY
    q.difficulty_irt ASC,
    q.created_at DESC
LIMIT $4 OFFSET $5;  -- Pagination
```

---

### **Query 7: Get Feedback History for User**

```sql
-- File: queries/get_feedback_history.sql
-- Purpose: Show user their recent feedback for learning
-- Used by: User progress page

SELECT
    af.id,
    af.feedback_text,
    af.is_helpful,
    af.model_used,
    af.generation_time_ms,
    a.selected_answer,
    q.correct_answer,
    q.text as question_text,
    q.section,
    a.is_correct,
    a.time_spent_seconds,
    a.created_at as attempt_date
FROM attempt_feedback af
JOIN attempts a ON af.attempt_id = a.id
JOIN questions q ON a.question_id = q.id
WHERE
    a.user_id = $1
    AND af.is_helpful IS NOT NULL  -- Only rated feedback
ORDER BY af.created_at DESC
LIMIT $2;  -- Last N feedbacks
```

---

### **Query 7b: Get User Study Sessions**

```sql
-- File: queries/get_user_sessions.sql
-- Purpose: List user's study session history
-- Used by: GET /api/v1/sessions

SELECT
    uss.id,
    uss.started_at,
    uss.ended_at,
    uss.duration_minutes,
    uss.questions_attempted,
    uss.questions_correct,
    uss.accuracy_in_session,
    uss.section
FROM user_study_sessions uss
WHERE uss.user_id = $1
ORDER BY uss.started_at DESC
LIMIT $2 OFFSET $3;  -- Pagination
```

---

### **Query 8: Analytics - User Growth & Retention**

```sql
-- File: queries/analytics_user_growth.sql
-- Purpose: Dashboard metrics for founders/admin
-- Used by: Analytics dashboard

SELECT
    DATE_TRUNC('week', u.created_at)::DATE as signup_week,
    COUNT(DISTINCT u.id) as new_users,
    SUM(CASE WHEN u.subscription_tier = 'premium' THEN 1 ELSE 0 END) as premium_count,
    SUM(CASE WHEN u.subscription_tier = 'free' THEN 1 ELSE 0 END) as free_count,
    COUNT(DISTINCT CASE
        WHEN u.last_login > NOW() - INTERVAL '7 days'
        THEN u.id
    END) as active_last_7d
FROM users u
WHERE u.deleted_at IS NULL
GROUP BY DATE_TRUNC('week', u.created_at)
ORDER BY signup_week DESC
LIMIT 52;  -- Last year
```

**Expected Output:**

```
signup_week | new_users | premium_count | free_count | active_last_7d
2025-12-08  | 234       | 24            | 210        | 156
2025-12-01  | 512       | 52            | 460        | 298
2025-11-24  | 389       | 39            | 350        | 201
```

---

### **Query 9: Top Performing Questions (for Content Team)**

```sql
-- File: queries/top_questions_stats.sql
-- Purpose: Identify best/worst performing questions
-- Used by: Content review, IRT recalibration

SELECT
    q.id,
    q.section,
    q.sub_type,
    q.text,
    q.difficulty_irt,
    q.attempt_count,
    ROUND(q.correct_rate * 100, 2) as correct_rate_percentage,
    q.avg_time_seconds,
    COUNT(DISTINCT a.user_id) as unique_users_answered,
    CASE
        WHEN q.correct_rate > 0.85 THEN 'TOO_EASY'
        WHEN q.correct_rate < 0.30 THEN 'TOO_HARD'
        WHEN ABS(q.correct_rate - 0.50) < 0.15 THEN 'OPTIMAL'
        ELSE 'ACCEPTABLE'
    END as difficulty_assessment
FROM questions q
LEFT JOIN attempts a ON q.id = a.question_id
WHERE q.deleted_at IS NULL
GROUP BY q.id, q.section, q.sub_type, q.text, q.difficulty_irt, q.attempt_count, q.correct_rate, q.avg_time_seconds
HAVING COUNT(DISTINCT a.user_id) >= 10  -- At least 10 users answered
ORDER BY q.attempt_count DESC
LIMIT 50;
```

---

### **Query 10: LLM Cost Analysis (for Finance)**

```sql
-- File: queries/llm_cost_analysis.sql
-- Purpose: Track LLM API costs
-- Used by: Financial dashboard

SELECT
    DATE_TRUNC('day', af.created_at)::DATE as date,
    af.model_used,
    COUNT(*) as feedback_count,
    AVG(af.generation_time_ms) as avg_generation_ms,
    AVG(af.token_count_input + af.token_count_output) as avg_tokens,
    ROUND(
        COUNT(*) * 0.00015::DECIMAL,  -- Cost estimate: $0.00015 per Mistral feedback
        2
    ) as estimated_cost_usd
FROM attempt_feedback af
WHERE af.created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', af.created_at), af.model_used
ORDER BY af.created_at DESC;
```

---

## 🚀 PERFORMANCE OPTIMIZATION

### **Query Optimization Strategies**

#### **1. Connection Pooling (Golang)**

```go
// main.go - pgx connection pool configuration
config, _ := pgx.ParseConfig("postgresql://user:password@localhost/ngerti_db")

// Pool configuration for optimal performance
pool, _ := pgxpool.NewWithConfig(context.Background(), &pgxpool.Config{
    ConnConfig: config,
    MaxConns:   25,      // Max concurrent connections
    MinConns:   5,       // Min idle connections
    MaxConnLifetime: 5 * time.Minute,
    MaxConnIdleTime: 1 * time.Minute,
})
```

#### **2. Query Preparation (sqlc)**

```go
// sqlc auto-generates prepared statements
// This prevents SQL injection and reuses query plans

// In queries.sql:
-- name: GetUserReadiness :one
SELECT * FROM user_readiness WHERE user_id = $1 AND section = $2;

// Auto-generated in Go:
func (q *Queries) GetUserReadiness(ctx context.Context, userID uuid.UUID, section string) (*UserReadiness, error) {
    // Prepared statement with pgx
}
```

#### **3. Caching Strategy**

```go
// Cache user readiness in Redis (Asynq integration)
// Updated every 6 hours via batch job

func GetUserReadinessCached(ctx context.Context, userID uuid.UUID) (*UserReadiness, error) {
    // Try Redis first
    cached, err := redisClient.Get(ctx, fmt.Sprintf("readiness:%s", userID)).Result()
    if err == nil {
        // Unmarshal from cache
        return parseReadiness(cached), nil
    }

    // Fall back to database
    readiness, err := queries.GetUserReadiness(ctx, userID)

    // Store in Redis for 6 hours
    redisClient.SetEX(ctx, fmt.Sprintf("readiness:%s", userID),
        marshal(readiness), 6*time.Hour)

    return readiness, err
}
```

#### **4. Batch Operations**

```sql
-- Instead of 100 individual INSERTs, use batch
-- Insert 100 attempts at once (from Asynq job)

INSERT INTO attempts (user_id, question_id, selected_answer, time_spent_seconds, user_theta_before, session_id, created_at)
VALUES
    ($1, $2, $3, $4, $5, $6, $7),
    ($8, $9, $10, $11, $12, $13, $14),
    ...
ON CONFLICT DO NOTHING;

-- Golang with pgx:
batch := &pgx.Batch{}
for _, attempt := range attempts {
    batch.Queue("INSERT INTO attempts (...) VALUES (...)",
        attempt.UserID, attempt.QuestionID, ...)
}

results := conn.SendBatch(ctx, batch)
defer results.Close()
```

#### **5. Partial Indexes for Hot Data**

```sql
-- Only index wrong answers (they're queried more often)
CREATE INDEX idx_attempts_incorrect ON attempts(user_id, created_at DESC)
WHERE is_correct = false;

-- Only index active users (reduces index size)
CREATE INDEX idx_users_active_premium ON users(id)
WHERE is_active = true AND subscription_tier = 'premium';
```

### **Query Performance Checklist**

```sql
-- Analyze slow queries
EXPLAIN ANALYZE
SELECT * FROM attempts
WHERE user_id = '...'
ORDER BY created_at DESC LIMIT 10;

-- Look for:
-- ✅ Sequential Scan → Consider index
-- ✅ Sort (high cost) → Add ordering to index
-- ✅ High actual time → Cache or denormalize

-- VACUUM to keep statistics fresh
VACUUM ANALYZE attempts;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;  -- Unused indexes have 0 scans
```

---

## 🔐 BACKUP & MAINTENANCE

### **Daily Backup Strategy**

```bash
#!/bin/bash
# File: backup/daily_backup.sh
# Purpose: PostgreSQL backup to S3

BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="/tmp/ngerti_db_${BACKUP_DATE}.sql"

# Full backup
pg_dump \
    -U postgres \
    -h localhost \
    -d ngerti_db \
    --compress=9 \
    --format=tar \
    -f "${BACKUP_FILE}.tar.gz"

# Upload to S3
aws s3 cp "${BACKUP_FILE}.tar.gz" \
    "s3://ngerti-backups/daily/${BACKUP_DATE}.tar.gz"

# Keep only last 30 days
aws s3 rm s3://ngerti-backups/daily/ \
    --recursive \
    --exclude "*" \
    --include "*.tar.gz" \
    --older-than 30

echo "Backup completed: ${BACKUP_FILE}.tar.gz"
```

### **Maintenance Schedule**

```
Daily:
├─ Run daily backup (02:00 UTC)
└─ Monitor error logs

Weekly (Sunday 03:00 UTC):
├─ VACUUM ANALYZE (full)
├─ Reindex large tables (attempts, attempts_user_created index)
└─ Check disk usage

Monthly (1st day, 04:00 UTC):
├─ Full backup review
├─ Run EXPLAIN ANALYZE on slow queries
├─ Update query statistics
└─ Archive old error logs

Quarterly:
├─ Database performance audit
├─ Index fragmentation analysis
└─ Scaling assessment
```

---

## 📈 MONITORING & ALERTS

### **Key Metrics to Monitor**

```sql
-- Connection pool health
SELECT
    datname,
    count(*) as total_connections,
    sum(case when state = 'active' then 1 else 0 end) as active_connections,
    sum(case when state = 'idle' then 1 else 0 end) as idle_connections
FROM pg_stat_activity
WHERE datname = 'ngerti_db'
GROUP BY datname;

-- Slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
WHERE mean_exec_time > 1000  -- queries slower than 1 second
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Table sizes
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

**END OF DATABASE DOCUMENTATION**

Ready for production deployment! 🚀
