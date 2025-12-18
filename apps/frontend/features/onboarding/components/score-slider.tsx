"use client";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { SCORE_MIN, SCORE_MAX } from "../types";

interface ScoreSliderProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export function ScoreSlider({ value, onChange, error }: ScoreSliderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="target-score">Target Skor UTBK</Label>
        <span className="text-sm font-semibold text-primary">{value}</span>
      </div>
      <Slider
        id="target-score"
        min={SCORE_MIN}
        max={SCORE_MAX}
        step={10}
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        className={error ? "border-destructive" : ""}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{SCORE_MIN}</span>
        <span>{SCORE_MAX}</span>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
