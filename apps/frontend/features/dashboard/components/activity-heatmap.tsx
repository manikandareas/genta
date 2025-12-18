"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { ActivityData } from "../types";

interface ActivityHeatmapProps {
  activity: ActivityData;
}

const DAYS = ["", "M", "", "W", "", "F", ""];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const levelColors = {
  0: "bg-muted",
  1: "bg-primary/20",
  2: "bg-primary/40",
  3: "bg-primary/70",
  4: "bg-primary",
};

export function ActivityHeatmap({ activity }: ActivityHeatmapProps) {
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
    <Card className="border bg-card/50 backdrop-blur-sm shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            Active Days
            <HugeiconsIcon icon={InformationCircleIcon} className="size-4 text-muted-foreground" />
          </CardTitle>
          <CardAction>
            <Select defaultValue={activity.selected_year.toString()}>
              <SelectTrigger className="h-7 w-20 text-[10px] font-medium border-0 bg-transparent shadow-none focus:ring-0">
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
      <CardContent className="space-y-3">
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="mb-1 flex pl-8">
              {monthLabels.map((label, idx) => (
                <div
                  key={idx}
                  className="text-[10px] text-muted-foreground font-medium"
                  style={{
                    marginLeft:
                      idx === 0
                        ? 0
                        : `${(label.weekIndex - (monthLabels[idx - 1]?.weekIndex ?? 0)) * 12 - 24}px`,
                  }}
                >
                  {label.month}
                </div>
              ))}
            </div>

            <div className="flex gap-0.5">
              <div className="flex flex-col gap-0.5 pr-2 pt-px">
                {DAYS.map((day, idx) => (
                  <div
                    key={idx}
                    className="flex h-[10px] w-4 items-center justify-end text-[9px] text-muted-foreground font-medium"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-0.5">
                  {week.map((day, dayIdx) => (
                    <motion.div
                      key={dayIdx}
                      className={cn(
                        "size-[10px] rounded-[2px] cursor-pointer",
                        levelColors[day.level],
                        day.isExamDate && "ring-1 ring-amber-500",
                      )}
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      title={`${day.date}: Level ${day.level}${day.isExamDate ? " - Hari H UTBK" : ""}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 text-[10px] text-muted-foreground font-medium pt-2">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={cn("size-[10px] rounded-[2px]", levelColors[level as 0 | 1 | 2 | 3 | 4])}
            />
          ))}
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
