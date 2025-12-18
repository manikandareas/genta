// Settings Mock Data

import type { ProfileFormData, GoalsFormData, Preferences, SubscriptionInfo } from "../types";

export const MOCK_PROFILE: ProfileFormData = {
  fullName: "Ahmad Rizki",
  email: "ahmad.rizki@example.com",
  avatarUrl: null,
};

export const MOCK_GOALS: GoalsFormData = {
  targetPtn: "ui",
  targetScore: 700,
  examDate: new Date("2025-06-15"),
  studyHoursPerWeek: 15,
};

export const MOCK_PREFERENCES: Preferences = {
  theme: "system",
};

export const MOCK_SUBSCRIPTION_FREE: SubscriptionInfo = {
  tier: "free",
  isActive: true,
  startDate: null,
  endDate: null,
};

export const MOCK_SUBSCRIPTION_PREMIUM: SubscriptionInfo = {
  tier: "premium",
  isActive: true,
  startDate: "2025-01-01T00:00:00Z",
  endDate: "2025-12-31T23:59:59Z",
};
