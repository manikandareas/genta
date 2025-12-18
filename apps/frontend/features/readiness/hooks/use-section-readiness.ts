"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/lib/api";
import { handleApiError, isSuccessResponse } from "@/lib/api/error-handler";
import type { SectionDetailResponse } from "@genta/zod";
import type { Section } from "../types";

interface UseSectionReadinessReturn {
  data: SectionDetailResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSectionReadiness(section: Section): UseSectionReadinessReturn {
  const router = useRouter();
  const api = useApiClient();
  const apiRef = useRef(api);
  apiRef.current = api;

  const [data, setData] = useState<SectionDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);
  const currentSection = useRef(section);

  const fetchSectionReadiness = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRef.current.Readiness.getSectionReadiness({
        params: { section },
      });

      if (isSuccessResponse(response.status)) {
        setData(response.body as SectionDetailResponse);
        return;
      }

      handleApiError(response.status, response.body, {
        onRedirect: (path) => router.push(path),
        showToast: false,
      });

      setError("Failed to load readiness data");
    } catch (err) {
      console.error("Error fetching section readiness:", err);
      setError("Failed to load readiness data");
    } finally {
      setIsLoading(false);
    }
  }, [router, section]);

  useEffect(() => {
    // Refetch if section changes
    if (currentSection.current !== section) {
      currentSection.current = section;
      hasFetched.current = false;
    }

    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchSectionReadiness();
    }
  }, [fetchSectionReadiness, section]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchSectionReadiness,
  };
}
