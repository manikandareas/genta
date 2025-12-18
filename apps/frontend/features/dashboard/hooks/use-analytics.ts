"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/lib/api";
import { handleApiError, isSuccessResponse } from "@/lib/api/error-handler";
import type { ProgressResponse } from "@genta/zod";

interface UseAnalyticsReturn {
  analytics: ProgressResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: (days?: number) => Promise<void>;
}

export function useAnalytics(initialDays: number = 7): UseAnalyticsReturn {
  const router = useRouter();
  const api = useApiClient();
  const apiRef = useRef(api);
  apiRef.current = api;

  const [analytics, setAnalytics] = useState<ProgressResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(initialDays);
  const hasFetched = useRef(false);

  const fetchAnalytics = useCallback(
    async (fetchDays?: number) => {
      const daysToFetch = fetchDays ?? days;
      if (fetchDays !== undefined) {
        setDays(fetchDays);
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiRef.current.Analytics.getProgress({
          query: { days: daysToFetch },
        });

        if (isSuccessResponse(response.status)) {
          setAnalytics(response.body as ProgressResponse);
          return;
        }

        handleApiError(response.status, response.body, {
          onRedirect: (path) => router.push(path),
          showToast: false,
        });

        setError("Failed to load analytics data");
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics data");
      } finally {
        setIsLoading(false);
      }
    },
    [router, days],
  );

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchAnalytics();
    }
  }, [fetchAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    refetch: fetchAnalytics,
  };
}
