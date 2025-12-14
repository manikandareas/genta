"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon, ArrowDown01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { TPSReadiness, LiterasiReadiness, OverallReadiness, ActivityData } from "../types";

interface StatItemProps {
  label: string;
  value: number | string;
  suffix?: string;
  change?: number;
  isLive?: boolean;
  color?: "default" | "blue" | "emerald" | "amber";
}

function StatItem({ label, value, suffix, change, isLive, color = "default" }: StatItemProps) {
  const isPositive = change !== undefined && change >= 0;

  const colorClasses = {
    default: "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
    blue: "data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500",
    emerald: "data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500",
    amber: "data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500",
  };

  return (
    <div className="flex min-w-[100px] flex-1 flex-col gap-0.5 border-r border-border/30 p-4 last:border-r-0">
      <div className="flex items-center gap-2">
        <Checkbox checked className={cn("size-3 rounded-[3px]", colorClasses[color])} />
        <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-0.5 pl-5">
        {typeof value === "number" ? (
          <NumberFlow
            value={value}
            className="text-2xl font-bold tracking-tight"
            format={{ notation: value >= 1000 ? "compact" : "standard" }}
          />
        ) : (
          <span className="text-2xl font-bold tracking-tight">{value}</span>
        )}
        {suffix && <span className="text-sm font-medium text-muted-foreground">{suffix}</span>}
        {isLive && <span className="ml-1.5 size-1.5 animate-pulse rounded-full bg-emerald-500" />}
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1 pl-5">
          <HugeiconsIcon
            icon={isPositive ? ArrowUp01Icon : ArrowDown01Icon}
            className={cn("size-3", isPositive ? "text-emerald-500" : "text-rose-500")}
          />
          <span
            className={cn(
              "text-[10px] font-medium",
              isPositive ? "text-emerald-500" : "text-rose-500",
            )}
          >
            {isPositive ? "+" : ""}
            {change.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
}

// Heatmap constants
const DAYS = ["", "M", "", "W", "", "F", ""];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const levelColors = {
  0: "bg-muted",
  1: "bg-primary/20",
  2: "bg-primary/40",
  3: "bg-primary/70",
  4: "bg-primary",
};

interface StatsActivityCardProps {
  tps: TPSReadiness;
  literasi: LiterasiReadiness;
  overall: OverallReadiness;
  activity: ActivityData;
}

export function StatsActivityCard({ tps, literasi, overall, activity }: StatsActivityCardProps) {
  const gapPercentage = (overall.gap / overall.target_score) * 100;

  const generateHeatmapData = () => {
    const weeks: Array<Array<{ date: string; level: 0 | 1 | 2 | 3 | 4; isExamDate: boolean }>> = [];
    const year = activity.selected_year;
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const dayOfWeek = startDate.getDay();
    const adjustedStart = new Date(startDate);
    adjustedStart.setDate(startDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    let currentDate = new Date(adjustedStart);
    let currentWeek: Array<{ date: string; level: 0 | 1 | 2 | 3 | 4; isExamDate: boolean }> = [];

    while (currentDate <= endDate || currentWeek.length > 0) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const heatmapEntry = activity.heatmap.find((h) => h.date === dateStr);
      const isExamDate = dateStr === activity.exam_date;

      currentWeek.push({
        date: dateStr,
        level: heatmapEntry?.level ?? 0,
        isExamDate,
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);
      if (currentDate > endDate && currentWeek.length === 0) break;
    }

    if (currentWeek.length > 0) weeks.push(currentWeek);
    return weeks;
  };

  const weeks = generateHeatmapData();

  const getMonthLabels = () => {
    const labels: Array<{ month: string; weekIndex: number }> = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const firstDayOfWeek = new Date(week[0].date);
      const month = firstDayOfWeek.getMonth();
      if (month !== lastMonth) {
        labels.push({ month: MONTHS[month], weekIndex });
        lastMonth = month;
      }
    });
    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex-row gap-2 flex items-center">
          <HugeiconsIcon icon={InformationCircleIcon} className="size-4 text-muted-foreground" />{" "}
          <span className="text-sm font-medium text-muted-foreground">Aktivitas</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {/* Stats Row */}
        <div className="flex  px-4 flex-wrap items-stretch">
          <StatItem
            label="TPS"
            value={tps.overall_percentage}
            suffix="%"
            change={5.2}
            color="blue"
          />
          <StatItem
            label="Literasi"
            value={literasi.overall_percentage}
            suffix="%"
            change={3.8}
            color="emerald"
          />
          <StatItem
            label="Readiness"
            value={overall.percentage}
            suffix="%"
            change={gapPercentage}
          />
          <StatItem
            label="Prediksi"
            value={overall.predicted_score}
            change={gapPercentage}
            color="amber"
          />
          <StatItem label="Latihan" value={activity.stats.total_sessions} change={12} />
          <StatItem label="Avg/Hari" value={activity.stats.avg_per_day} suffix=" soal" />
          <StatItem label="Aktif" value={activity.stats.active_days} isLive />
        </div>

        {/* Heatmap Section */}
        <div className="px-6 py-4">
          <div className="overflow-x-auto">
            <div className="w-full">
              {/* Month labels */}
              <div className="mb-2 flex pl-10">
                {monthLabels.map((label, idx) => (
                  <div
                    key={idx}
                    className="text-xs font-medium text-muted-foreground"
                    style={{
                      marginLeft:
                        idx === 0
                          ? 0
                          : `${(label.weekIndex - (monthLabels[idx - 1]?.weekIndex ?? 0)) * 18 - 36}px`,
                    }}
                  >
                    {label.month}
                  </div>
                ))}
              </div>

              {/* Heatmap grid */}
              <div className="flex gap-1">
                <div className="flex flex-col gap-1 pr-2 pt-px">
                  {DAYS.map((day, idx) => (
                    <div
                      key={idx}
                      className="flex h-[14px] w-5 items-center justify-end text-[10px] font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <TooltipProvider>
                  <div className="flex flex-1 justify-between gap-[3px]">
                    {weeks.map((week, weekIdx) => (
                      <div key={weekIdx} className="flex flex-col gap-1">
                        {week.map((day, dayIdx) => (
                          <Tooltip key={dayIdx}>
                            <TooltipTrigger asChild>
                              <motion.div
                                className={cn(
                                  "size-[14px] cursor-pointer rounded-sm",
                                  levelColors[day.level],
                                  day.isExamDate && "ring-2 ring-amber-500",
                                )}
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                              />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">
                              <p className="font-medium">{day.date}</p>
                              <p className="text-muted-foreground">
                                Level {day.level}
                                {day.isExamDate && " • Hari H UTBK"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    ))}
                  </div>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-end gap-2 text-xs font-medium text-muted-foreground">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={cn("size-[14px] rounded-sm", levelColors[level as 0 | 1 | 2 | 3 | 4])}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
