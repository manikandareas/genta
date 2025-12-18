"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";
import { Card, CardContent, CardHeader } from "./card";

interface SkeletonCardProps {
  className?: string;
  /** Show header skeleton */
  showHeader?: boolean;
  /** Number of content lines */
  lines?: number;
  /** Show action button skeleton */
  showAction?: boolean;
}

/**
 * Skeleton loader for card components
 * Matches the layout of typical dashboard cards
 */
function SkeletonCard({
  className,
  showHeader = true,
  lines = 3,
  showAction = false,
}: SkeletonCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      {showHeader && (
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className={cn("h-4", i === lines - 1 ? "w-2/3" : "w-full")} />
        ))}
        {showAction && <Skeleton className="mt-4 h-8 w-24" />}
      </CardContent>
    </Card>
  );
}

interface SkeletonStatsCardProps {
  className?: string;
}

/**
 * Skeleton loader for stats/metric cards
 * Shows icon placeholder, value, and label
 */
function SkeletonStatsCard({ className }: SkeletonStatsCardProps) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="size-10 rounded-lg" />
      </div>
    </Card>
  );
}

interface SkeletonReadinessCardProps {
  className?: string;
  /** Number of subtest items to show */
  items?: number;
}

/**
 * Skeleton loader for readiness cards (TPS/Literasi)
 * Shows header and progress items
 */
function SkeletonReadinessCard({ className, items = 4 }: SkeletonReadinessCardProps) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: items }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 w-24 rounded-full" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export { SkeletonCard, SkeletonStatsCard, SkeletonReadinessCard };
