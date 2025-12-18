"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ThumbsUpIcon,
  ThumbsDownIcon,
  SparklesIcon,
  BookOpen01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { Feedback, QuestionExplanation } from "../types";

interface FeedbackPanelProps {
  feedback: Feedback | null;
  questionExplanation: QuestionExplanation | null;
  isLoading: boolean;
  onRate: (isHelpful: boolean) => void;
  isRating?: boolean;
}

export function FeedbackPanel({
  feedback,
  questionExplanation,
  isLoading,
  onRate,
  isRating = false,
}: FeedbackPanelProps) {
  // Show loading state for AI feedback
  const showAiFeedbackLoading = isLoading;

  // Show explanation if available
  const hasExplanation = questionExplanation?.explanation;

  // Show AI feedback if available
  const hasAiFeedback = feedback?.feedbackText;

  // If nothing to show and not loading, return null
  if (!showAiFeedbackLoading && !hasExplanation && !hasAiFeedback) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Question Explanation */}
      {hasExplanation && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <HugeiconsIcon icon={BookOpen01Icon} className="size-4 text-blue-500" />
              Pembahasan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: questionExplanation.explanation ?? "" }}
            />
          </CardContent>
        </Card>
      )}

      {/* AI Feedback Loading */}
      {showAiFeedbackLoading && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <HugeiconsIcon icon={SparklesIcon} className="size-4 text-primary" />
              AI Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
            <p className="text-muted-foreground text-xs">Generating feedback...</p>
          </CardContent>
        </Card>
      )}

      {/* AI Feedback */}
      {hasAiFeedback && !showAiFeedbackLoading && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <HugeiconsIcon icon={SparklesIcon} className="size-4 text-primary" />
                AI Feedback
              </CardTitle>
              {feedback.generationTimeMs && (
                <span className="text-muted-foreground text-xs">
                  {(feedback.generationTimeMs / 1000).toFixed(1)}s
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: feedback.feedbackText }}
            />

            {/* Rating buttons */}
            <div className="flex items-center gap-2 border-t pt-4">
              <span className="text-muted-foreground text-xs">Apakah feedback ini membantu?</span>
              <div className="flex gap-1">
                <Button
                  variant={feedback.isHelpful === true ? "default" : "outline"}
                  size="icon-sm"
                  onClick={() => onRate(true)}
                  disabled={isRating || feedback.isHelpful !== null}
                  className={cn(feedback.isHelpful === true && "bg-green-500 hover:bg-green-600")}
                >
                  <HugeiconsIcon icon={ThumbsUpIcon} />
                </Button>
                <Button
                  variant={feedback.isHelpful === false ? "default" : "outline"}
                  size="icon-sm"
                  onClick={() => onRate(false)}
                  disabled={isRating || feedback.isHelpful !== null}
                  className={cn(feedback.isHelpful === false && "bg-red-500 hover:bg-red-600")}
                >
                  <HugeiconsIcon icon={ThumbsDownIcon} />
                </Button>
              </div>
              {feedback.isHelpful !== null && (
                <span className="text-muted-foreground text-xs">Terima kasih!</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
