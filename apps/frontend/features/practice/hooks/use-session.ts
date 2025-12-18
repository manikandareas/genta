"use client";

import { useState, useCallback, useRef } from "react";
import { useApiClient } from "@/lib/api";
import { handleApiError, isSuccessResponse } from "@/lib/api/error-handler";
import { mapSessionResponse, type Session, type Section } from "../types";
import type { SessionResponse } from "@genta/zod";

interface UseSessionReturn {
  session: Session | null;
  isCreating: boolean;
  isEnding: boolean;
  error: string | null;
  createSession: (section: Section) => Promise<Session | null>;
  endSession: (sessionId: string) => Promise<Session | null>;
  getSession: (sessionId: string) => Promise<Session | null>;
}

export function useSession(): UseSessionReturn {
  const api = useApiClient();
  const apiRef = useRef(api);
  apiRef.current = api;

  const [session, setSession] = useState<Session | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = useCallback(async (section: Section): Promise<Session | null> => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await apiRef.current.Session.createSession({
        body: { section },
      });

      if (isSuccessResponse(response.status)) {
        const mappedSession = mapSessionResponse(response.body as SessionResponse);
        setSession(mappedSession);
        return mappedSession;
      }

      // Don't redirect on 401 during practice - just show error
      handleApiError(response.status, response.body, {
        onRedirect: undefined,
        showToast: true,
      });

      setError("Failed to create session");
      return null;
    } catch (err) {
      console.error("Error creating session:", err);
      setError("Failed to create session");
      return null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const endSession = useCallback(async (sessionId: string): Promise<Session | null> => {
    setIsEnding(true);
    setError(null);

    try {
      const response = await apiRef.current.Session.endSession({
        params: { session_id: sessionId },
        body: {},
      });

      if (isSuccessResponse(response.status)) {
        const mappedSession = mapSessionResponse(response.body as SessionResponse);
        setSession(mappedSession);
        return mappedSession;
      }

      // Don't redirect on 401 during practice - just show error
      handleApiError(response.status, response.body, {
        onRedirect: undefined,
        showToast: true,
      });

      setError("Failed to end session");
      return null;
    } catch (err) {
      console.error("Error ending session:", err);
      setError("Failed to end session");
      return null;
    } finally {
      setIsEnding(false);
    }
  }, []);

  const getSession = useCallback(async (sessionId: string): Promise<Session | null> => {
    setError(null);

    try {
      const response = await apiRef.current.Session.getSession({
        params: { session_id: sessionId },
      });

      if (isSuccessResponse(response.status)) {
        const mappedSession = mapSessionResponse(response.body as SessionResponse);
        setSession(mappedSession);
        return mappedSession;
      }

      // Don't redirect on 401 during practice - just show error
      handleApiError(response.status, response.body, {
        onRedirect: undefined,
        showToast: false,
      });

      setError("Failed to get session");
      return null;
    } catch (err) {
      console.error("Error getting session:", err);
      setError("Failed to get session");
      return null;
    }
  }, []);

  return {
    session,
    isCreating,
    isEnding,
    error,
    createSession,
    endSession,
    getSession,
  };
}
