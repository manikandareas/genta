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
  questionBankId: z.string().uuid().nullable(),
  section: ZSection,
  subType: z.string().nullable(),

  // IRT Parameters
  difficultyIrt: z.number().nullable(),
  discrimination: z.number().nullable(),
  guessingParam: z.number().nullable(),

  // Question Content
  text: z.string(),
  optionA: z.string(),
  optionB: z.string(),
  optionC: z.string(),
  optionD: z.string(),
  optionE: z.string(),
  correctAnswer: z.enum(["A", "B", "C", "D", "E"]),

  // Explanation
  explanation: z.string().nullable(),
  explanationEn: z.string().nullable(),
  strategyTip: z.string().nullable(),
  relatedConcept: z.string().nullable(),
  solutionSteps: z.array(ZSolutionStep).nullable(),

  isActive: z.boolean(),

  // Statistics
  attemptCount: z.number().int().nullable(),
  correctRate: z.number().nullable(),
  avgTimeSeconds: z.number().int().nullable(),

  // Timestamps
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
});

// === Request Schemas ===

// List questions query params
export const ZListQuestionsQuery = z.object({
  section: ZSection.optional(),
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
  subType: z.string().nullable(),
  difficultyIrt: z.number().nullable(),
  text: z.string(),
  optionA: z.string(),
  optionB: z.string(),
  optionC: z.string(),
  optionD: z.string(),
  optionE: z.string(),
  avgTimeSeconds: z.number().int().nullable(),
});

// Question detail response (with correct answer - after answering)
export const ZQuestionDetailResponse = ZQuestionResponse.extend({
  correctAnswer: z.enum(["A", "B", "C", "D", "E"]),
  explanation: z.string().nullable(),
  explanationEn: z.string().nullable(),
  strategyTip: z.string().nullable(),
  solutionSteps: z.array(ZSolutionStep).nullable(),
  relatedConcept: z.string().nullable(),
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
