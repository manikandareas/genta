"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import NumberFlow from "@number-flow/react";
import type { SubtypeAccuracyResponse } from "@genta/zod";

interface SubtypeBreakdownProps {
  data: SubtypeAccuracyResponse[] | null | undefined;
  isLoading?: boolean;
}

function SubtypeRow({ subtype }: { subtype: SubtypeAccuracyResponse }) {
  const accuracyColor =
    subtype.accuracy >= 80
      ? "text-emerald-600 dark:text-emerald-400"
      : subtype.accuracy >= 60
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  const progressColor =
    subtype.accuracy >= 80
      ? "bg-emerald-500"
      : subtype.accuracy >= 60
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div className="space-y-2 rounded-lg border bg-card/30 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{subtype.sub_type}</span>
          {subtype.is_weak_area && (
            <Badge variant="destructive" className="h-4 px-1.5 text-[9px]">
              <HugeiconsIcon icon={AlertCircleIcon} className="mr-0.5 size-2.5" />
              Weak Area
            </Badge>
          )}
          {!subtype.is_weak_area && subtype.accuracy >= 80 && (
            <Badge
              variant="secondary"
              className="h-4 bg-emerald-500/10 px-1.5 text-[9px] text-emerald-600 dark:text-emerald-400"
            >
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="mr-0.5 size-2.5" />
              Strong
            </Badge>
          )}
        </div>
        <div className="flex items-baseline gap-0.5">
          <NumberFlow
            value={subtype.accuracy}
            className={`text-lg font-bold ${accuracyColor}`}
            format={{ maximumFractionDigits: 1 }}
          />
          <span className="text-xs text-muted-foreground">%</span>
        </div>
      </div>

      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${progressColor}`}
          style={{ width: `${subtype.accuracy}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>
          {subtype.correct_count} / {subtype.total_attempts} correct
        </span>
        <span>{subtype.total_attempts} attempts</span>
      </div>
    </div>
  );
}

export function SubtypeBreakdown({ data, isLoading }: SubtypeBreakdownProps) {
  if (isLoading) {
    return (
      <Card className="border bg-card/50 shadow-none">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const sortedData = [...(data ?? [])].sort((a, b) => {
    // Weak areas first, then by accuracy ascending
    if (a.is_weak_area !== b.is_weak_area) {
      return a.is_weak_area ? -1 : 1;
    }
    return a.accuracy - b.accuracy;
  });

  return (
    <Card className="border bg-card/50 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Question Type Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedData.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No subtype data available yet. Practice more questions to see your breakdown!
          </div>
        ) : (
          sortedData.map((subtype) => <SubtypeRow key={subtype.sub_type} subtype={subtype} />)
        )}
      </CardContent>
    </Card>
  );
}
