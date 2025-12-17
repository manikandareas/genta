import { z } from "zod";

// === Enums ===

export const ZJobStatus = z.enum(["queued", "processing", "completed", "failed"]);

// === Request Schemas ===

// Job ID path params
export const ZJobParams = z.object({
  job_id: z.string(),
});

// === Response Schemas ===

// Job status response (for processing/queued jobs)
export const ZJobStatusResponse = z.object({
  job_id: z.string(),
  status: ZJobStatus,
  attempt_id: z.string().optional(),
  estimated_completion_seconds: z.number().int().optional(),
});

// Job queued response (returned when job is created)
export const ZJobQueuedResponse = z.object({
  job_id: z.string(),
  attempt_id: z.string(),
  status: z.string(),
  estimated_completion_seconds: z.number().int(),
  check_status_url: z.string(),
});

// Feedback in completed job response
export const ZJobFeedback = z.object({
  id: z.string().uuid(),
  feedback_text: z.string(),
  model_used: z.string(),
  generation_time_ms: z.number().int().optional().nullable(),
});

// Job completed response (with feedback)
export const ZJobCompletedResponse = z.object({
  job_id: z.string(),
  status: ZJobStatus,
  attempt_id: z.string(),
  feedback: ZJobFeedback.optional().nullable(),
});

// === Type Exports ===
export type JobStatus = z.infer<typeof ZJobStatus>;
export type JobParams = z.infer<typeof ZJobParams>;
export type JobStatusResponse = z.infer<typeof ZJobStatusResponse>;
export type JobQueuedResponse = z.infer<typeof ZJobQueuedResponse>;
export type JobFeedback = z.infer<typeof ZJobFeedback>;
export type JobCompletedResponse = z.infer<typeof ZJobCompletedResponse>;
