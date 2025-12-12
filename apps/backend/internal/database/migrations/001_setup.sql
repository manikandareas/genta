-- Write your migrate up statements here

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

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
-- 7 subtests sesuai UTBK resmi:
-- TPS: PU (Penalaran Umum), PPU (Pengetahuan & Pemahaman Umum),
--      PBM (Pemahaman Bacaan & Menulis), PK (Pengetahuan Kuantitatif)
-- Literasi: LBI (Literasi Bahasa Indonesia), LBE (Literasi Bahasa Inggris),
--           PM (Penalaran Matematika)
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_bank_id UUID REFERENCES question_banks(id),

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
    -- Format: [{"order": 1, "title": "Identifikasi", "content": "..."}, {"order": 2, "title": "Substitusi", "content": "..."}, ...]
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


-- ============================================
-- 4. ATTEMPTS TABLE (CORE)
-- ============================================
CREATE TABLE attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES questions(id),

    selected_answer CHAR(1) NOT NULL CHECK (selected_answer IN ('A', 'B', 'C', 'D', 'E')),
    is_correct BOOLEAN NOT NULL,
    time_spent_seconds SMALLINT NOT NULL,

    user_theta_before DECIMAL(5, 3),
    user_theta_after DECIMAL(5, 3),
    theta_change DECIMAL(5, 3),

    feedback_generated BOOLEAN DEFAULT false,
    feedback_model_used VARCHAR(50),
    feedback_generation_ms INTEGER,
    feedback_helpful BOOLEAN,

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

    -- 7 subtests UTBK atau NULL untuk mixed session
    section VARCHAR(10) CHECK (section IS NULL OR section IN ('PU', 'PPU', 'PBM', 'PK', 'LBI', 'LBE', 'PM')),

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

-- Auto-update updated_at function
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

CREATE TRIGGER trigger_question_banks_updated_at
BEFORE UPDATE ON question_banks
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_attempt_feedback_updated_at
BEFORE UPDATE ON attempt_feedback
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_user_study_sessions_updated_at
BEFORE UPDATE ON user_study_sessions
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_payment_subscriptions_updated_at
BEFORE UPDATE ON payment_subscriptions
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

---- create above / drop below ----

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.

-- Drop triggers
DROP TRIGGER IF EXISTS trigger_payment_subscriptions_updated_at ON payment_subscriptions;
DROP TRIGGER IF EXISTS trigger_user_study_sessions_updated_at ON user_study_sessions;
DROP TRIGGER IF EXISTS trigger_attempt_feedback_updated_at ON attempt_feedback;
DROP TRIGGER IF EXISTS trigger_question_banks_updated_at ON question_banks;
DROP TRIGGER IF EXISTS trigger_questions_updated_at ON questions;
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at();

-- Drop tables (reverse order due to foreign keys)
DROP TABLE IF EXISTS payment_subscriptions;
DROP TABLE IF EXISTS user_study_sessions;
DROP TABLE IF EXISTS attempt_feedback;
DROP TABLE IF EXISTS user_readiness;
DROP TABLE IF EXISTS attempts;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS question_banks;
DROP TABLE IF EXISTS users;

-- Drop extensions
DROP EXTENSION IF EXISTS "pg_trgm";
DROP EXTENSION IF EXISTS "uuid-ossp";
