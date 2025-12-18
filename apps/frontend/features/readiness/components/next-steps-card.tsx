"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import { Award01Icon, Target01Icon, Calendar01Icon, PlayIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import type { NextStepsResponse } from "@genta/zod";
import type { Section } from "../types";

interface NextStepsCardProps {
  data: NextStepsResponse | null | undefined;
  section: Section;
  readinessPercentage: number;
  isLoading?: boolean;
}

export function NextStepsCard({
  data,
  section,
  readinessPercentage,
  isLoading,
}: NextStepsCardProps) {
  if (isLoading) {
    return (
      <Card className="border bg-card/50 shadow-none">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  const isReady = readinessPercentage >= 75;

  // Format estimated completion date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const estimatedDate = formatDate(data?.estimated_completion_date);

  return (
    <Card
      className={`border shadow-none ${
        isReady ? "border-emerald-500/30 bg-emerald-500/5" : "border-amber-500/30 bg-amber-500/5"
      }`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          {isReady ? (
            <>
              <HugeiconsIcon icon={Award01Icon} className="size-4 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Congratulations!</span>
            </>
          ) : (
            <>
              <HugeiconsIcon icon={Target01Icon} className="size-4 text-amber-500" />
              <span className="text-amber-600 dark:text-amber-400">Next Steps</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Message */}
        <p
          className={`text-sm ${
            isReady
              ? "text-emerald-700 dark:text-emerald-300"
              : "text-amber-700 dark:text-amber-300"
          }`}
        >
          {data?.message ??
            (isReady
              ? "You're ready for this section! Keep practicing to maintain your level."
              : "Keep practicing to improve your readiness.")}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {!isReady && data?.suggested_daily_practice && (
            <div className="rounded-lg bg-background/50 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <HugeiconsIcon icon={Target01Icon} className="size-3" />
                Daily Target
              </div>
              <p className="mt-1 text-lg font-bold">
                {data.suggested_daily_practice}{" "}
                <span className="text-xs font-normal text-muted-foreground">questions</span>
              </p>
            </div>
          )}

          {estimatedDate && (
            <div className="rounded-lg bg-background/50 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <HugeiconsIcon icon={Calendar01Icon} className="size-3" />
                {isReady ? "Achieved" : "Est. Ready By"}
              </div>
              <p className="mt-1 text-sm font-medium">{estimatedDate}</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <Button asChild className="w-full" variant={isReady ? "secondary" : "default"}>
          <Link href={`/practice?section=${section}`}>
            <HugeiconsIcon icon={PlayIcon} className="mr-2 size-4" />
            {isReady ? "Continue Practicing" : "Start Practice Session"}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
