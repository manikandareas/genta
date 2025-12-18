"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  BrainIcon,
  Book02Icon,
  Target02Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  Task01Icon,
  TargetIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type {
  TPSReadiness,
  LiterasiReadiness,
  OverallReadiness,
  ActivityData,
  SubtestReadiness,
} from "../types";

// Section configuration with colors
const SECTION_CONFIG: Record<string, { name: string; color: string; bgColor: string }> = {
  PU: { name: "Penalaran Umum", color: "text-violet-500", bgColor: "bg-violet-500" },
  PPU: { name: "Pengetahuan Umum", color: "text-purple-500", bgColor: "bg-purple-500" },
  PBM: { name: "Bacaan & Menulis", color: "text-indigo-500", bgColor: "bg-indigo-500" },
  PK: { name: "Kuantitatif", color: "text-blue-500", bgColor: "bg-blue-500" },
  LBI: { name: "Literasi Indonesia", color: "text-emerald-500", bgColor: "bg-emerald-500" },
  LBE: { name: "Literasi Inggris", color: "text-teal-500", bgColor: "bg-teal-500" },
  PM: { name: "Penalaran Matematika", color: "text-cyan-500", bgColor: "bg-cyan-500" },
};

// Category Card Component
interface CategoryCardProps {
  label: string;
  icon: typeof BrainIcon;
  iconColor: string;
  iconBg: string;
  percentage: number;
  readyCount: number;
  totalCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  subtests: Array<{ code: string; data: SubtestReadiness }>;
}

