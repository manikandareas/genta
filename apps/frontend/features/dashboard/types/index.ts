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

export interface TPSReadiness {
  overall_percentage: number;
  subtests: {
    PU: number;
    PPU: number;
    PBM: number;
    PK: number;
  };
}

export interface LiterasiReadiness {
  overall_percentage: number;
  subtests: {
    LBI: number;
    LBE: number;
    PM: number;
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
  avg_per_day: number;
  active_days: number;
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
