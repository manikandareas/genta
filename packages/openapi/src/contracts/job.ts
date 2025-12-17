import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { ZJobParams, ZJobStatusResponse } from "@genta/zod";
import { getSecurityMetadata } from "@/utils.js";

const c = initContract();

export const jobContract = c.router({
  // POST /api/v1/jobs/:job_id/check
  checkJobStatus: {
    summary: "Check async job status",
    path: "/api/v1/jobs/:job_id/check",
    method: "POST",
    description:
      "Check the status of an async job (feedback generation, etc). Returns 200 for completed jobs, 202 for processing jobs.",
    pathParams: ZJobParams,
    body: z.object({}).optional(),
    responses: {
      200: ZJobStatusResponse.describe("Job completed"),
      202: ZJobStatusResponse.describe("Job still processing"),
      404: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },
});
