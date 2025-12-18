"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle01Icon,
  Clock01Icon,
  Target01Icon,
  ArrowRight01Icon,
  Home01Icon,
} from "@hugeicons/core-free-icons";
import { getSectionInfo, type SessionSummaryData } from "../types";
import Link from "next/link";

interface SessionSummaryProps {
  summary: SessionSummaryData;
  onPracticeAgain: () => void;
}

export function SessionSummary({ summary, onPracticeAgain }: SessionSummaryProps) {
  const sectionInfo = summary.section ? getSectionInfo(summary.section) : null;
  const accuracyPercent = Math.round(summary.accuracy * 100);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return "text-green-600 dark:text-green-400";
    if (accuracy >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getAccuracyMessage = (accuracy: number) => {
    if (accuracy >= 80) return "Excellent! Keep up the great work! 🎉";
    if (accuracy >= 60) return "Good job! Room for improvement. 💪";
    return "Keep practicing! You'll get better. 📚";
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full bg-primary/10">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-8 text-primary" />
          </div>
          <CardTitle className="text-xl">Sesi Selesai!</CardTitle>
          <CardDescription>{getAccuracyMessage(accuracyPercent)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Section badge */}
          {sectionInfo && (
            <div className="flex justify-center">
              <Badge variant="outline" className="gap-2 px-3 py-1">
                <span>{sectionInfo.icon}</span>
                <span>{sectionInfo.name}</span>
              </Badge>
            </div>
          )}

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <HugeiconsIcon icon={Target01Icon} className="size-4" />
                <span className="text-xs">Akurasi</span>
              </div>
              <p className={`text-2xl font-bold ${getAccuracyColor(accuracyPercent)}`}>
                {accuracyPercent}%
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />
                <span className="text-xs">Benar</span>
              </div>
              <p className="text-2xl font-bold">
                {summary.correctAnswers}/{summary.totalQuestions}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <HugeiconsIcon icon={Clock01Icon} className="size-4" />
                <span className="text-xs">Durasi</span>
              </div>
              <p className="text-2xl font-bold">{summary.durationMinutes}m</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>
                {summary.correctAnswers} dari {summary.totalQuestions} soal benar
              </span>
            </div>
            <Progress value={accuracyPercent} className="h-3" />
          </div>

          {/* Theta change */}
          {summary.thetaChange !== null && (
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">Perubahan Skill Level</p>
              <p
                className={`text-lg font-semibold ${
                  summary.thetaChange > 0
                    ? "text-green-600 dark:text-green-400"
                    : summary.thetaChange < 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-muted-foreground"
                }`}
              >
                {summary.thetaChange > 0 ? "+" : ""}
                {summary.thetaChange.toFixed(3)}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button onClick={onPracticeAgain} className="flex-1">
              <span>Latihan Lagi</span>
              <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/dashboard">
                <HugeiconsIcon icon={Home01Icon} data-icon="inline-start" />
                <span>Dashboard</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
