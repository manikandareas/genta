"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import NumberFlow from "@number-flow/react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  CheckmarkCircle01Icon,
  Target02Icon,
  ArrowUp01Icon,
  Fire02Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

interface OverviewCardsProps {
  totalQuestions: number;
  totalCorrect: number;
  averageAccuracy: number;
  improvementThisWeek: number;
  isLoading?: boolean;
}

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: IconSvgElement;
  iconColor: string;
  change?: number;
  delay?: number;
}

function StatCard({
  title,
  value,
  suffix,
  icon: Icon,
  iconColor,
  change,
  delay = 0,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="border bg-card/50 shadow-none">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">{title}</p>
              <div className="flex items-baseline gap-1">
                <NumberFlow
                  value={value}
                  className="text-2xl font-bold tracking-tight"
                  format={{ notation: value >= 10000 ? "compact" : "standard" }}
                />
                {suffix && (
                  <span className="text-sm font-medium text-muted-foreground">{suffix}</span>
                )}
              </div>
              {change !== undefined && (
                <div className="flex items-center gap-1">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      isPositive ? "text-emerald-500" : "text-rose-500",
                    )}
                  >
                    {isPositive ? "+" : ""}
                    {change.toFixed(1)}%
                  </span>
                  <span className="text-xs text-muted-foreground">minggu ini</span>
                </div>
              )}
            </div>
            <div className={cn("rounded-lg p-2", iconColor)}>
              <HugeiconsIcon icon={Icon} className="size-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatCardSkeleton() {
  return (
    <Card className="border bg-card/50 shadow-none">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="size-9 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

export function OverviewCards({
  totalQuestions,
  totalCorrect,
  averageAccuracy,
  improvementThisWeek,
  isLoading,
}: OverviewCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Soal Dikerjakan"
        value={totalQuestions}
        icon={Target02Icon}
        iconColor="bg-blue-500"
        delay={0}
      />
      <StatCard
        title="Jawaban Benar"
        value={totalCorrect}
        icon={CheckmarkCircle01Icon}
        iconColor="bg-emerald-500"
        delay={0.05}
      />
      <StatCard
        title="Akurasi Rata-rata"
        value={Math.round(averageAccuracy)}
        suffix="%"
        icon={ArrowUp01Icon}
        iconColor="bg-amber-500"
        change={improvementThisWeek}
        delay={0.1}
      />
      <StatCard
        title="Peningkatan"
        value={Math.abs(improvementThisWeek)}
        suffix="%"
        icon={Fire02Icon}
        iconColor={improvementThisWeek >= 0 ? "bg-rose-500" : "bg-slate-500"}
        delay={0.15}
      />
    </div>
  );
}
