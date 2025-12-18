"use client";

import { useState, useCallback, useRef } from "react";
import { useApiClient } from "@/lib/api";
import { handleApiError, isSuccessResponse } from "@/lib/api/error-handler";
import { mapQuestionResponse, type Question, type Section } from "../types";
import type { QuestionResponse } from "@genta/zod";

interface UseNextQuestionReturn {
  question: Question | null;
  isLoading: boolean;
  error: string | null;
  fetchNextQuestion: (section: Section) => Promise<Question | null>;
  clearQuestion: () => void;
}

export function useNextQuestion(): UseNextQuestionReturn {
  const api = useApiClient();
  const apiRef = useRef(api);
  apiRef.current = api;

  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNextQuestion = useCallback(async (section: Section): Promise<Question | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRef.current.Question.getNextQuestion({
        query: { section },
      });

      if (isSuccessResponse(response.status)) {
        const mappedQuestion = mapQuestionResponse(response.body as QuestionResponse);
        setQuestion(mappedQuestion);
        return mappedQuestion;
      }

      // Handle 404 - no more questions available
      if (response.status === 404) {
        setError("No more questions available for this section");
        return null;
      }

      // Don't redirect on 401 during practice - just show error
      handleApiError(response.status, response.body, {
        onRedirect: undefined,
        showToast: true,
      });

      setError("Failed to fetch question");
      return null;
    } catch (err) {
      console.error("Error fetching next question:", err);
      setError("Failed to fetch question");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearQuestion = useCallback(() => {
    setQuestion(null);
    setError(null);
  }, []);

  return {
    question,
    isLoading,
    error,
    fetchNextQuestion,
    clearQuestion,
  };
}
