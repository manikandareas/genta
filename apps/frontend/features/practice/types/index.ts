// Practice Types

export type Section = "PU" | "PPU" | "PBM" | "PK" | "LBI" | "LBE" | "PM";
export type Answer = "A" | "B" | "C" | "D" | "E";

export interface Question {
  id: string;
  section: Section;
  subType: string | null;
  text: string;
  options: [string, string, string, string, string];
  difficultyIrt: number | null;
}

export interface Attempt {
  id: string;
  questionId: string;
  selectedAnswer: Answer;
  isCorrect: boolean;
  timeSpentSeconds: number;
  thetaChange: number | null;
  feedback?: Feedback;
}

export interface Feedback {
  id: string;
  content: string;
  isHelpful: boolean | null;
}

export interface Session {
  id: string;
  startedAt: string;
  endedAt: string | null;
  questionsAttempted: number;
  questionsCorrect: number;
  accuracyInSession: number | null;
  section: Section | null;
}

export interface PracticeSessionState {
  sessionId: string | null;
  currentQuestion: Question | null;
  selectedAnswer: Answer | null;
  timeElapsed: number;
  isSubmitting: boolean;
  showResult: boolean;
  feedback: Feedback | null;
  feedbackLoading: boolean;
}
