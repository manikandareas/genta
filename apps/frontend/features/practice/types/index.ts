// Practice Types
// Re-export types from @genta/zod for consistency
import type {
  Section as ZodSection,
  Answer as ZodAnswer,
  QuestionResponse,
  SessionResponse,
  AttemptResponse,
  AttemptDetailResponse,
  FeedbackResponse,
  JobStatusResponse,
} from "@genta/zod";

export type Section = ZodSection;
export type Answer = ZodAnswer;

// Section metadata for UI display
export interface SectionInfo {
  id: Section;
  name: string;
  category: "TPS" | "Literasi";
  description: string;
  icon: string;
}

// Question type for practice (without correct answer)
export interface Question {
  id: string;
  section: Section;
  subType: string | null;
  text: string;
  options: string[];
  difficultyIrt: number | null;
  discrimination: number | null;
  attemptCount: number | null;
  correctRate: number | null;
  avgTimeSeconds: number | null;
}

// Attempt result after submission
export interface Attempt {
  id: string;
  questionId: string;
  selectedAnswer: Answer;
  isCorrect: boolean;
  timeSpentSeconds: number;
  thetaBefore: number | null;
  thetaAfter: number | null;
  thetaChange: number | null;
  feedbackGenerated: boolean;
  sessionId: string | null;
  createdAt: string;
  job?: JobInfo | null;
}

// Job info for feedback generation polling
export interface JobInfo {
  jobId: string;
  status: string;
  estimatedCompletionSeconds: number;
  checkStatusUrl: string;
}

// Feedback from AI
export interface Feedback {
  id: string;
  feedbackText: string;
  modelUsed: string;
  generationTimeMs: number | null;
  isHelpful: boolean | null;
}

// Question explanation from attempt detail
export interface QuestionExplanation {
  text: string;
  explanation: string | null;
}

// Session data
export interface Session {
  id: string;
  startedAt: string;
  endedAt: string | null;
  durationMinutes: number | null;
  questionsAttempted: number;
  questionsCorrect: number;
  accuracyInSession: number | null;
  section: Section | null;
}

// Practice session UI state
export interface PracticeSessionState {
  sessionId: string | null;
  section: Section | null;
  currentQuestion: Question | null;
  selectedAnswer: Answer | null;
  timeElapsed: number;
  isSubmitting: boolean;
  showResult: boolean;
  lastAttempt: Attempt | null;
  correctAnswer: Answer | null;
  feedback: Feedback | null;
  feedbackLoading: boolean;
  questionsAttempted: number;
  questionsCorrect: number;
}

// Session summary data for end of session
export interface SessionSummaryData {
  sessionId: string;
  section: Section | null;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  durationMinutes: number;
  thetaChange: number | null;
}

// Mappers from API response to UI types
export function mapQuestionResponse(response: QuestionResponse): Question {
  return {
    id: response.id,
    section: response.section,
    subType: response.sub_type,
    text: response.text,
    options: response.options,
    difficultyIrt: response.difficulty_irt,
    discrimination: response.discrimination,
    attemptCount: response.attempt_count,
    correctRate: response.correct_rate,
    avgTimeSeconds: response.avg_time_seconds,
  };
}

export function mapSessionResponse(response: SessionResponse): Session {
  return {
    id: response.id,
    startedAt: response.started_at,
    endedAt: response.ended_at ?? null,
    durationMinutes: response.duration_minutes ?? null,
    questionsAttempted: response.questions_attempted,
    questionsCorrect: response.questions_correct,
    accuracyInSession: response.accuracy_in_session ?? null,
    section: response.section ?? null,
  };
}

export function mapAttemptResponse(response: AttemptResponse): Attempt {
  return {
    id: response.id,
    questionId: response.question_id,
    selectedAnswer: response.selected_answer,
    isCorrect: response.is_correct,
    timeSpentSeconds: response.time_spent_seconds,
    thetaBefore: response.user_theta_before ?? null,
    thetaAfter: response.user_theta_after ?? null,
    thetaChange: response.theta_change ?? null,
    feedbackGenerated: response.feedback_generated,
    sessionId: response.session_id ?? null,
    createdAt: response.created_at,
    job: response.job
      ? {
          jobId: response.job.job_id,
          status: response.job.status,
          estimatedCompletionSeconds: response.job.estimated_completion_seconds,
          checkStatusUrl: response.job.check_status_url,
        }
      : null,
  };
}

export function mapFeedbackResponse(response: FeedbackResponse): Feedback {
  return {
    id: response.id,
    feedbackText: response.feedback_text,
    modelUsed: response.model_used,
    generationTimeMs: response.generation_time_ms ?? null,
    isHelpful: response.is_helpful ?? null,
  };
}

// Section metadata
export const SECTIONS: SectionInfo[] = [
  {
    id: "PU",
    name: "Penalaran Umum",
    category: "TPS",
    description: "Kemampuan penalaran logis dan analitis",
    icon: "🧠",
  },
  {
    id: "PPU",
    name: "Pengetahuan & Pemahaman Umum",
    category: "TPS",
    description: "Pemahaman bacaan dan pengetahuan umum",
    icon: "📚",
  },
  {
    id: "PBM",
    name: "Pemahaman Bacaan & Menulis",
    category: "TPS",
    description: "Kemampuan memahami dan menganalisis teks",
    icon: "📝",
  },
  {
    id: "PK",
    name: "Pengetahuan Kuantitatif",
    category: "TPS",
    description: "Kemampuan matematika dan kuantitatif",
    icon: "🔢",
  },
  {
    id: "LBI",
    name: "Literasi Bahasa Indonesia",
    category: "Literasi",
    description: "Kemampuan berbahasa Indonesia",
    icon: "🇮🇩",
  },
  {
    id: "LBE",
    name: "Literasi Bahasa Inggris",
    category: "Literasi",
    description: "Kemampuan berbahasa Inggris",
    icon: "🇬🇧",
  },
  {
    id: "PM",
    name: "Penalaran Matematika",
    category: "Literasi",
    description: "Penalaran dan pemecahan masalah matematika",
    icon: "📐",
  },
];

export function getSectionInfo(section: Section): SectionInfo {
  return SECTIONS.find((s) => s.id === section) ?? SECTIONS[0];
}
