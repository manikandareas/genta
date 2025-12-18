"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Pencil, Check, X } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { PTN_OPTIONS } from "@/features/onboarding/mock/mock-data";

const SCORE_MIN = 550;
const SCORE_MAX = 750;

interface GoalsSectionProps {
  targetPtn: string | null;
  targetScore: number | null;
  examDate: string | null;
  studyHoursPerWeek: number | null;
  isLoading?: boolean;
  onSave: (data: {
    targetPtn?: string;
    targetScore?: number;
    examDate?: string;
    studyHoursPerWeek?: number;
  }) => Promise<void>;
  isSaving?: boolean;
}

export function GoalsSection({
  targetPtn,
  targetScore,
  examDate,
  studyHoursPerWeek,
  isLoading,
  onSave,
  isSaving,
}: GoalsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPtn, setEditedPtn] = useState(targetPtn || "");
  const [editedScore, setEditedScore] = useState(targetScore || 650);
  const [editedDate, setEditedDate] = useState<Date | undefined>(
    examDate ? new Date(examDate) : undefined,
  );
  const [editedHours, setEditedHours] = useState(studyHoursPerWeek || 10);

  const handleEdit = () => {
    setEditedPtn(targetPtn || "");
    setEditedScore(targetScore || 650);
    setEditedDate(examDate ? new Date(examDate) : undefined);
    setEditedHours(studyHoursPerWeek || 10);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    await onSave({
      targetPtn: editedPtn || undefined,
      targetScore: editedScore,
      examDate: editedDate?.toISOString(),
      studyHoursPerWeek: editedHours,
    });
    setIsEditing(false);
  };

  const getPtnLabel = (value: string | null) => {
    if (!value) return "Belum dipilih";
    const ptn = PTN_OPTIONS.find((p) => p.value === value);
    return ptn ? ptn.label : value;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Target Akademik</CardTitle>
          <CardDescription>Target belajar dan ujian kamu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Target Akademik</CardTitle>
          <CardDescription>Target belajar dan ujian kamu</CardDescription>
        </div>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label>Target PTN</Label>
              <Select value={editedPtn} onValueChange={setEditedPtn}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih universitas tujuan" />
                </SelectTrigger>
                <SelectContent>
                  {PTN_OPTIONS.map((ptn) => (
                    <SelectItem key={ptn.value} value={ptn.value}>
                      {ptn.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Target Skor UTBK</Label>
                <span className="text-sm font-semibold text-primary">{editedScore}</span>
              </div>
              <Slider
                min={SCORE_MIN}
                max={SCORE_MAX}
                step={10}
                value={[editedScore]}
                onValueChange={(values) => setEditedScore(values[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{SCORE_MIN}</span>
                <span>{SCORE_MAX}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tanggal Ujian</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !editedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedDate ? format(editedDate, "PPP", { locale: id }) : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editedDate}
                    onSelect={setEditedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Jam Belajar per Minggu</Label>
              <Input
                type="number"
                min={1}
                max={168}
                value={editedHours}
                onChange={(e) => setEditedHours(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} disabled={isSaving} className="flex-1">
                <Check className="h-4 w-4 mr-1" />
                {isSaving ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                <X className="h-4 w-4 mr-1" />
                Batal
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Target PTN</span>
              <span className="font-medium">{getPtnLabel(targetPtn)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Target Skor</span>
              <span className="font-medium">{targetScore || "Belum diatur"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-muted-foreground">Tanggal Ujian</span>
              <span className="font-medium">
                {examDate ? format(new Date(examDate), "PPP", { locale: id }) : "Belum diatur"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Jam Belajar/Minggu</span>
              <span className="font-medium">
                {studyHoursPerWeek ? `${studyHoursPerWeek} jam` : "Belum diatur"}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
