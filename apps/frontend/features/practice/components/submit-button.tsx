"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, CheckmarkCircle01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

interface SubmitButtonProps {
  onSubmit: () => void;
  onNext: () => void;
  onFinish: () => void;
  isSubmitting: boolean;
  showResult: boolean;
  hasSelectedAnswer: boolean;
  questionsAttempted: number;
  maxQuestions?: number;
}

const DEFAULT_MAX_QUESTIONS = 20;

export function SubmitButton({
  onSubmit,
  onNext,
  onFinish,
  isSubmitting,
  showResult,
  hasSelectedAnswer,
  questionsAttempted,
  maxQuestions = DEFAULT_MAX_QUESTIONS,
}: SubmitButtonProps) {
  const isLastQuestion = questionsAttempted >= maxQuestions;

  if (showResult) {
    // Show "Selesai" button if this is the last question (20th)
    if (isLastQuestion) {
      return (
        <Button onClick={onFinish} size="lg" className="w-full sm:w-auto">
          <HugeiconsIcon icon={Tick02Icon} data-icon="inline-start" />
          <span>Selesai</span>
        </Button>
      );
    }

    return (
      <Button onClick={onNext} size="lg" className="w-full sm:w-auto">
        <span>Soal Berikutnya</span>
        <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
      </Button>
    );
  }

  return (
    <Button
      onClick={onSubmit}
      disabled={!hasSelectedAnswer || isSubmitting}
      size="lg"
      className="w-full sm:w-auto"
    >
      {isSubmitting ? (
        <>
          <Spinner className="size-4" />
          <span>Memeriksa...</span>
        </>
      ) : (
        <>
          <HugeiconsIcon icon={CheckmarkCircle01Icon} data-icon="inline-start" />
          <span>Jawab</span>
        </>
      )}
    </Button>
  );
}
