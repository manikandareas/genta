"use client";

import { useState, useCallback, useRef } from "react";
import { useApiClient } from "@/lib/api";
import { handleApiError, isSuccessResponse } from "@/lib/api/error-handler";

interface UseFeedbackRatingReturn {
  isRating: boolean;
  error: string | null;
  rateFeedback: (attemptId: string, isHelpful: boolean) => Promise<boolean>;
}

export function useFeedbackRating(): UseFeedbackRatingReturn {
  const api = useApiClient();
  const apiRef = useRef(api);
  apiRef.current = api;

  const [isRating, setIsRating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rateFeedback = useCallback(
    async (attemptId: string, isHelpful: boolean): Promise<boolean> => {
      setIsRating(true);
      setError(null);

      try {
        const response = await apiRef.current.Attempt.updateFeedbackRating({
          params: { attempt_id: attemptId },
          body: { is_helpful: isHelpful },
        });

        if (isSuccessResponse(response.status)) {
          return true;
        }

        // Don't redirect on 401 during practice - just show error
        handleApiError(response.status, response.body, {
          onRedirect: undefined,
          showToast: true,
        });

        setError("Failed to rate feedback");
        return false;
      } catch (err) {
        console.error("Error rating feedback:", err);
        setError("Failed to rate feedback");
        return false;
      } finally {
        setIsRating(false);
      }
    },
    [],
  );

  return {
    isRating,
    error,
    rateFeedback,
  };
}
