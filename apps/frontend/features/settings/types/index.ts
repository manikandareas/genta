// Settings Types

export interface ProfileFormData {
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

export interface GoalsFormData {
  targetPtn: string;
  targetScore: number;
  examDate: Date;
  studyHoursPerWeek: number;
}

export interface Preferences {
  theme: Theme;
}

export type Theme = "light" | "dark" | "system";
