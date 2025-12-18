"use client";

import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";

interface ResultDisplayProps {
  isCorrect: boolean;
  thetaChange?: number | null;
}

export function ResultDisplay({ isCorrect, thetaChange }: ResultDisplayProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg p-4",
        isCorrect
          ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
          : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400",
      )}
    >
      <HugeiconsIcon
        icon={isCorrect ? CheckmarkCircle01Icon : Cancel01Icon}
        className="size-6 shrink-0"
      />
      <div className="flex-1">
        <p className="font-medium">{isCorrect ? "Jawaban Benar!" : "Jawaban Salah"}</p>
        {thetaChange !== null && thetaChange !== undefined && (
          <p className="text-xs opacity-80">
            Skill level: {thetaChange > 0 ? "+" : ""}
            {thetaChange.toFixed(3)}
          </p>
        )}
      </div>
    </div>
  );
}
