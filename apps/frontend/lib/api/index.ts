"use client";
import { apiContract } from "@genta/openapi/contracts";
import { useAuth } from "@clerk/clerk-react";
import { initClient } from "@ts-rest/core";
import axios, { type Method, type AxiosError, isAxiosError, type AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { env } from "../env";

type Headers = Awaited<ReturnType<NonNullable<Parameters<typeof initClient>[1]["api"]>>>["headers"];

export type TApiClient = ReturnType<typeof useApiClient>;

/**
 * Options for the API client hook
 */
interface UseApiClientOptions {
  /** Whether to expect blob response */
  isBlob?: boolean;
  /** Whether to automatically redirect on 401 errors (default: true) */
  redirectOnUnauthorized?: boolean;
}

/**
 * Hook to create a type-safe API client with authentication
 * Automatically handles 401 errors by redirecting to sign-in
 */
export const useApiClient = ({
  isBlob = false,
  redirectOnUnauthorized = true,
}: UseApiClientOptions = {}) => {
  const { getToken } = useAuth();
  const router = useRouter();

  const handleUnauthorized = useCallback(() => {
    if (redirectOnUnauthorized && typeof window !== "undefined") {
      router.push("/sign-in");
    }
  }, [redirectOnUnauthorized, router]);

  return useMemo(
    () =>
      initClient(apiContract, {
        baseUrl: "",
        baseHeaders: {
          "Content-Type": "application/json",
        },
        api: async ({ path, method, headers, body }) => {
          const token = await getToken();

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const makeRequest = async (retryCount = 0): Promise<any> => {
            try {
              const result = await axios.request({
                method: method as Method,
                url: `${env.NEXT_PUBLIC_API_URL}${path}`,
                headers: {
                  ...headers,
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                data: body,
                ...(isBlob ? { responseType: "blob" } : {}),
              });
              return {
                status: result.status,
                body: result.data,
                headers: result.headers as unknown as Headers,
              };
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: Error | AxiosError | any) {
              if (isAxiosError(e)) {
                const error = e as AxiosError;
                const response = error.response as AxiosResponse;

                // If unauthorized and we haven't retried yet, retry once
                if (response?.status === 401 && retryCount < 1) {
                  return makeRequest(retryCount + 1);
                }

                // If still unauthorized after retry, redirect to sign-in
                if (response?.status === 401) {
                  handleUnauthorized();
                }

                return {
                  status: response?.status || 500,
                  body: response?.data || { message: "Internal server error" },
                  headers: (response?.headers as unknown as Headers) || {},
                };
              }
              throw e;
            }
          };

          return makeRequest();
        },
      }),
    [getToken, isBlob, handleUnauthorized],
  );
};
