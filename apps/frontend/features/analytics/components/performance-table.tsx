"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon, ArrowDown01Icon, ArrowUpDownIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import type { SectionBreakdownResponse } from "@genta/zod";
import { TPS_SECTIONS } from "../types";

interface PerformanceTableProps {
  data: SectionBreakdownResponse[] | null | undefined;
  isLoading?: boolean;
}

type SortField = "section" | "accuracy" | "attempts" | "correct" | "avg_time_seconds";
type SortDirection = "asc" | "desc";

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}d`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}d`;
}

export function PerformanceTable({ data, isLoading }: PerformanceTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "accuracy",
    direction: "desc",
  });

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  const sortedData = [...(data ?? [])].sort((a, b) => {
    const multiplier = sortConfig.direction === "asc" ? 1 : -1;
    const aValue = a[sortConfig.field];
    const bValue = b[sortConfig.field];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.localeCompare(bValue) * multiplier;
    }
    return ((aValue as number) - (bValue as number)) * multiplier;
  });

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => {
    const isActive = sortConfig.field === field;
    return (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 gap-1 text-xs font-medium"
        onClick={() => handleSort(field)}
      >
        {children}
        <HugeiconsIcon
          icon={
            isActive
              ? sortConfig.direction === "asc"
                ? ArrowUp01Icon
                : ArrowDown01Icon
              : ArrowUpDownIcon
          }
          className={cn("size-3", isActive ? "text-foreground" : "text-muted-foreground")}
        />
      </Button>
    );
  };

  if (isLoading) {
    return (
      <Card className="border bg-card/50 shadow-none">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <div className="space-y-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border bg-card/50 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Detail Performa per Subtes</CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        {!data || data.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            Belum ada data. Mulai latihan untuk melihat progresmu!
          </div>
        ) : (
          <div className="-mx-3 sm:mx-0 sm:rounded-md sm:border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px] sm:w-[180px]">
                      <SortButton field="section">Subtes</SortButton>
                    </TableHead>
                    <TableHead className="text-right">
                      <SortButton field="accuracy">Akurasi</SortButton>
                    </TableHead>
                    <TableHead className="text-right hidden sm:table-cell">
                      <SortButton field="attempts">Soal</SortButton>
                    </TableHead>
                    <TableHead className="text-right hidden sm:table-cell">
                      <SortButton field="correct">Benar</SortButton>
                    </TableHead>
                    <TableHead className="text-right hidden md:table-cell">
                      <SortButton field="avg_time_seconds">Rata-rata Waktu</SortButton>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.map((row) => {
                    const isTPS = TPS_SECTIONS.includes(
                      row.section as (typeof TPS_SECTIONS)[number],
                    );
                    return (
                      <TableRow key={row.section}>
                        <TableCell className="py-2 sm:py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "size-2 rounded-full flex-shrink-0",
                                isTPS ? "bg-blue-500" : "bg-emerald-500",
                              )}
                            />
                            <div className="min-w-0">
                              <div className="font-medium text-sm">{row.section}</div>
                              <div className="text-[10px] sm:text-xs text-muted-foreground truncate">
                                {row.section_name}
                              </div>
                              {/* Mobile-only: show attempts/correct inline */}
                              <div className="text-[10px] text-muted-foreground sm:hidden">
                                {row.correct}/{row.attempts} benar
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-2 sm:py-4">
                          <span
                            className={cn(
                              "font-medium text-sm",
                              row.accuracy >= 75
                                ? "text-emerald-500"
                                : row.accuracy >= 50
                                  ? "text-amber-500"
                                  : "text-rose-500",
                            )}
                          >
                            {row.accuracy.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right hidden sm:table-cell">
                          {row.attempts}
                        </TableCell>
                        <TableCell className="text-right hidden sm:table-cell">
                          {row.correct}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground hidden md:table-cell">
                          {formatTime(row.avg_time_seconds)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
