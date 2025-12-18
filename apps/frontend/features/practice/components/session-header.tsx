"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { getSectionInfo, type Section } from "../types";

interface SessionHeaderProps {
  section: Section;
  questionsAttempted: number;
  totalQuestions?: number;
  timeElapsed: number;
  onEndSession: () => void;
  isEnding?: boolean;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function SessionHeader({
  section,
  questionsAttempted,
  totalQuestions = 20,
  timeElapsed,
  onEndSession,
  isEnding = false,
}: SessionHeaderProps) {
  const sectionInfo = getSectionInfo(section);
  const progress = (questionsAttempted / totalQuestions) * 100;

  return (
    <div className="border-b bg-card px-3 py-2 sm:px-4 sm:py-3">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-2 sm:gap-4">
        {/* Back button and section info */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onEndSession}
            disabled={isEnding}
            aria-label="End session"
            className="size-8 sm:size-9"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4 sm:size-5" />
          </Button>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-base sm:text-lg">{sectionInfo.icon}</span>
            <Badge
              variant={sectionInfo.category === "TPS" ? "default" : "secondary"}
              className="text-[10px] px-1.5 py-0.5 sm:text-xs sm:px-2 sm:py-0.5"
            >
              {sectionInfo.id}
            </Badge>
            <span className="text-muted-foreground hidden text-sm md:inline">
              {sectionInfo.name}
            </span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex flex-1 items-center gap-2 px-2 sm:gap-3 sm:px-4">
          <div className="flex-1">
            <Progress value={progress} className="h-1.5 sm:h-2" />
          </div>
          <span className="text-muted-foreground text-[10px] whitespace-nowrap sm:text-xs">
            {questionsAttempted}/{totalQuestions}
          </span>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <HugeiconsIcon icon={Clock01Icon} className="text-muted-foreground size-3.5 sm:size-4" />
          <span className="font-mono text-xs sm:text-sm">{formatTime(timeElapsed)}</span>
        </div>
      </div>
    </div>
  );
}