function CategoryCard({
  label,
  icon,
  iconColor,
  iconBg,
  percentage,
  readyCount,
  totalCount,
  isExpanded,
  onToggle,
  subtests,
}: CategoryCardProps) {
  return (
    <div className="w-full border-b border-border/30 last:border-b-0 sm:w-auto sm:flex-1 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <button
        onClick={onToggle}
        className="flex w-full flex-col gap-1 p-3 transition-colors hover:bg-muted/30 sm:p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("flex size-6 items-center justify-center rounded-md", iconBg)}>
              <HugeiconsIcon icon={icon} className={cn("size-3.5", iconColor)} />
            </div>
            <span className="text-xs font-medium">{label}</span>
          </div>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            className={cn(
              "size-4 text-muted-foreground transition-transform",
              isExpanded && "rotate-180",
            )}
          />
        </div>
        <div className="flex items-baseline gap-0.5 pl-8">
          <NumberFlow value={percentage} className="text-2xl font-bold tracking-tight" />
          <span className="text-sm text-muted-foreground">%</span>
        </div>
        <div className="pl-8 text-left">
          <span className="text-[10px] text-muted-foreground">
            {readyCount}/{totalCount} siap
          </span>
        </div>
      </button>

      {/* Expanded Detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/30 bg-muted/20"
          >
            <div className="space-y-1 p-2">
              {subtests.map(({ code, data }) => {
                const config = SECTION_CONFIG[code];
                const isReady = data.percentage >= 75;
                return (
                  <Link
                    key={code}
                    href={`/practice?section=${code}`}
                    className="group flex items-center justify-between rounded-md px-3 py-2 transition-colors hover:bg-background"
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn("size-1.5 rounded-full", config.bgColor)} />
                      <span className="text-xs font-medium">{code}</span>
                      <span className="text-[10px] text-muted-foreground">{config.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold">{data.percentage}%</span>
                      {isReady ? (
                        <span className="text-[10px] font-medium text-emerald-500">Siap</span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">
                          {data.days_to_ready}d
                        </span>
                      )}
                      <HugeiconsIcon
                        icon={ArrowRight01Icon}
                        className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple Stat Card Component
interface SimpleStatCardProps {
  label: string;
  icon: typeof BrainIcon;
  iconColor: string;
  iconBg: string;
  value: number;
  suffix?: string;
  subtext: string;
  change?: number;
}

function SimpleStatCard({
  label,
  icon,
  iconColor,
  iconBg,
  value,
  suffix,
  subtext,
  change,
}: SimpleStatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="flex w-1/2 flex-col gap-1 border-b border-r border-border/30 p-3 last:border-r-0 sm:w-auto sm:flex-1 sm:border-b-0 sm:p-4 [&:nth-child(even)]:border-r-0 sm:[&:nth-child(even)]:border-r sm:[&:nth-child(even)]:last:border-r-0">
      <div className="flex items-center gap-2">
        <div className={cn("flex size-6 items-center justify-center rounded-md", iconBg)}>
          <HugeiconsIcon icon={icon} className={cn("size-3.5", iconColor)} />
        </div>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-0.5 pl-8">
        <NumberFlow value={value} className="text-2xl font-bold tracking-tight" />
        {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
      </div>
      <div className="flex items-center gap-2 pl-8">
        <span className="text-[10px] text-muted-foreground">{subtext}</span>
        {change !== undefined && (
          <div className="flex items-center gap-0.5">
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
  const [expandedCategory, setExpandedCategory] = useState<"tps" | "literasi" | null>(null);

  // Prepare subtests data
  const tpsSubtests = Object.entries(tps.subtests).map(([code, data]) => ({ code, data }));
  const literasiSubtests = Object.entries(literasi.subtests).map(([code, data]) => ({
    code,
    data,
  }));

  // Count ready sections
  const tpsReadyCount = tpsSubtests.filter(({ data }) => data.percentage >= 75).length;
  const literasiReadyCount = literasiSubtests.filter(({ data }) => data.percentage >= 75).length;

  const generateHeatmapData = () => {
    const weeks: Array<Array<{ date: string; level: 0 | 1 | 2 | 3 | 4; isExamDate: boolean }>> = [];
    const year = activity.selected_year;
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const dayOfWeek = startDate.getDay();
    const adjustedStart = new Date(startDate);
    adjustedStart.setDate(startDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    const currentDate = new Date(adjustedStart);
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
        <div className="flex items-center gap-2 flex-row">
          <CardTitle className="flex-row gap-1 flex items-baseline">
            <span>Aktivitas</span>
            <span className=" italic font-playfair-display">Kamu</span>
          </CardTitle>
        </div>
        <CardDescription>Ringkasan performa dan pola belajarmu sepanjang tahun</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {/* Grouped Stats Row */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap">
          <CategoryCard
            label="TPS"
            icon={BrainIcon}
            iconColor="text-violet-500"
            iconBg="bg-violet-500/10"
            percentage={tps.overall_percentage}
            readyCount={tpsReadyCount}
            totalCount={4}
            isExpanded={expandedCategory === "tps"}
            onToggle={() => setExpandedCategory(expandedCategory === "tps" ? null : "tps")}
            subtests={tpsSubtests}
          />
          <CategoryCard
            label="Literasi"
            icon={Book02Icon}
            iconColor="text-emerald-500"
            iconBg="bg-emerald-500/10"
            percentage={literasi.overall_percentage}
            readyCount={literasiReadyCount}
            totalCount={3}
            isExpanded={expandedCategory === "literasi"}
            onToggle={() =>
              setExpandedCategory(expandedCategory === "literasi" ? null : "literasi")
            }
            subtests={literasiSubtests}
          />
          {/* Desktop only stats */}
          <div className="hidden sm:contents">
            <SimpleStatCard
              label="Prediksi"
              icon={Target02Icon}
              iconColor="text-amber-500"
              iconBg="bg-amber-500/10"
              value={overall.predicted_score}
              subtext={`target: ${overall.target_score}`}
              change={(overall.gap / overall.target_score) * 100}
            />
            <SimpleStatCard
              label="Latihan"
              icon={Task01Icon}
              iconColor="text-blue-500"
              iconBg="bg-blue-500/10"
              value={activity.stats.total_questions}
              suffix=" soal"
              subtext={`${activity.stats.avg_per_day} soal/hari`}
            />
            <SimpleStatCard
              label="Akurasi"
              icon={TargetIcon}
              iconColor="text-rose-500"
              iconBg="bg-rose-500/10"
              value={activity.stats.overall_accuracy}
              suffix="%"
              subtext="minggu ini"
              change={activity.stats.accuracy_change}
            />
          </div>
        </div>

        {/* Simple Stats Row for Mobile */}
        <div className="flex flex-wrap border-t border-border/30 sm:hidden">
          <SimpleStatCard
            label="Prediksi"
            icon={Target02Icon}
            iconColor="text-amber-500"
            iconBg="bg-amber-500/10"
            value={overall.predicted_score}
            subtext={`target: ${overall.target_score}`}
            change={(overall.gap / overall.target_score) * 100}
          />
          <SimpleStatCard
            label="Latihan"
            icon={Task01Icon}
            iconColor="text-blue-500"
            iconBg="bg-blue-500/10"
            value={activity.stats.total_questions}
            suffix=" soal"
            subtext={`${activity.stats.avg_per_day} soal/hari`}
          />
          <SimpleStatCard
            label="Akurasi"
            icon={TargetIcon}
            iconColor="text-rose-500"
            iconBg="bg-rose-500/10"
            value={activity.stats.overall_accuracy}
            suffix="%"
            subtext="minggu ini"
            change={activity.stats.accuracy_change}
          />
        </div>

        {/* Heatmap Section */}
        <div className="px-4 py-4 sm:px-6">
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="min-w-[640px] sm:min-w-0 sm:w-full">
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
