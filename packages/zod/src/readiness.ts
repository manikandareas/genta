import { z } from "zod";
import { ZSection } from "./question.js";

// === Request Schemas ===

// Section path params
export const ZReadinessSectionParams = z.object({
  section: ZSection,
});

// Update readiness request body
export const ZUpdateReadinessBody = z.object({
  target_theta: z.number().min(-3).max(3).optional(),
});

// === Response Schemas ===

// Single section readiness response
export const ZReadinessResponse = z.object({
  section: ZSection,
  overall_accuracy: z.number(),
  recent_accuracy: z.number(),
  readiness_percentage: z.number(),
  current_theta: z.number(),
  target_theta: z.number(),
  predicted_score_low: z.number().int(),
  predicted_score_high: z.number().int(),
  days_to_ready: z.number().int().optional().nullable(),
  ready_by_date: z.string().optional().nullable(),
  total_attempts: z.number().int(),
  total_correct: z.number().int(),
  improvement_rate_per_week: z.number().optional().nullable(),
  avg_time_seconds: z.number().optional().nullable(),
  last_practiced: z.string().datetime().optional().nullable(),
});

// Subtype accuracy breakdown
export const ZSubtypeAccuracyResponse = z.object({
  sub_type: z.string(),
  total_attempts: z.number().int(),
  correct_count: z.number().int(),
  accuracy: z.number(),
  is_weak_area: z.boolean(),
});

// Accuracy trend point
export const ZAccuracyTrendPoint = z.object({
  date: z.string(),
  accuracy: z.number(),
  attempts: z.number().int(),
});

// Next steps recommendation
export const ZNextStepsResponse = z.object({
  is_ready: z.boolean(),
  message: z.string(),
  estimated_completion_date: z.string().optional().nullable(),
  suggested_daily_practice: z.number().int().optional().nullable(),
});

// Section detail response (with subtype breakdown and trends)
export const ZSectionDetailResponse = ZReadinessResponse.extend({
  subtype_breakdown: z.array(ZSubtypeAccuracyResponse).optional(),
  accuracy_trend: z.array(ZAccuracyTrendPoint).optional(),
  next_steps: ZNextStepsResponse.optional().nullable(),
});

// Overview response (all sections)
export const ZReadinessOverviewResponse = z.object({
  overall_readiness: z.number(),
  total_attempts: z.number().int(),
  total_correct: z.number().int(),
  overall_accuracy: z.number(),
  section_readiness: z.record(ZSection, ZReadinessResponse),
  tps_readiness: z.number(),
  literasi_readiness: z.number(),
  weakest_section: ZSection.optional().nullable(),
  strongest_section: ZSection.optional().nullable(),
  recommended_practice: ZSection.optional().nullable(),
});

// === Type Exports ===
export type ReadinessSectionParams = z.infer<typeof ZReadinessSectionParams>;
export type UpdateReadinessBody = z.infer<typeof ZUpdateReadinessBody>;
export type ReadinessResponse = z.infer<typeof ZReadinessResponse>;
export type SubtypeAccuracyResponse = z.infer<typeof ZSubtypeAccuracyResponse>;
export type AccuracyTrendPoint = z.infer<typeof ZAccuracyTrendPoint>;
export type NextStepsResponse = z.infer<typeof ZNextStepsResponse>;
export type SectionDetailResponse = z.infer<typeof ZSectionDetailResponse>;
export type ReadinessOverviewResponse = z.infer<typeof ZReadinessOverviewResponse>;
