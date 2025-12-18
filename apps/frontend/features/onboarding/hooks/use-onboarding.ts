"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/lib/api";
import { handleApiError, isSuccessResponse } from "@/lib/api/error-handler";
import type { OnboardingFormData, OnboardingValidationErrors } from "../types";

interface UseOnboardingReturn {
  submitOnboarding: (data: OnboardingFormData) => Promise<void>;
  isSubmitting: boolean;
  serverErrors: OnboardingValidationErrors;
}

export function useOnboarding(): UseOnboardingReturn {
  const router = useRouter();
  const api = useApiClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<OnboardingValidationErrors>({});

  const submitOnboarding = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    setServerErrors({});

    try {
      const response = await api.User.completeOnboarding({
        body: {
          targetPtn: data.targetPtn,
          targetScore: data.targetScore,
          examDate: data.examDate.toISOString(),
          studyHoursPerWeek: data.studyHoursPerWeek,
        },
      });

      if (isSuccessResponse(response.status)) {
        router.push("/dashboard");
        return;
      }

      const result = handleApiError(response.status, response.body, {
        onRedirect: (path) => router.push(path),
      });

      if (result.fieldErrors) {
        const mappedErrors: OnboardingValidationErrors = {};
        if (result.fieldErrors.target_ptn) {
          mappedErrors.targetPtn = result.fieldErrors.target_ptn;
        }
        if (result.fieldErrors.target_score) {
          mappedErrors.targetScore = result.fieldErrors.target_score;
        }
        if (result.fieldErrors.exam_date) {
          mappedErrors.examDate = result.fieldErrors.exam_date;
        }
        if (result.fieldErrors.study_hours_per_week) {
          mappedErrors.studyHoursPerWeek = result.fieldErrors.study_hours_per_week;
        }
        setServerErrors(mappedErrors);
      }
    } catch (error) {
      console.error("Onboarding submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitOnboarding,
    isSubmitting,
    serverErrors,
  };
}
