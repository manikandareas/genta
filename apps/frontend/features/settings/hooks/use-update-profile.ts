"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApiClient } from "@/lib/api";
import { handleApiError, isSuccessResponse } from "@/lib/api/error-handler";
import type { User, PutUserRequest } from "@genta/zod";
import { toast } from "sonner";

interface UseUpdateProfileReturn {
  updateProfile: (data: PutUserRequest) => Promise<User | null>;
  isUpdating: boolean;
  error: string | null;
  fieldErrors: Record<string, string> | null;
}

export function useUpdateProfile(): UseUpdateProfileReturn {
  const router = useRouter();
  const api = useApiClient();
  const apiRef = useRef(api);
  apiRef.current = api;

  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null);

  const updateProfile = useCallback(
    async (data: PutUserRequest): Promise<User | null> => {
      setIsUpdating(true);
      setError(null);
      setFieldErrors(null);

      try {
        const response = await apiRef.current.User.updateMe({
          body: data,
        });

        if (isSuccessResponse(response.status)) {
          toast.success("Profile updated successfully");
          return response.body as User;
        }

        const errorResult = handleApiError(response.status, response.body, {
          onRedirect: (path) => router.push(path),
          showToast: true,
        });

        if (errorResult?.fieldErrors) {
          setFieldErrors(errorResult.fieldErrors);
        }

        setError("Failed to update profile");
        return null;
      } catch (err) {
        console.error("Error updating profile:", err);
        setError("Failed to update profile");
        toast.error("Failed to update profile");
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    [router],
  );

  return {
    updateProfile,
    isUpdating,
    error,
    fieldErrors,
  };
}
