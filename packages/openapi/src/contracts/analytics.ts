import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { ZProgressResponse, ZGetProgressQuery } from "@genta/zod";
import { getSecurityMetadata } from "@/utils.js";

const c = initContract();

export const analyticsContract = c.router({
  // GET /api/v1/analytics/progress
  getProgress: {
    summary: "Get progress analytics",
    path: "/api/v1/analytics/progress",
    method: "GET",
    description: "Get user's progress analytics including accuracy trend and section breakdown",
    query: ZGetProgressQuery,
    responses: {
      200: ZProgressResponse,
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },
});
