"use client";

import { useState, useCallback, useRef } from "react";
import { useApiClient } from "@/lib/api";
import { handleApiError, isSuccessResponse } from "@/lib/api/error-handler";
import {
  mapAttemptResponse,
  mapFeedbackResponse,
  type Attempt,
  type Answer,
  type Feedback,
  type QuestionExplanation,
} from "../types";
import type { AttemptResponse, AttemptDetailResponse, Answer as ZodAnswer } from "@genta/zod";

interface CreateAttemptParams {
  questionId: string;
  selectedAnswer: Answer;
  timeSpentSeconds: number;
  sessionId: string;
}

interface AttemptDetailResult {
  attempt: Attempt;
  correctAnswer: Answer;
  questionExplanation: QuestionExplanation | null;
  feedback: Feedback | null;
}

interface UseAttemptReturn {
  attempt: Attempt | null;
  correctAnswer: Answer | null;
  questionExplanation: QuestionExplanation | null;
  feedback: Feedback | null;
  isSubmitting: boolean;
  error: string | null;
  submitAttempt: (params: CreateAttemptParams) => Promise<Attempt | null>;
  getAttemptDetail: (attemptId: string) => Promise<AttemptDetailResult | null>;
  clearAttempt: () => void;
}

export function useAttempt(): UseAttemptReturn {
  const api = useApiClient();
  const apiRef = useRef(api);
  apiRef.current = api;

  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState<Answer | null>(null);
  const [questionExplanation, setQuestionExplanation] = useState<QuestionExplanation | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAttempt = useCallback(
    async (params: CreateAttemptParams): Promise<Attempt | null> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await apiRef.current.Attempt.createAttempt({
          body: {
            question_id: params.questionId,
            selected_answer: params.selectedAnswer as ZodAnswer,
            time_spent_seconds: params.timeSpentSeconds,
            session_id: params.sessionId,
          },
        });

        if (isSuccessResponse(response.status)) {
          const mappedAttempt = mapAttemptResponse(response.body as AttemptResponse);
          setAttempt(mappedAttempt);
          return mappedAttempt;
        }

        // Don't redirect on 401 during practice - just show error
        handleApiError(response.status, response.body, {
          onRedirect: undefined, // Don't redirect during practice
          showToast: true,
        });

        setError("Failed to submit answer");
        return null;
      } catch (err) {
        console.error("Error submitting attempt:", err);
        setError("Failed to submit answer");
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const getAttemptDetail = useCallback(
    async (attemptId: string): Promise<AttemptDetailResult | null> => {
      setError(null);

      try {
        const response = await apiRef.current.Attempt.getAttempt({
          params: { attempt_id: attemptId },
        });

        if (isSuccessResponse(response.status)) {
          const body = response.body as AttemptDetailResponse;
          const mappedAttempt: Attempt = {
            id: body.id,
            questionId: body.question_id,
            selectedAnswer: body.selected_answer as Answer,
            isCorrect: body.is_correct,
            timeSpentSeconds: body.time_spent_seconds,
            thetaBefore: null,
            thetaAfter: null,
            thetaChange: body.theta_change ?? null,
            feedbackGenerated: body.feedback !== null,
            sessionId: null,
            createdAt: body.created_at,
            job: null,
          };

          // Extract question explanation
          const explanation: QuestionExplanation | null = body.question
            ? {
                text: body.question.text,
                explanation: body.question.explanation,
              }
            : null;

          // Extract feedback
          const mappedFeedback: Feedback | null = body.feedback
            ? mapFeedbackResponse(body.feedback)
            : null;

          setAttempt(mappedAttempt);
          setCorrectAnswer(body.correct_answer as Answer);
          setQuestionExplanation(explanation);
          setFeedback(mappedFeedback);

          return {
            attempt: mappedAttempt,
            correctAnswer: body.correct_answer as Answer,
            questionExplanation: explanation,
            feedback: mappedFeedback,
          };
        }

        // Don't redirect on 401 during practice - just show error
        handleApiError(response.status, response.body, {
          onRedirect: undefined, // Don't redirect during practice
          showToast: false,
        });

        setError("Failed to get attempt details");
        return null;
      } catch (err) {
        console.error("Error getting attempt details:", err);
        setError("Failed to get attempt details");
        return null;
      }
    },
    [],
  );

  const clearAttempt = useCallback(() => {
    setAttempt(null);
    setCorrectAnswer(null);
    setQuestionExplanation(null);
    setFeedback(null);
    setError(null);
  }, []);

  return {
    attempt,
    correctAnswer,
    questionExplanation,
    feedback,
    isSubmitting,
    error,
    submitAttempt,
    getAttemptDetail,
    clearAttempt,
  };
}
