"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Target01Icon,
  ChartLineData01Icon,
  PercentIcon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import NumberFlow from "@number-flow/react";
import type { SectionDetailResponse } from "@genta/zod";

interface MetricsGridProps {
  data: SectionDetailResponse | null;
  isLoading?: boolean;
}

interface MetricCardProps {
  icon: typeof Target01Icon;
  iconColor: string;
  iconBgColor: string;
  label: string;
  value: number | string;
  suffix?: string;
  subtext?: string;
  isLoading?: boolean;
}

function MetricCard({
  icon,
  iconColor,
  iconBgColor,
  label,
  value,
  suffix,
  subtext,
  isLoading,
}: MetricCardProps) {
  if (isLoading) {
    return (
      <Card className="border bg-card/50 shadow-none">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border bg-card/50 shadow-none">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`flex size-10 items-center justify-center rounded-lg ${iconBgColor}`}>
            <HugeiconsIcon icon={icon} className={`size-5 ${iconColor}`} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <div className="flex items-baseline gap-0.5">
              {typeof value === "number" ? (
                <>
                  <NumberFlow
                    value={value}
                    className="text-xl font-bold tracking-tight"
                    format={{ maximumFractionDigits: 1 }}
                  />
                  {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
                </>
              ) : (
                <span className="text-xl font-bold tracking-tight">{value}</span>
              )}
            </div>
            {subtext && <p className="text-[10px] text-muted-foreground">{subtext}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MetricsGrid({ data, isLoading }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <MetricCard
        icon={PercentIcon}
        iconColor="text-blue-500"
        iconBgColor="bg-blue-500/10"
        label="Overall Accuracy"
        value={data?.overall_accuracy ?? 0}
        suffix="%"
        subtext={`Recent: ${data?.recent_accuracy?.toFixed(1) ?? 0}%`}
        isLoading={isLoading}
      />
      <MetricCard
        icon={Target01Icon}
        iconColor="text-emerald-500"
        iconBgColor="bg-emerald-500/10"
        label="Readiness"
        value={data?.readiness_percentage ?? 0}
        suffix="%"
        subtext={data?.days_to_ready ? `${data.days_to_ready} days to ready` : "Ready!"}
        isLoading={isLoading}
      />
      <MetricCard
        icon={ChartLineData01Icon}
        iconColor="text-violet-500"
        iconBgColor="bg-violet-500/10"
        label="Predicted Score"
        value={`${data?.predicted_score_low ?? 0}-${data?.predicted_score_high ?? 0}`}
        subtext="Score range"
        isLoading={isLoading}
      />
      <MetricCard
        icon={Clock01Icon}
        iconColor="text-amber-500"
        iconBgColor="bg-amber-500/10"
        label="Avg. Time"
        value={data?.avg_time_seconds ?? 0}
        suffix="s"
        subtext={`${data?.total_attempts ?? 0} total attempts`}
        isLoading={isLoading}
      />
    </div>
  );
}
