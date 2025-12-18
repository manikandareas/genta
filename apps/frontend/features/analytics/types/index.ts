// Analytics Types

export type Section = "PU" | "PPU" | "PBM" | "PK" | "LBI" | "LBE" | "PM";

export interface ProgressAnalytics {
  totalQuestions: number;
  totalCorrect: number;
  overallAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  accuracyTrend: AccuracyTrendPoint[];
  sectionBreakdown: SectionBreakdown[];
}

export interface AccuracyTrendPoint {
  date: string;
  accuracy: number;
  questionsAttempted: number;
}

export interface SectionBreakdown {
  section: Section;
  accuracy: number;
  totalAttempts: number;
  totalCorrect: number;
}

export type TimeRange = 7 | 30 | 90;
