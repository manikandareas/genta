"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Area, ComposedChart } from "recharts";
import type { AccuracyTrendResponse } from "@genta/zod";

interface AccuracyTrendChartProps {
  data: AccuracyTrendResponse[] | null | undefined;
  periodDays: number;
  isLoading?: boolean;
}

const chartConfig = {
  accuracy: {
    label: "Akurasi",
    color: "hsl(var(--chart-1))",
  },
  attempts: {
    label: "Soal",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AccuracyTrendChart({ data, periodDays, isLoading }: AccuracyTrendChartProps) {
  if (isLoading) {
    return (
      <Card className="border bg-card/50 shadow-none">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData =
    data?.map((point) => ({
      date: new Date(point.date).toLocaleDateString("id-ID", {
        month: "short",
        day: "numeric",
      }),
      accuracy: Math.round(point.accuracy * 10) / 10,
      attempts: point.attempts,
    })) ?? [];

  return (
    <Card className="border bg-card/50 shadow-none">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <CardTitle className="text-xs sm:text-sm font-medium">
          Tren Akurasi ({periodDays} Hari Terakhir)
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {chartData.length === 0 ? (
          <div className="flex h-[200px] sm:h-[280px] items-center justify-center text-xs sm:text-sm text-muted-foreground">
            Belum ada data. Mulai latihan untuk melihat progresmu!
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] sm:h-[280px] w-full">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-accuracy)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-accuracy)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => (
                      <span>{name === "accuracy" ? `${value}%` : `${value} soal`}</span>
                    )}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="accuracy"
                stroke="var(--color-accuracy)"
                fill="url(#accuracyGradient)"
                strokeWidth={0}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="var(--color-accuracy)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
