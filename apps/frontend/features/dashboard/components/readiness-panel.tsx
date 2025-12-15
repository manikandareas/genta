"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BrainIcon,
  Book02Icon,
  ChartLineData03Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import type { TPSReadiness, LiterasiReadiness, OverallReadiness } from "../types";

interface ReadinessPanelProps {
  tps: TPSReadiness;
  literasi: LiterasiReadiness;
  overall: OverallReadiness;
}

export function ReadinessPanel({ tps, literasi, overall }: ReadinessPanelProps) {
  const isPositiveGap = overall.gap >= 0;

  return (
    <motion.div
      className="col-span-1 md:col-span-2 lg:col-span-2"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="h-64 border bg-card/50 shadow-none">
        <CardContent className="flex h-full flex-col">
          {/* Header */}
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Readiness
            </span>
            <div className="flex items-center gap-1 rounded-md bg-muted/50 px-1.5 py-0.5">
              <HugeiconsIcon
                icon={isPositiveGap ? ArrowUp01Icon : ArrowDown01Icon}
                className={cn("size-3", isPositiveGap ? "text-emerald-500" : "text-rose-500")}
              />
              <span
                className={cn(
                  "text-[10px] font-semibold",
                  isPositiveGap ? "text-emerald-500" : "text-rose-500",
                )}
              >
                {isPositiveGap ? "+" : ""}
                {overall.gap}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-1 flex-col gap-2">
            {/* TPS */}
            <Link
              href="/practice?section=tps"
              className="group flex flex-1 items-center justify-between rounded-lg bg-muted/30 px-3 py-2 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-violet-500/10">
                  <HugeiconsIcon icon={BrainIcon} className="size-4 text-violet-500" />
                </div>
                <span className="text-xs font-medium">TPS</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-baseline">
                  <NumberFlow value={tps.overall_percentage} className="text-xl font-bold" />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                />
              </div>
            </Link>

            {/* Literasi */}
            <Link
              href="/practice?section=literasi"
              className="group flex flex-1 items-center justify-between rounded-lg bg-muted/30 px-3 py-2 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-emerald-500/10">
                  <HugeiconsIcon icon={Book02Icon} className="size-4 text-emerald-500" />
                </div>
                <span className="text-xs font-medium">Literasi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-baseline">
                  <NumberFlow value={literasi.overall_percentage} className="text-xl font-bold" />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                />
              </div>
            </Link>

            {/* Prediksi */}
            <div className="flex flex-1 items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-blue-500/10">
                  <HugeiconsIcon icon={ChartLineData03Icon} className="size-4 text-blue-500" />
                </div>
                <div>
                  <span className="text-xs font-medium">Prediksi</span>
                  <p className="text-[10px] text-muted-foreground">
                    target: {overall.target_score}
                  </p>
                </div>
              </div>
              <NumberFlow value={overall.predicted_score} className="text-xl font-bold" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
