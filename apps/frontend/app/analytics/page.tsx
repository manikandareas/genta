"use client";

import { motion } from "motion/react";
import { Navbar, MobileNav } from "@/features/dashboard";
import { useUser } from "@/features/dashboard/hooks";
import {
  TimeRangeFilter,
  OverviewCards,
  AccuracyTrendChart,
  SectionComparisonChart,
  PerformanceTable,
} from "@/features/analytics/components";
import { useProgress } from "@/features/analytics/hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { RefreshIcon } from "@hugeicons/core-free-icons";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function AnalyticsPage() {
  const { user } = useUser();
  const { progress, isLoading, error, days, setDays, refetch } = useProgress(7);

  if (error && !isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={user} />
        <main className="container mx-auto max-w-6xl px-4 py-12">
          <Card className="border bg-card/50 shadow-none">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <HugeiconsIcon icon={RefreshIcon} className="mr-2 size-4" />
                Coba Lagi
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar user={user} />

      <motion.main
        className="container mx-auto max-w-6xl space-y-4 px-3 py-6 sm:space-y-6 sm:px-4 sm:py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with title and time range filter */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Analytics</h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Pantau perkembangan belajarmu secara detail
            </p>
          </div>
          <TimeRangeFilter value={days} onChange={setDays} disabled={isLoading} />
        </motion.div>

        {/* Overview Cards */}
        <motion.div variants={itemVariants}>
          <OverviewCards
            totalQuestions={progress?.total_questions_attempted ?? 0}
            totalCorrect={progress?.total_correct ?? 0}
            averageAccuracy={progress?.average_accuracy ?? 0}
            improvementThisWeek={progress?.improvement_this_week ?? 0}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Charts Grid */}
        <motion.div variants={itemVariants} className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <AccuracyTrendChart
            data={progress?.accuracy_trend}
            periodDays={days}
            isLoading={isLoading}
          />
          <SectionComparisonChart data={progress?.section_breakdown} isLoading={isLoading} />
        </motion.div>

        {/* Performance Table */}
        <motion.div variants={itemVariants}>
          <PerformanceTable data={progress?.section_breakdown} isLoading={isLoading} />
        </motion.div>
      </motion.main>

      <MobileNav />
    </div>
  );
}
