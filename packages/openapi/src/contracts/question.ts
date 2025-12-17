import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  ZQuestionResponse,
  ZQuestionDetailResponse,
  ZQuestionListResponse,
  ZListQuestionsQuery,
  ZGetNextQuestionQuery,
  ZGetQuestionParams,
} from "@genta/zod";
import { getSecurityMetadata } from "@/utils.js";

const c = initContract();

export const questionContract = c.router({
  // GET /api/v1/questions
  listQuestions: {
    summary: "List questions",
    path: "/api/v1/questions",
    method: "GET",
    description: "Get paginated list of questions with optional section filter",
    query: ZListQuestionsQuery,
    responses: {
      200: ZQuestionListResponse,
      401: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },

  // GET /api/v1/questions/next
  getNextQuestion: {
    summary: "Get next question for practice",
    path: "/api/v1/questions/next",
    method: "GET",
    description:
      "Get the next question for adaptive learning based on user's skill level and section",
    query: ZGetNextQuestionQuery,
    responses: {
      200: ZQuestionResponse,
      401: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },

  // GET /api/v1/questions/:id
  getQuestion: {
    summary: "Get question by ID",
    path: "/api/v1/questions/:id",
    method: "GET",
    description: "Get a single question with full details including correct answer and explanation",
    pathParams: ZGetQuestionParams,
    responses: {
      200: ZQuestionDetailResponse,
      401: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },
});
