"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ResponsiveContainer } from "recharts";
import type { SectionBreakdownResponse } from "@genta/zod";
import { ALL_SECTIONS, TPS_SECTIONS } from "../types";

interface SectionComparisonChartProps {
  data: SectionBreakdownResponse[] | null | undefined;
  isLoading?: boolean;
}

const chartConfig = {
  accuracy: {
    label: "Akurasi",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

// Colors for TPS (blue shades) and Literasi (green shades)
const SECTION_COLORS: Record<string, string> = {
  PU: "hsl(217, 91%, 60%)",
  PPU: "hsl(217, 91%, 50%)",
  PBM: "hsl(217, 91%, 45%)",
  PK: "hsl(217, 91%, 40%)",
  LBI: "hsl(142, 71%, 45%)",
  LBE: "hsl(142, 71%, 40%)",
  PM: "hsl(142, 71%, 35%)",
};

export function SectionComparisonChart({ data, isLoading }: SectionComparisonChartProps) {
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

  // Ensure all 7 sections are displayed, even if no data
  const chartData = ALL_SECTIONS.map((section) => {
    const sectionData = data?.find((d) => d.section === section);
    return {
      section,
      accuracy: sectionData?.accuracy ?? 0,
      attempts: sectionData?.attempts ?? 0,
      correct: sectionData?.correct ?? 0,
      isTPS: TPS_SECTIONS.includes(section),
    };
  });

  return (
    <Card className="border bg-card/50 shadow-none">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xs sm:text-sm font-medium">Perbandingan per Subtes</CardTitle>
          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="size-2 sm:size-2.5 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">TPS</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="size-2 sm:size-2.5 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Literasi</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {chartData.every((d) => d.attempts === 0) ? (
          <div className="flex h-[200px] sm:h-[280px] items-center justify-center text-xs sm:text-sm text-muted-foreground">
            Belum ada data. Mulai latihan untuk melihat progresmu!
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] sm:h-[280px] w-full">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis dataKey="section" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
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
                    formatter={(value, name, props) => (
                      <div className="space-y-1">
                        <div className="font-medium">{props.payload.section}</div>
                        <div>Akurasi: {value}%</div>
                        <div className="text-muted-foreground">
                          {props.payload.correct}/{props.payload.attempts} benar
                        </div>
                      </div>
                    )}
                  />
                }
              />
              <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={SECTION_COLORS[entry.section] ?? "hsl(var(--chart-1))"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
