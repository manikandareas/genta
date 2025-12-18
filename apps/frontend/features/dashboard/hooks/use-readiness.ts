"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/lib/api";
import { handleApiError, isSuccessResponse } from "@/lib/api/error-handler";
import type { ReadinessOverviewResponse } from "@genta/zod";

interface UseReadinessReturn {
  readiness: ReadinessOverviewResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useReadiness(): UseReadinessReturn {
  const router = useRouter();
  const api = useApiClient();
  const apiRef = useRef(api);
  apiRef.current = api;

  const [readiness, setReadiness] = useState<ReadinessOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchReadiness = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRef.current.Readiness.getReadinessOverview();

      if (isSuccessResponse(response.status)) {
        setReadiness(response.body as ReadinessOverviewResponse);
        return;
      }

      handleApiError(response.status, response.body, {
        onRedirect: (path) => router.push(path),
        showToast: false,
      });

      setError("Failed to load readiness data");
    } catch (err) {
      console.error("Error fetching readiness:", err);
      setError("Failed to load readiness data");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchReadiness();
    }
  }, [fetchReadiness]);

  return {
    readiness,
    isLoading,
    error,
    refetch: fetchReadiness,
  };
}
