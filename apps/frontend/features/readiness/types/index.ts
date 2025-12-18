// Readiness Types
// Re-export from @genta/zod for consistency
export type {
  ReadinessResponse,
  SubtypeAccuracyResponse,
  AccuracyTrendPoint,
  NextStepsResponse,
  SectionDetailResponse,
  ReadinessOverviewResponse,
} from "@genta/zod";

export type Section = "PU" | "PPU" | "PBM" | "PK" | "LBI" | "LBE" | "PM";

// Section metadata for display
export interface SectionMetadata {
  name: string;
  fullName: string;
  category: "TPS" | "Literasi";
  description: string;
}

export const SECTION_METADATA: Record<Section, SectionMetadata> = {
  PU: {
    name: "PU",
    fullName: "Penalaran Umum",
    category: "TPS",
    description: "General reasoning and logical thinking",
  },
  PPU: {
    name: "PPU",
    fullName: "Pengetahuan dan Pemahaman Umum",
    category: "TPS",
    description: "General knowledge and comprehension",
  },
  PBM: {
    name: "PBM",
    fullName: "Pemahaman Bacaan dan Menulis",
    category: "TPS",
    description: "Reading comprehension and writing",
  },
  PK: {
    name: "PK",
    fullName: "Pengetahuan Kuantitatif",
    category: "TPS",
    description: "Quantitative knowledge and mathematics",
  },
  LBI: {
    name: "LBI",
    fullName: "Literasi Bahasa Indonesia",
    category: "Literasi",
    description: "Indonesian language literacy",
  },
  LBE: {
    name: "LBE",
    fullName: "Literasi Bahasa Inggris",
    category: "Literasi",
    description: "English language literacy",
  },
  PM: {
    name: "PM",
    fullName: "Penalaran Matematika",
    category: "Literasi",
    description: "Mathematical reasoning",
  },
};

// Legacy interfaces for backward compatibility
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

// Legacy interface - use SubtypeAccuracyResponse from @genta/zod instead
export interface SubtypeBreakdownData {
  subtype: string;
  accuracy: number;
  totalAttempts: number;
}

export interface AccuracyTrend {
  date: string;
  accuracy: number;
}
