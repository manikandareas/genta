// Onboarding Types

export interface OnboardingFormData {
  targetPtn: string;
  targetScore: number;
  examDate: Date;
  studyHoursPerWeek: number;
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
}

export interface PTNOption {
  value: string;
  label: string;
  location: string;
}

export interface OnboardingValidationErrors {
  targetPtn?: string;
  targetScore?: string;
  examDate?: string;
  studyHoursPerWeek?: string;
}

export const SCORE_MIN = 550;
export const SCORE_MAX = 750;
export const STUDY_HOURS_MIN = 1;
export const STUDY_HOURS_MAX = 168;
