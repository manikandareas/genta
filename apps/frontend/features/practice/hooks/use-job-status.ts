"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useApiClient } from "@/lib/api";
import { handleApiError } from "@/lib/api/error-handler";
import { mapFeedbackResponse, type Feedback } from "../types";
import type { JobCompletedResponse } from "@genta/zod";

interface UseJobStatusReturn {
  status: "idle" | "polling" | "completed" | "failed";
  feedback: Feedback | null;
  error: string | null;
  startPolling: (jobId: string) => void;
  stopPolling: () => void;
}

const POLL_INTERVAL = 2000; // 2 seconds
const MAX_POLL_ATTEMPTS = 30; // Max 60 seconds of polling

export function useJobStatus(): UseJobStatusReturn {
  const api = useApiClient();
  const apiRef = useRef(api);
  apiRef.current = api;

  const [status, setStatus] = useState<"idle" | "polling" | "completed" | "failed">("idle");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pollCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);

  const stopPolling = useCallback(() => {
    isPollingRef.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const checkJobStatus = useCallback(
    async (jobId: string) => {
      if (!isPollingRef.current) return;

      try {
        const response = await apiRef.current.Job.checkJobStatus({
          params: { job_id: jobId },
          body: {},
        });

        // Job completed (200)
        if (response.status === 200) {
          const body = response.body as JobCompletedResponse;
          if (body.feedback) {
            setFeedback(
              mapFeedbackResponse({
                id: body.feedback.id,
                feedback_text: body.feedback.feedback_text,
                model_used: body.feedback.model_used,
                generation_time_ms: body.feedback.generation_time_ms ?? null,
                is_helpful: null,
              }),
            );
          }
          setStatus("completed");
          stopPolling();
          return;
        }

        // Job still processing (202)
        if (response.status === 202) {
          pollCountRef.current += 1;

          if (pollCountRef.current >= MAX_POLL_ATTEMPTS) {
            setError("Feedback generation timed out");
            setStatus("failed");
            stopPolling();
            return;
          }

          // Continue polling
          timeoutRef.current = setTimeout(() => {
            checkJobStatus(jobId);
          }, POLL_INTERVAL);
          return;
        }

        // Handle errors - don't redirect on 401 during practice
        handleApiError(response.status, response.body, {
          onRedirect: undefined,
          showToast: false,
        });

        setError("Failed to check job status");
        setStatus("failed");
        stopPolling();
      } catch (err) {
        console.error("Error checking job status:", err);
        setError("Failed to check job status");
        setStatus("failed");
        stopPolling();
      }
    },
    [stopPolling],
  );

  const startPolling = useCallback(
    (jobId: string) => {
      // Reset state
      pollCountRef.current = 0;
      setStatus("polling");
      setFeedback(null);
      setError(null);
      isPollingRef.current = true;

      // Start polling
      checkJobStatus(jobId);
    },
    [checkJobStatus],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    status,
    feedback,
    error,
    startPolling,
    stopPolling,
  };
}
