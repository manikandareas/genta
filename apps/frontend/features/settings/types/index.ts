// Settings Types

export interface ProfileFormData {
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

export interface GoalsFormData {
  targetPtn: string;
  targetScore: number;
  examDate: Date | null;
  studyHoursPerWeek: number;
}

export interface Preferences {
  theme: Theme;
}

export type Theme = "light" | "dark" | "system";

export interface SubscriptionInfo {
  tier: string;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
}

export interface SettingsFormData {
  profile: ProfileFormData;
  goals: GoalsFormData;
  preferences: Preferences;
}

export interface SettingsPageProps {
  initialData?: SettingsFormData;
}
