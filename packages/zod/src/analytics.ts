import { z } from "zod";
import { ZSection } from "./question.js";

// === Request Schemas ===

// Get progress query params
export const ZGetProgressQuery = z.object({
  days: z.coerce
    .number()
    .int()
    .refine((val) => [7, 30, 90].includes(val), {
      message: "days must be 7, 30, or 90",
    })
    .optional()
    .default(7),
  section: ZSection.optional(),
});

// === Response Schemas ===

// Accuracy trend point for chart
export const ZAccuracyTrendResponse = z.object({
  date: z.string(),
  accuracy: z.number(),
  attempts: z.number().int(),
});

// Section breakdown response
export const ZSectionBreakdownResponse = z.object({
  section: z.string(),
  section_name: z.string(),
  attempts: z.number().int(),
  correct: z.number().int(),
  accuracy: z.number(),
  avg_time_seconds: z.number(),
});

// Progress analytics response
export const ZProgressResponse = z.object({
  period_days: z.number().int(),
  total_questions_attempted: z.number().int(),
  total_correct: z.number().int(),
  average_accuracy: z.number(),
  accuracy_trend: z.array(ZAccuracyTrendResponse),
  section_breakdown: z.array(ZSectionBreakdownResponse),
  improvement_this_week: z.number(),
});

// === Type Exports ===
export type GetProgressQuery = z.infer<typeof ZGetProgressQuery>;
export type AccuracyTrendResponse = z.infer<typeof ZAccuracyTrendResponse>;
export type SectionBreakdownResponse = z.infer<typeof ZSectionBreakdownResponse>;
export type ProgressResponse = z.infer<typeof ZProgressResponse>;
