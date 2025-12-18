"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChartLineData03Icon, ArrowUp01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ReadinessOverviewResponse } from "@genta/zod";

interface OverallReadinessCardProps {
  readiness: ReadinessOverviewResponse | null;
  targetScore: number | null;
  isLoading?: boolean;
}

export function OverallReadinessCard({
  readiness,
  targetScore,
  isLoading,
}: OverallReadinessCardProps) {
  if (isLoading) {
    return (
      <motion.div className="col-span-1">
        <Card className="h-full border bg-card/50 shadow-none">
          <CardContent className="flex h-full flex-col justify-between p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="size-8 rounded-lg" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="mt-3">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="mt-1 h-3 w-16" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Calculate predicted score from section readiness data
  const sectionReadiness = readiness?.section_readiness;
  let predictedScore = 0;
  if (sectionReadiness) {
    const sections = Object.values(sectionReadiness);
    if (sections.length > 0) {
      const avgLow = sections.reduce((sum, s) => sum + s.predicted_score_low, 0) / sections.length;
      const avgHigh =
        sections.reduce((sum, s) => sum + s.predicted_score_high, 0) / sections.length;
      predictedScore = Math.round((avgLow + avgHigh) / 2);
    }
  }

  const target = targetScore || 700;
  const gap = predictedScore - target;
  const isPositiveGap = gap >= 0;

  return (
    <motion.div
      className="col-span-1"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="h-full border bg-card/50 shadow-none">
        <CardContent className="flex h-full flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10">
              <HugeiconsIcon icon={ChartLineData03Icon} className="size-4 text-blue-500" />
            </div>
            <div className="flex items-center gap-1">
              <HugeiconsIcon
                icon={isPositiveGap ? ArrowUp01Icon : ArrowDown01Icon}
                className={cn("size-3", isPositiveGap ? "text-emerald-500" : "text-rose-500")}
              />
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isPositiveGap ? "text-emerald-500" : "text-rose-500",
                )}
              >
                {isPositiveGap ? "+" : ""}
                {gap}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-0.5">
              <NumberFlow value={predictedScore} className="text-2xl font-bold tracking-tight" />
              <span className="text-sm text-muted-foreground">/{target}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">prediksi skor</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
