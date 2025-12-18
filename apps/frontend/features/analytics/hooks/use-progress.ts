"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/lib/api";
import { handleApiError, isSuccessResponse } from "@/lib/api/error-handler";
import type { ProgressResponse } from "@genta/zod";
import type { TimeRange } from "../types";

interface UseProgressReturn {
  progress: ProgressResponse | null;
  isLoading: boolean;
  error: string | null;
  days: TimeRange;
  setDays: (days: TimeRange) => void;
  refetch: () => Promise<void>;
}

export function useProgress(initialDays: TimeRange = 7): UseProgressReturn {
  const router = useRouter();
  const api = useApiClient();
  const apiRef = useRef(api);
  apiRef.current = api;

  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState<TimeRange>(initialDays);
  const hasFetched = useRef(false);

  const fetchProgress = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRef.current.Analytics.getProgress({
        query: { days },
      });

      if (isSuccessResponse(response.status)) {
        setProgress(response.body as ProgressResponse);
        return;
      }

      handleApiError(response.status, response.body, {
        onRedirect: (path) => router.push(path),
        showToast: false,
      });

      setError("Gagal memuat data analytics");
    } catch (err) {
      console.error("Error fetching progress:", err);
      setError("Gagal memuat data analytics");
    } finally {
      setIsLoading(false);
    }
  }, [router, days]);

  // Initial fetch
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchProgress();
    }
  }, [fetchProgress]);

  // Refetch when days changes (after initial fetch)
  useEffect(() => {
    if (hasFetched.current) {
      fetchProgress();
    }
  }, [days, fetchProgress]);

  const handleSetDays = useCallback((newDays: TimeRange) => {
    setDays(newDays);
  }, []);

  return {
    progress,
    isLoading,
    error,
    days,
    setDays: handleSetDays,
    refetch: fetchProgress,
  };
}
