import { z } from "zod";
import { ZSection } from "./question.js";

// === Request Schemas ===

// Create session request body
export const ZCreateSessionBody = z.object({
  section: ZSection.optional().nullable(),
});

// List sessions query params
export const ZListSessionsQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

// Session ID path params
export const ZSessionParams = z.object({
  session_id: z.string().max(100),
});

// === Response Schemas ===

// Session response
export const ZSessionResponse = z.object({
  id: z.string(),
  started_at: z.string().datetime(),
  ended_at: z.string().datetime().optional().nullable(),
  duration_minutes: z.number().int().optional().nullable(),
  questions_attempted: z.number().int(),
  questions_correct: z.number().int(),
  accuracy_in_session: z.number().optional().nullable(),
  section: ZSection.optional().nullable(),
});

// Paginated sessions response
export const ZSessionListResponse = z.object({
  data: z.array(ZSessionResponse),
  total: z.number().int(),
  page: z.number().int(),
  limit: z.number().int(),
  totalPages: z.number().int(),
});

// === Type Exports ===
export type CreateSessionBody = z.infer<typeof ZCreateSessionBody>;
export type ListSessionsQuery = z.infer<typeof ZListSessionsQuery>;
export type SessionParams = z.infer<typeof ZSessionParams>;
export type SessionResponse = z.infer<typeof ZSessionResponse>;
export type SessionListResponse = z.infer<typeof ZSessionListResponse>;
