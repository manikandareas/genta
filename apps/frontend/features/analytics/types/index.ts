// Analytics Types
// Re-export types from @genta/zod for consistency with API
export type {
  ProgressResponse as ProgressAnalytics,
  AccuracyTrendResponse as AccuracyTrend,
  SectionBreakdownResponse as SectionBreakdown,
} from "@genta/zod";

export type Section = "PU" | "PPU" | "PBM" | "PK" | "LBI" | "LBE" | "PM";

export type TimeRange = 7 | 30 | 90;

// Section display names for UI
export const SECTION_NAMES: Record<Section, string> = {
  PU: "Penalaran Umum",
  PPU: "Pengetahuan & Pemahaman Umum",
  PBM: "Pemahaman Bacaan & Menulis",
  PK: "Pengetahuan Kuantitatif",
  LBI: "Literasi Bahasa Indonesia",
  LBE: "Literasi Bahasa Inggris",
  PM: "Penalaran Matematika",
};

// Section categories
export const TPS_SECTIONS: Section[] = ["PU", "PPU", "PBM", "PK"];
export const LITERASI_SECTIONS: Section[] = ["LBI", "LBE", "PM"];
export const ALL_SECTIONS: Section[] = [...TPS_SECTIONS, ...LITERASI_SECTIONS];
