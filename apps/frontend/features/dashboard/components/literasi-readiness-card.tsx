"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon } from "@hugeicons/core-free-icons";
import NumberFlow from "@number-flow/react";
import { Skeleton } from "@/components/ui/skeleton";

interface LiterasiReadinessCardProps {
  literasiReadiness: number;
  isLoading?: boolean;
}

export function LiterasiReadinessCard({
  literasiReadiness,
  isLoading,
}: LiterasiReadinessCardProps) {
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
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-1 h-3 w-12" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  return (
    <motion.div
      className="col-span-1"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="h-full border bg-card/50 shadow-none">
        <CardContent className="flex h-full flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <HugeiconsIcon icon={Book02Icon} className="size-4 text-emerald-500" />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Literasi
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-0.5">
              <NumberFlow
                value={Math.round(literasiReadiness)}
                className="text-2xl font-bold tracking-tight"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <p className="text-[10px] text-muted-foreground">readiness</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
