"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/lib/api";
import { handleApiError, isSuccessResponse } from "@/lib/api/error-handler";
import type { User } from "@genta/zod";

interface UseProfileReturn {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const router = useRouter();
  const api = useApiClient();
  const apiRef = useRef(api);
  apiRef.current = api;

  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRef.current.User.getMe();

      if (isSuccessResponse(response.status)) {
        setProfile(response.body as User);
        return;
      }

      handleApiError(response.status, response.body, {
        onRedirect: (path) => router.push(path),
        showToast: false,
      });

      setError("Failed to load profile data");
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchProfile();
    }
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
  };
}
