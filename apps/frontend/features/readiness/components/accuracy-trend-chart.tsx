"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import type { AccuracyTrendPoint } from "@genta/zod";

interface AccuracyTrendChartProps {
  data: AccuracyTrendPoint[] | null | undefined;
  isLoading?: boolean;
}

const chartConfig = {
  accuracy: {
    label: "Accuracy",
    color: "hsl(var(--chart-1))",
  },
  attempts: {
    label: "Attempts",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AccuracyTrendChart({ data, isLoading }: AccuracyTrendChartProps) {
  if (isLoading) {
    return (
      <Card className="border bg-card/50 shadow-none">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const chartData =
    data?.map((point) => ({
      date: new Date(point.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      accuracy: point.accuracy,
      attempts: point.attempts,
    })) ?? [];

  return (
    <Card className="border bg-card/50 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Accuracy Trend (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No data available yet. Start practicing to see your progress!
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
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
                      <span>{name === "accuracy" ? `${value}%` : `${value} questions`}</span>
                    )}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="var(--color-accuracy)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
