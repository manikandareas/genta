import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  ZSessionResponse,
  ZSessionListResponse,
  ZCreateSessionBody,
  ZListSessionsQuery,
  ZSessionParams,
} from "@genta/zod";
import { getSecurityMetadata } from "@/utils.js";

const c = initContract();

export const sessionContract = c.router({
  // GET /api/v1/sessions
  listSessions: {
    summary: "List study sessions",
    path: "/api/v1/sessions",
    method: "GET",
    description: "Get paginated list of study sessions for the current user",
    query: ZListSessionsQuery,
    responses: {
      200: ZSessionListResponse,
      401: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },

  // POST /api/v1/sessions
  createSession: {
    summary: "Start a new study session",
    path: "/api/v1/sessions",
    method: "POST",
    description: "Start a new study session for the current user",
    body: ZCreateSessionBody,
    responses: {
      201: ZSessionResponse,
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },

  // GET /api/v1/sessions/:session_id
  getSession: {
    summary: "Get study session by ID",
    path: "/api/v1/sessions/:session_id",
    method: "GET",
    description: "Get details of a specific study session",
    pathParams: ZSessionParams,
    responses: {
      200: ZSessionResponse,
      401: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },

  // PUT /api/v1/sessions/:session_id/end
  endSession: {
    summary: "End a study session",
    path: "/api/v1/sessions/:session_id/end",
    method: "PUT",
    description: "End a study session and calculate duration/accuracy",
    pathParams: ZSessionParams,
    body: z.object({}).optional(),
    responses: {
      200: ZSessionResponse,
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },
});
