import { z } from "zod";

// Section enum - 7 subtests UTBK
export const ZSection = z.enum(["PU", "PPU", "PBM", "PK", "LBI", "LBE", "PM"]);

// Solution Step schema
export const ZSolutionStep = z.object({
  order: z.number().int(),
  title: z.string(),
  content: z.string(),
});

// Base Question schema
export const ZQuestion = z.object({
  id: z.string().uuid(),
  question_bank_id: z.string().uuid().nullable(),
  section: ZSection,
  sub_type: z.string().nullable(),

  // IRT Parameters
  difficulty_irt: z.number().nullable(),
  discrimination: z.number().nullable(),
  guessing_param: z.number().nullable(),

  // Question Content
  text: z.string(),
  options: z.array(z.string()).length(5),
  correct_answer: z.enum(["A", "B", "C", "D", "E"]),

  // Explanation
  explanation: z.string().nullable(),
  explanation_en: z.string().nullable(),
  strategy_tip: z.string().nullable(),
  related_concept: z.string().nullable(),
  solution_steps: z.array(ZSolutionStep).nullable(),

  is_active: z.boolean(),

  // Statistics
  attempt_count: z.number().int().nullable(),
  correct_rate: z.number().nullable(),
  avg_time_seconds: z.number().int().nullable(),

  // Timestamps
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable(),
});

// === Request Schemas ===

// List questions query params
export const ZListQuestionsQuery = z.object({
  section: ZSection.optional(),
  sub_type: z.string().optional(),
  difficulty_min: z.coerce.number().optional(),
  difficulty_max: z.coerce.number().optional(),
  is_reviewed: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// Get next question query params
export const ZGetNextQuestionQuery = z.object({
  section: ZSection,
});

// Get question by ID path params
export const ZGetQuestionParams = z.object({
  id: z.string().uuid(),
});

// === Response Schemas ===

// Question response (without correct answer - for practice)
export const ZQuestionResponse = z.object({
  id: z.string().uuid(),
  section: ZSection,
  sub_type: z.string().nullable(),
  text: z.string(),
  options: z.array(z.string()).length(5),
  difficulty_irt: z.number().nullable(),
  discrimination: z.number().nullable(),
  attempt_count: z.number().int().nullable(),
  correct_rate: z.number().nullable(),
  avg_time_seconds: z.number().int().nullable(),
});

// Question detail response (with correct answer - after answering)
export const ZQuestionDetailResponse = ZQuestionResponse.extend({
  correct_answer: z.enum(["A", "B", "C", "D", "E"]),
  explanation: z.string().nullable(),
  explanation_en: z.string().nullable(),
  strategy_tip: z.string().nullable(),
  solution_steps: z.array(ZSolutionStep).nullable(),
  related_concept: z.string().nullable(),
});

// Paginated questions response
export const ZQuestionListResponse = z.object({
  data: z.array(ZQuestionResponse),
  total: z.number().int(),
  page: z.number().int(),
  limit: z.number().int(),
  totalPages: z.number().int(),
});

// === Type Exports ===
export type Section = z.infer<typeof ZSection>;
export type SolutionStep = z.infer<typeof ZSolutionStep>;
export type Question = z.infer<typeof ZQuestion>;
export type ListQuestionsQuery = z.infer<typeof ZListQuestionsQuery>;
export type GetNextQuestionQuery = z.infer<typeof ZGetNextQuestionQuery>;
export type GetQuestionParams = z.infer<typeof ZGetQuestionParams>;
export type QuestionResponse = z.infer<typeof ZQuestionResponse>;
export type QuestionDetailResponse = z.infer<typeof ZQuestionDetailResponse>;
export type QuestionListResponse = z.infer<typeof ZQuestionListResponse>;
