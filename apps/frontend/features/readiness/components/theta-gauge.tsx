"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import NumberFlow from "@number-flow/react";
import type { SectionDetailResponse } from "@genta/zod";

interface ThetaGaugeProps {
  data: SectionDetailResponse | null;
  isLoading?: boolean;
}

export function ThetaGauge({ data, isLoading }: ThetaGaugeProps) {
  if (isLoading) {
    return (
      <Card className="border bg-card/50 shadow-none">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Normalize theta values from [-3, 3] to [0, 100] for display
  const normalizeTheta = (theta: number) => ((theta + 3) / 6) * 100;

  const currentTheta = data?.current_theta ?? 0;
  const targetTheta = data?.target_theta ?? 1.2;

  const currentNormalized = normalizeTheta(currentTheta);
  const targetNormalized = normalizeTheta(targetTheta);

  const progressPercentage = Math.min(100, (currentNormalized / targetNormalized) * 100);
  const gap = targetTheta - currentTheta;

  return (
    <Card className="border bg-card/50 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Ability Level (Theta)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visual gauge */}
        <div className="relative pt-8">
          {/* Background track */}
          <div className="relative h-3 w-full rounded-full bg-muted">
            {/* Progress fill */}
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500"
              style={{ width: `${currentNormalized}%` }}
            />

            {/* Target marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${targetNormalized}%` }}
            >
              <div className="relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    Target: {targetTheta.toFixed(2)}
                  </span>
                </div>
                <div className="h-5 w-0.5 -translate-y-1 bg-emerald-500" />
              </div>
            </div>

            {/* Current marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${currentNormalized}%` }}
            >
              <div className="relative">
                <div className="size-4 -translate-x-1/2 -translate-y-0.5 rounded-full border-2 border-white bg-violet-500 shadow-md" />
              </div>
            </div>
          </div>

          {/* Scale labels */}
          <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
            <span>-3.0</span>
            <span>0.0</span>
            <span>+3.0</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 border-t pt-4">
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground">Current</p>
            <NumberFlow
              value={currentTheta}
              className="text-lg font-bold text-violet-600 dark:text-violet-400"
              format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
            />
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground">Target</p>
            <NumberFlow
              value={targetTheta}
              className="text-lg font-bold text-emerald-600 dark:text-emerald-400"
              format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
            />
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground">Gap</p>
            <NumberFlow
              value={gap}
              className={`text-lg font-bold ${gap > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}
              format={{
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
                signDisplay: "always",
              }}
            />
          </div>
        </div>

        {/* Progress to target */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress to target</span>
            <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
