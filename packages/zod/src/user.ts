import { z } from "zod";

// Base User schema
export const ZUser = z.object({
  id: z.string().uuid(),
  clerkId: z.string(),
  email: z.string().email(),
  fullName: z.string().max(255).nullable(),
  avatarUrl: z.string().url().nullable(),

  // Subscription
  subscriptionTier: z.string(),
  subscriptionStartDate: z.string().datetime().nullable(),
  subscriptionEndDate: z.string().datetime().nullable(),
  isSubscriptionActive: z.boolean(),

  // IRT (Item Response Theory)
  irtTheta: z.number().nullable(),
  irtVariance: z.number().nullable(),
  irtLastUpdated: z.string().datetime().nullable(),

  // Study Plan
  targetPtn: z.string().max(100).nullable(),
  targetScore: z.number().int().min(0).nullable(),
  examDate: z.string().datetime().nullable(),
  studyHoursPerWeek: z.number().int().min(0).max(168).nullable(),
  onboardingCompleted: z.boolean(),

  // Account Status
  isEmailVerified: z.boolean(),
  isActive: z.boolean(),
  lastLogin: z.string().datetime().nullable(),

  // Timestamps
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
});

// Request schemas
export const ZPutUserRequest = z.object({
  fullName: z.string().max(255).optional(),
  targetPtn: z.string().max(100).optional(),
  targetScore: z.number().int().min(0).optional(),
  examDate: z.string().datetime().optional(),
  studyHoursPerWeek: z.number().int().min(0).max(168).optional(),
  onboardingCompleted: z.boolean().optional(),
});

export const ZCompleteOnboardingRequest = z.object({
  targetPtn: z.string().max(100).optional(),
  targetScore: z.number().int().min(0).optional(),
  examDate: z.string().datetime().optional(),
  studyHoursPerWeek: z.number().int().min(0).max(168).optional(),
});

// Section Readiness schema
export const ZSectionReadiness = z.object({
  readiness_percentage: z.number(),
  predicted_score_low: z.number().int(),
  predicted_score_high: z.number().int(),
});

// Initial Readiness - map of section to readiness
export const ZInitialReadiness = z.record(
  z.enum(["PU", "PPU", "PBM", "PK", "LBI", "LBE", "PM"]),
  ZSectionReadiness,
);

// Response schemas
export const ZUserResponse = ZUser;

export const ZCompleteOnboardingResponse = z.object({
  id: z.string().uuid(),
  onboarding_completed: z.boolean(),
  target_ptn: z.string().nullable(),
  target_score: z.number().int().nullable(),
  exam_date: z.string().datetime().nullable(),
  study_hours_per_week: z.number().int().nullable(),
  initial_readiness: ZInitialReadiness,
});

// Type exports
export type User = z.infer<typeof ZUser>;
export type PutUserRequest = z.infer<typeof ZPutUserRequest>;
export type CompleteOnboardingRequest = z.infer<typeof ZCompleteOnboardingRequest>;
export type CompleteOnboardingResponse = z.infer<typeof ZCompleteOnboardingResponse>;
export type SectionReadiness = z.infer<typeof ZSectionReadiness>;
export type InitialReadiness = z.infer<typeof ZInitialReadiness>;
