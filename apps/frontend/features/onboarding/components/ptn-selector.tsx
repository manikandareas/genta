"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PTN_OPTIONS } from "../mock/mock-data";

interface PTNSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function PTNSelector({ value, onChange, error }: PTNSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="target-ptn">Target PTN</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="target-ptn" className={`w-full ${error ? "border-destructive" : ""}`}>
          <SelectValue placeholder="Pilih universitas tujuan" />
        </SelectTrigger>
        <SelectContent>
          {PTN_OPTIONS.map((ptn) => (
            <SelectItem key={ptn.value} value={ptn.value}>
              <span className="flex items-center gap-2">
                <span>{ptn.label}</span>
                <span className="text-muted-foreground">({ptn.location})</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
