"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChartLineData03Icon, ArrowUp01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import type { OverallReadiness } from "../types";

interface OverallReadinessCardProps {
  overall: OverallReadiness;
}

export function OverallReadinessCard({ overall }: OverallReadinessCardProps) {
  const isPositiveGap = overall.gap >= 0;

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
                {overall.gap}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-0.5">
              <NumberFlow
                value={overall.predicted_score}
                className="text-2xl font-bold tracking-tight"
              />
              <span className="text-sm text-muted-foreground">/{overall.target_score}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">prediksi skor</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
