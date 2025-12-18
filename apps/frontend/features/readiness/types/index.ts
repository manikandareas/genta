// Readiness Types

export type Section = "PU" | "PPU" | "PBM" | "PK" | "LBI" | "LBE" | "PM";

export interface SectionReadiness {
  section: Section;
  overallAccuracy: number;
  recentAccuracy: number;
  readinessPercentage: number;
  currentTheta: number;
  targetTheta: number;
  predictedScoreLow: number;
  predictedScoreHigh: number;
  daysToReady: number | null;
  totalAttempts: number;
  totalCorrect: number;
}

export interface SubtypeBreakdown {
  subtype: string;
  accuracy: number;
  totalAttempts: number;
}

export interface AccuracyTrend {
  date: string;
  accuracy: number;
}
