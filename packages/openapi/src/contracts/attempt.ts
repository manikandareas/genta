import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  ZAttemptResponse,
  ZAttemptDetailResponse,
  ZCreateAttemptRequest,
  ZGetAttemptParams,
  ZUpdateFeedbackRatingRequest,
  ZFeedbackRatingResponse,
} from "@genta/zod";
import { getSecurityMetadata } from "@/utils.js";

const c = initContract();

export const attemptContract = c.router({
  // POST /api/v1/attempts
  createAttempt: {
    summary: "Record an answer attempt",
    path: "/api/v1/attempts",
    method: "POST",
    description:
      "Record a student's answer attempt, check correctness, and calculate IRT theta update",
    body: ZCreateAttemptRequest,
    responses: {
      201: ZAttemptResponse,
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },

  // GET /api/v1/attempts/:attempt_id
  getAttempt: {
    summary: "Get attempt by ID",
    path: "/api/v1/attempts/:attempt_id",
    method: "GET",
    description: "Get attempt details with question and feedback information",
    pathParams: ZGetAttemptParams,
    responses: {
      200: ZAttemptDetailResponse,
      401: z.object({ message: z.string() }),
      403: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },

  // PUT /api/v1/attempts/:attempt_id/feedback-rating
  updateFeedbackRating: {
    summary: "Rate feedback helpfulness",
    path: "/api/v1/attempts/:attempt_id/feedback-rating",
    method: "PUT",
    description: "Update the helpfulness rating for attempt feedback (thumbs up/down)",
    pathParams: ZGetAttemptParams,
    body: ZUpdateFeedbackRatingRequest,
    responses: {
      200: ZFeedbackRatingResponse,
      401: z.object({ message: z.string() }),
      403: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },
});
