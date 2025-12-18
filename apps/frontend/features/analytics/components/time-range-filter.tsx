"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TimeRange } from "../types";

interface TimeRangeFilterProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  disabled?: boolean;
}

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: 7, label: "7 Hari" },
  { value: 30, label: "30 Hari" },
  { value: 90, label: "90 Hari" },
];

export function TimeRangeFilter({ value, onChange, disabled }: TimeRangeFilterProps) {
  return (
    <Tabs value={value.toString()} onValueChange={(v) => onChange(Number(v) as TimeRange)}>
      <TabsList>
        {TIME_RANGE_OPTIONS.map((option) => (
          <TabsTrigger key={option.value} value={option.value.toString()} disabled={disabled}>
            {option.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
