"use client";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { STUDY_HOURS_MIN, STUDY_HOURS_MAX } from "../types";

interface StudyHoursInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export function StudyHoursInput({ value, onChange, error }: StudyHoursInputProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="study-hours">Jam Belajar per Minggu</Label>
        <span className="text-sm font-semibold text-primary">{value} jam</span>
      </div>
      <Slider
        id="study-hours"
        min={STUDY_HOURS_MIN}
        max={40}
        step={1}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        className={error ? "border-destructive" : ""}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{STUDY_HOURS_MIN} jam</span>
        <span>40 jam</span>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
