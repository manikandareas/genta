// Dashboard Types

export interface User {
  full_name: string;
  avatar_url: string | null;
}

export interface Notifications {
  unread_count: number;
}

export interface WelcomeData {
  full_name: string;
  daily_completed: number;
  daily_goal: number;
  streak_days: number;
}

export interface CountdownData {
  days_remaining: number;
  exam_date: string;
  target_ptn: string;
  target_score: number;
}

export interface SubtestReadiness {
  percentage: number;
  predicted_score_low: number;
  predicted_score_high: number;
  days_to_ready: number | null;
}

export interface TPSReadiness {
  overall_percentage: number;
  subtests: {
    PU: SubtestReadiness;
    PPU: SubtestReadiness;
    PBM: SubtestReadiness;
    PK: SubtestReadiness;
  };
}

export interface LiterasiReadiness {
  overall_percentage: number;
  subtests: {
    LBI: SubtestReadiness;
    LBE: SubtestReadiness;
    PM: SubtestReadiness;
  };
}

export interface OverallReadiness {
  percentage: number;
  predicted_score: number;
  target_score: number;
  gap: number;
}

export interface HeatmapEntry {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ActivityStats {
  total_sessions: number;
  total_questions: number;
  avg_per_day: number;
  active_days: number;
  overall_accuracy: number;
  accuracy_change: number; // weekly change
}

export interface ActivityData {
  heatmap: HeatmapEntry[];
  exam_date: string;
  stats: ActivityStats;
  selected_year: number;
}

export interface DashboardData {
  user: User;
  notifications: Notifications;
  welcome: WelcomeData;
  countdown: CountdownData;
  readiness: {
    tps: TPSReadiness;
    literasi: LiterasiReadiness;
    overall: OverallReadiness;
  };
  activity: ActivityData;
}
