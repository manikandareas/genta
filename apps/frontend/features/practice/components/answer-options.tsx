"use client";

import { cn } from "@/lib/utils";
import type { Answer } from "../types";

interface AnswerOptionsProps {
  options: string[];
  selectedAnswer: Answer | null;
  correctAnswer?: Answer | null;
  showResult?: boolean;
  onSelect: (answer: Answer) => void;
  disabled?: boolean;
}

const ANSWER_LABELS: Answer[] = ["A", "B", "C", "D", "E"];

export function AnswerOptions({
  options,
  selectedAnswer,
  correctAnswer,
  showResult = false,
  onSelect,
  disabled = false,
}: AnswerOptionsProps) {
  const getOptionStyle = (label: Answer) => {
    if (!showResult) {
      return selectedAnswer === label
        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
        : "border-border hover:border-primary/50 hover:bg-muted/50";
    }

    // Show result mode
    if (label === correctAnswer) {
      return "border-green-500 bg-green-50 dark:bg-green-950/30";
    }
    if (label === selectedAnswer && label !== correctAnswer) {
      return "border-red-500 bg-red-50 dark:bg-red-950/30";
    }
    return "border-border opacity-60";
  };

  const getLabelStyle = (label: Answer) => {
    if (!showResult) {
      return selectedAnswer === label
        ? "bg-primary text-primary-foreground"
        : "bg-muted text-muted-foreground";
    }

    if (label === correctAnswer) {
      return "bg-green-500 text-white";
    }
    if (label === selectedAnswer && label !== correctAnswer) {
      return "bg-red-500 text-white";
    }
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-2">
      {options.map((option, index) => {
        const label = ANSWER_LABELS[index];
        return (
          <button
            key={label}
            type="button"
            onClick={() => onSelect(label)}
            disabled={disabled || showResult}
            className={cn(
              "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all",
              getOptionStyle(label),
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                getLabelStyle(label),
              )}
            >
              {label}
            </span>
            <span className="text-sm leading-relaxed">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
