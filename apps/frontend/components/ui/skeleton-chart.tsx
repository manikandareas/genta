"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";
import { Card, CardContent, CardHeader } from "./card";

interface SkeletonChartProps {
  className?: string;
  /** Chart height */
  height?: number;
  /** Show chart header/title */
  showHeader?: boolean;
  /** Show legend */
  showLegend?: boolean;
}

/**
 * Skeleton loader for chart components (line, bar, area charts)
 * Provides a placeholder that matches typical chart layouts
 */
function SkeletonChart({
  className,
  height = 200,
  showHeader = true,
  showLegend = false,
}: SkeletonChartProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      {showHeader && (
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
        </CardHeader>
      )}
      <CardContent>
        {/* Chart area placeholder */}
        <div className="relative w-full rounded-md bg-muted/30" style={{ height }}>
          {/* Y-axis labels */}
          <div className="absolute left-2 top-2 flex h-full flex-col justify-between pb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-8" />
            ))}
          </div>

          {/* Chart bars/lines placeholder */}
          <div className="absolute bottom-8 left-12 right-4 flex items-end justify-around gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-8 rounded-t-sm"
                style={{
                  height: `${Math.random() * 60 + 20}%`,
                }}
              />
            ))}
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-2 left-12 right-4 flex justify-around">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-8" />
            ))}
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="mt-4 flex items-center justify-center gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="size-3 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface SkeletonLineChartProps {
  className?: string;
  height?: number;
}

/**
 * Skeleton specifically for line/area charts
 * Shows a wavy line placeholder
 */
function SkeletonLineChart({ className, height = 200 }: SkeletonLineChartProps) {
  return (
    <div className={cn("relative w-full rounded-md bg-muted/30", className)} style={{ height }}>
      {/* Simulated line chart with gradient */}
      <div className="absolute inset-4 flex items-center">
        <svg className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="skeleton-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,50 Q25,30 50,45 T100,35 T150,50 T200,40 T250,55 T300,45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeOpacity="0.2"
            className="animate-pulse"
          />
        </svg>
      </div>
    </div>
  );
}

interface SkeletonBarChartProps {
  className?: string;
  height?: number;
  bars?: number;
}

/**
 * Skeleton specifically for bar charts
 */
function SkeletonBarChart({ className, height = 200, bars = 7 }: SkeletonBarChartProps) {
  return (
    <div className={cn("relative w-full rounded-md bg-muted/30 p-4", className)} style={{ height }}>
      <div className="flex h-full items-end justify-around gap-2">
        {Array.from({ length: bars }).map((_, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <Skeleton
              className="w-full max-w-12 rounded-t-sm"
              style={{
                height: `${Math.random() * 60 + 20}%`,
              }}
            />
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

export { SkeletonChart, SkeletonLineChart, SkeletonBarChart };
