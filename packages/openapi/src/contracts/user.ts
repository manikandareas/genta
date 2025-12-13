import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  ZUserResponse,
  ZPutUserRequest,
  ZCompleteOnboardingRequest,
  ZCompleteOnboardingResponse,
} from "@genta/zod";
import { getSecurityMetadata } from "@/utils.js";

const c = initContract();

export const userContract = c.router({
  // GET /api/v1/users/me
  getMe: {
    summary: "Get current user",
    path: "/api/v1/users/me",
    method: "GET",
    description: "Get the currently authenticated user's profile",
    responses: {
      200: ZUserResponse,
      401: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },

  // PUT /api/v1/users/me
  updateMe: {
    summary: "Update current user",
    path: "/api/v1/users/me",
    method: "PUT",
    description: "Update the currently authenticated user's profile",
    body: ZPutUserRequest,
    responses: {
      200: ZUserResponse,
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },

  // POST /api/v1/users/onboarding
  completeOnboarding: {
    summary: "Complete user onboarding",
    path: "/api/v1/users/onboarding",
    method: "POST",
    description: "Complete the onboarding process for the current user",
    body: ZCompleteOnboardingRequest,
    responses: {
      200: ZCompleteOnboardingResponse,
      400: z.object({ message: z.string() }),
      401: z.object({ message: z.string() }),
      404: z.object({ message: z.string() }),
    },
    metadata: getSecurityMetadata(),
  },
});
