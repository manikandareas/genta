"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { BrainIcon } from "@hugeicons/core-free-icons";
import NumberFlow from "@number-flow/react";
import type { TPSReadiness } from "../types";

interface TPSReadinessCardProps {
  tps: TPSReadiness;
}

export function TPSReadinessCard({ tps }: TPSReadinessCardProps) {
  return (
    <motion.div
      className="col-span-1"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card className="h-full border bg-card/50 shadow-none">
        <CardContent className="flex h-full flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <div className="flex size-8 items-center justify-center rounded-lg bg-violet-500/10">
              <HugeiconsIcon icon={BrainIcon} className="size-4 text-violet-500" />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              TPS
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-0.5">
              <NumberFlow
                value={tps.overall_percentage}
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
