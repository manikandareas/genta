import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  ZReadinessOverviewResponse,
  ZSectionDetailResponse,
  ZReadinessResponse,
  ZReadinessSectionParams,
  ZUpdateReadinessBody,
} from "@genta/zod";
import { getSecurityMetadata } from "@/utils.js";

const c = initContract();

export const readinessContract = c.router({
  // GET /api/v1/readiness
  getReadinessOverview: {
    summary: "Get readiness overview",
    path: "/api/v1/readiness",
    method: "GET",
    description: "Get overall readiness across all UTBK sections for the current user",
    responses: {
      200: ZReadinessOverviewResponse,
      401: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },

  // GET /api/v1/readiness/:section
  getSectionReadiness: {
    summary: "Get section readiness detail",
    path: "/api/v1/readiness/:section",
    method: "GET",
    description:
      "Get detailed readiness for a specific UTBK section including subtype breakdown and trends",
    pathParams: ZReadinessSectionParams,
    responses: {
      200: ZSectionDetailResponse,
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },

  // PATCH /api/v1/readiness/:section
  updateSectionReadiness: {
    summary: "Update section readiness settings",
    path: "/api/v1/readiness/:section",
    method: "PATCH",
    description: "Update target theta for a specific section",
    pathParams: ZReadinessSectionParams,
    body: ZUpdateReadinessBody,
    responses: {
      200: ZReadinessResponse,
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },
});
