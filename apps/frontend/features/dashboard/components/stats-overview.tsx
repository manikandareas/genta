"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { Checkbox } from "@/components/ui/checkbox";
import type { TPSReadiness, LiterasiReadiness, OverallReadiness, ActivityStats } from "../types";

interface StatItemProps {
  label: string;
  value: number | string;
  suffix?: string;
  prefix?: string;
  change?: number;
  isChecked?: boolean;
  isLive?: boolean;
  color?: "default" | "blue" | "emerald" | "amber";
}

function StatItem({
  label,
  value,
  suffix,
  prefix,
  change,
  isChecked = true,
  isLive,
  color = "default",
}: StatItemProps) {
  const isPositive = change !== undefined && change >= 0;

  const colorClasses = {
    default: "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
    blue: "data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500",
    emerald: "data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500",
    amber: "data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500",
  };

  return (
    <div className="flex min-w-[120px] flex-1 flex-col gap-0.5 border-r border-border/30 px-5 py-4 last:border-r-0">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={isChecked}
          className={cn("size-3.5 rounded-[4px]", colorClasses[color])}
        />
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-0.5 pl-5">
        {prefix && <span className="text-lg font-semibold">{prefix}</span>}
        {typeof value === "number" ? (
          <NumberFlow
            value={value}
            className="text-3xl font-bold tracking-tight"
            format={{ notation: value >= 1000 ? "compact" : "standard" }}
          />
        ) : (
          <span className="text-3xl font-bold tracking-tight">{value}</span>
        )}
        {suffix && <span className="text-lg font-medium text-muted-foreground">{suffix}</span>}
        {isLive && <span className="ml-2 size-2 animate-pulse rounded-full bg-emerald-500" />}
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1 pl-5">
          <HugeiconsIcon
            icon={isPositive ? ArrowUp01Icon : ArrowDown01Icon}
            className={cn("size-3", isPositive ? "text-emerald-500" : "text-rose-500")}
          />
          <span
            className={cn("text-xs font-medium", isPositive ? "text-emerald-500" : "text-rose-500")}
          >
            {isPositive ? "+" : ""}
            {change.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
}

interface StatsOverviewProps {
  tps: TPSReadiness;
  literasi: LiterasiReadiness;
  overall: OverallReadiness;
  activity: {
    stats: ActivityStats;
  };
}

export function StatsOverview({ tps, literasi, overall, activity }: StatsOverviewProps) {
  const gapPercentage = (overall.gap / overall.target_score) * 100;

  return (
    <motion.div
      className="flex flex-wrap items-stretch overflow-hidden rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <StatItem label="TPS" value={tps.overall_percentage} suffix="%" change={5.2} color="blue" />
      <StatItem
        label="Literasi"
        value={literasi.overall_percentage}
        suffix="%"
        change={3.8}
        color="emerald"
      />
      <StatItem label="Readiness" value={overall.percentage} suffix="%" change={gapPercentage} />
      <StatItem
        label="Prediksi Skor"
        value={overall.predicted_score}
        change={gapPercentage}
        color="amber"
      />
      <StatItem label="Total Latihan" value={activity.stats.total_sessions} change={12} />
      <StatItem label="Avg/Hari" value={activity.stats.avg_per_day} suffix=" soal" />
      <StatItem label="Hari Aktif" value={activity.stats.active_days} isLive />
    </motion.div>
  );
}
