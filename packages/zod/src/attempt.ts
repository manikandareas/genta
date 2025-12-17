import { z } from "zod";

// Answer enum
export const ZAnswer = z.enum(["A", "B", "C", "D", "E"]);

// === Base Schemas ===

// Attempt schema
export const ZAttempt = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  question_id: z.string().uuid(),
  session_id: z.string().max(100).nullable(),

  selected_answer: ZAnswer,
  is_correct: z.boolean(),
  time_spent_seconds: z.number().int().min(1).max(600),

  // IRT Theta tracking
  user_theta_before: z.number().nullable(),
  user_theta_after: z.number().nullable(),
  theta_change: z.number().nullable(),

  // Feedback
  feedback_generated: z.boolean(),
  feedback_model_used: z.string().nullable(),
  feedback_generation_ms: z.number().int().nullable(),
  feedback_helpful: z.boolean().nullable(),

  attempt_number_in_session: z.number().int().nullable(),

  created_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable(),
});

// Attempt Feedback schema (from attempt_feedback table)
export const ZAttemptFeedback = z.object({
  id: z.string().uuid(),
  attempt_id: z.string().uuid(),

  feedback_text: z.string(),
  feedback_lang: z.string().nullable(),

  feedback_quality_rating: z.number().nullable(),
  is_helpful: z.boolean().nullable(),
  helpful_rating: z.number().int().nullable(),

  model_used: z.string(),
  prompt_version: z.string().nullable(),
  generation_time_ms: z.number().int().nullable(),
  token_count_input: z.number().int().nullable(),
  token_count_output: z.number().int().nullable(),

  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// === Request Schemas ===

// Create attempt request
export const ZCreateAttemptRequest = z.object({
  question_id: z.string().uuid(),
  selected_answer: ZAnswer,
  time_spent_seconds: z.number().int().min(1).max(600),
  session_id: z.string().max(100),
});

// Get attempt path params
export const ZGetAttemptParams = z.object({
  attempt_id: z.string().uuid(),
});

// Update feedback rating request
export const ZUpdateFeedbackRatingRequest = z.object({
  is_helpful: z.boolean(),
});

// === Response Schemas ===

// Question in attempt response (embedded)
export const ZQuestionInAttempt = z.object({
  id: z.string().uuid(),
  text: z.string(),
  options: z.array(z.string()).length(5),
  explanation: z.string().nullable(),
});

// Feedback response
export const ZFeedbackResponse = z.object({
  id: z.string().uuid(),
  feedback_text: z.string(),
  model_used: z.string(),
  generation_time_ms: z.number().int().nullable(),
  is_helpful: z.boolean().nullable(),
});

// Job response (embedded in attempt response)
export const ZJobInAttemptResponse = z.object({
  job_id: z.string(),
  status: z.string(),
  estimated_completion_seconds: z.number().int(),
  check_status_url: z.string(),
});

// Attempt response (after submission)
export const ZAttemptResponse = z.object({
  id: z.string().uuid(),
  question_id: z.string().uuid(),
  selected_answer: ZAnswer,
  is_correct: z.boolean(),
  time_spent_seconds: z.number().int(),
  user_theta_before: z.number().nullable(),
  user_theta_after: z.number().nullable(),
  theta_change: z.number().nullable(),
  feedback_generated: z.boolean(),
  session_id: z.string().nullable(),
  created_at: z.string().datetime(),
  job: ZJobInAttemptResponse.nullable().optional(),
});

// Attempt detail response (with question and feedback)
export const ZAttemptDetailResponse = z.object({
  id: z.string().uuid(),
  question_id: z.string().uuid(),
  selected_answer: ZAnswer,
  correct_answer: ZAnswer,
  is_correct: z.boolean(),
  time_spent_seconds: z.number().int(),
  theta_change: z.number().nullable(),
  created_at: z.string().datetime(),
  question: ZQuestionInAttempt.nullable(),
  feedback: ZFeedbackResponse.nullable(),
});

// Feedback rating response
export const ZFeedbackRatingResponse = z.object({
  attempt_id: z.string().uuid(),
  is_helpful: z.boolean(),
});

// === Type Exports ===
export type Answer = z.infer<typeof ZAnswer>;
export type Attempt = z.infer<typeof ZAttempt>;
export type AttemptFeedback = z.infer<typeof ZAttemptFeedback>;
export type CreateAttemptRequest = z.infer<typeof ZCreateAttemptRequest>;
export type GetAttemptParams = z.infer<typeof ZGetAttemptParams>;
export type UpdateFeedbackRatingRequest = z.infer<typeof ZUpdateFeedbackRatingRequest>;
export type QuestionInAttempt = z.infer<typeof ZQuestionInAttempt>;
export type FeedbackResponse = z.infer<typeof ZFeedbackResponse>;
export type JobInAttemptResponse = z.infer<typeof ZJobInAttemptResponse>;
export type AttemptResponse = z.infer<typeof ZAttemptResponse>;
export type AttemptDetailResponse = z.infer<typeof ZAttemptDetailResponse>;
export type FeedbackRatingResponse = z.infer<typeof ZFeedbackRatingResponse>;
