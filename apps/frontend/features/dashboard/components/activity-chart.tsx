"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { ActivityData } from "../types";

interface ActivityChartProps {
  activity: ActivityData;
}

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function ActivityChart({ activity }: ActivityChartProps) {
  const [selectedBar, setSelectedBar] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState(activity.selected_year.toString());

  // Group data by week for bar chart display
  const weeklyData = useMemo(() => {
    const weeks: Array<{
      weekStart: string;
      weekEnd: string;
      totalCount: number;
      avgLevel: number;
      days: Array<{ date: string; count: number; level: number }>;
    }> = [];

    let currentWeek: Array<{ date: string; count: number; level: number }> = [];
    let weekStart = "";

    activity.heatmap.forEach((day, index) => {
      const date = new Date(day.date);
      const dayOfWeek = date.getDay();

      if (dayOfWeek === 1 || index === 0) {
        if (currentWeek.length > 0) {
          const totalCount = currentWeek.reduce((sum, d) => sum + d.count, 0);
          const avgLevel = currentWeek.reduce((sum, d) => sum + d.level, 0) / currentWeek.length;
          weeks.push({
            weekStart,
            weekEnd: currentWeek[currentWeek.length - 1].date,
            totalCount,
            avgLevel,
            days: currentWeek,
          });
        }
        currentWeek = [];
        weekStart = day.date;
      }

      currentWeek.push({ date: day.date, count: day.count, level: day.level });
    });

    // Push last week
    if (currentWeek.length > 0) {
      const totalCount = currentWeek.reduce((sum, d) => sum + d.count, 0);
      const avgLevel = currentWeek.reduce((sum, d) => sum + d.level, 0) / currentWeek.length;
      weeks.push({
        weekStart,
        weekEnd: currentWeek[currentWeek.length - 1].date,
        totalCount,
        avgLevel,
        days: currentWeek,
      });
    }

    return weeks;
  }, [activity.heatmap]);

  // Calculate max for scaling
  const maxCount = Math.max(...weeklyData.map((w) => w.totalCount), 1);

  // Calculate trend line (moving average)
  const trendLine = useMemo(() => {
    const windowSize = 4;
    return weeklyData.map((_, index) => {
      const start = Math.max(0, index - windowSize + 1);
      const window = weeklyData.slice(start, index + 1);
      const avg = window.reduce((sum, w) => sum + w.totalCount, 0) / window.length;
      return avg;
    });
  }, [weeklyData]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = MONTHS_SHORT[date.getMonth()];
    return `${day} ${month}`;
  };

  const getBarColor = (level: number) => {
    if (level >= 3) return "bg-primary";
    if (level >= 2) return "bg-primary/70";
    if (level >= 1) return "bg-primary/40";
    return "bg-muted";
  };

  // Show only recent weeks for better visibility
  const visibleWeeks = weeklyData.slice(-20);
  const visibleTrend = trendLine.slice(-20);

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            Aktivitas Latihan
            <HugeiconsIcon icon={InformationCircleIcon} className="size-4 text-muted-foreground" />
          </CardTitle>
          <CardAction>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="h-8 w-24 text-xs font-medium border-0 bg-muted/50 shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chart Area */}
        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 flex h-full flex-col justify-between py-2 text-xs text-muted-foreground">
            <span>{maxCount}</span>
            <span>{Math.round(maxCount * 0.75)}</span>
            <span>{Math.round(maxCount * 0.5)}</span>
            <span>{Math.round(maxCount * 0.25)}</span>
            <span>0</span>
          </div>

          {/* Chart container */}
          <div className="ml-8 h-full">
            {/* Grid lines */}
            <div className="absolute inset-0 ml-8 flex flex-col justify-between py-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-px w-full bg-border/30" />
              ))}
            </div>

            {/* Bars and trend line */}
            <div className="relative flex h-full items-end gap-1 overflow-x-auto pb-6">
              <TooltipProvider>
                {visibleWeeks.map((week, index) => {
                  const barHeight = (week.totalCount / maxCount) * 100;
                  const trendHeight = (visibleTrend[index] / maxCount) * 100;
                  const isSelected = selectedBar === index;

                  return (
                    <div key={week.weekStart} className="relative flex flex-col items-center">
                      {/* Trend line point */}
                      <motion.div
                        className="absolute z-10 size-2 rounded-full bg-blue-400"
                        style={{ bottom: `calc(${trendHeight}% + 24px)` }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                      />

                      {/* Trend line connector */}
                      {index > 0 && (
                        <svg
                          className="absolute z-0 overflow-visible"
                          style={{
                            bottom: "24px",
                            left: "-50%",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <line
                            x1="0"
                            y1={`${100 - (visibleTrend[index - 1] / maxCount) * 100}%`}
                            x2="100%"
                            y2={`${100 - trendHeight}%`}
                            stroke="rgb(96, 165, 250)"
                            strokeWidth="2"
                            strokeOpacity="0.6"
                          />
                        </svg>
                      )}

                      {/* Bar */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            className={cn(
                              "w-6 cursor-pointer rounded-t-sm transition-colors",
                              getBarColor(week.avgLevel),
                              isSelected &&
                                "ring-2 ring-primary ring-offset-2 ring-offset-background",
                            )}
                            style={{ height: `${Math.max(barHeight, 2)}%` }}
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.max(barHeight, 2)}%` }}
                            transition={{ delay: index * 0.02, duration: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setSelectedBar(isSelected ? null : index)}
                          />
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="rounded-lg border border-border/50 bg-popover p-3 shadow-lg"
                        >
                          <div className="space-y-2">
                            <p className="font-medium">
                              {formatDate(week.weekStart)} - {formatDate(week.weekEnd)}
                            </p>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-muted-foreground">Total Soal</span>
                              <span className="font-semibold">{week.totalCount}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-muted-foreground">Rata-rata/Hari</span>
                              <span className="font-semibold">
                                {(week.totalCount / week.days.length).toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>

                      {/* X-axis label */}
                      {index % 4 === 0 && (
                        <span className="absolute -bottom-1 text-[10px] text-muted-foreground whitespace-nowrap">
                          {formatDate(week.weekStart)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between border-t border-border/30 pt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-sm bg-primary" />
              <span className="text-xs text-muted-foreground">Soal Dikerjakan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-blue-400" />
              <span className="text-xs text-muted-foreground">Trend</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Intensitas:</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div key={level} className={cn("size-3 rounded-sm", getBarColor(level))} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
