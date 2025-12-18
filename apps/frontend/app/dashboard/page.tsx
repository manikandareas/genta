"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Navbar,
  MobileNav,
  WelcomeHeader,
  TryoutCtaBanner,
  StatsActivityCard,
  QuickActions,
  DashboardError,
  mockDashboardData,
} from "@/features/dashboard";
import { useUser, useReadiness } from "@/features/dashboard/hooks";

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

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: userLoading, error: userError, refetch: refetchUser } = useUser();
  const {
    readiness,
    isLoading: readinessLoading,
    error: readinessError,
    refetch: refetchReadiness,
  } = useReadiness();

  // Redirect to onboarding if user hasn't completed it
  useEffect(() => {
    if (!userLoading && user && !user.onboardingCompleted) {
      router.push("/onboarding");
    }
  }, [user, userLoading, router]);

  const isLoading = userLoading || readinessLoading;
  const hasError = userError || readinessError;

  // Transform API readiness data to match component props
  const transformedReadiness = readiness
    ? {
        tps: {
          overall_percentage: Math.round(readiness.tps_readiness),
          subtests: {
            PU: transformSectionReadiness(readiness.section_readiness?.PU),
            PPU: transformSectionReadiness(readiness.section_readiness?.PPU),
            PBM: transformSectionReadiness(readiness.section_readiness?.PBM),
            PK: transformSectionReadiness(readiness.section_readiness?.PK),
          },
        },
        literasi: {
          overall_percentage: Math.round(readiness.literasi_readiness),
          subtests: {
            LBI: transformSectionReadiness(readiness.section_readiness?.LBI),
            LBE: transformSectionReadiness(readiness.section_readiness?.LBE),
            PM: transformSectionReadiness(readiness.section_readiness?.PM),
          },
        },
        overall: {
          percentage: Math.round(readiness.overall_readiness),
          predicted_score: calculatePredictedScore(readiness.section_readiness),
          target_score: user?.targetScore || 700,
          gap: calculatePredictedScore(readiness.section_readiness) - (user?.targetScore || 700),
        },
      }
    : mockDashboardData.readiness;

  // Use mock activity data for now (will be replaced with analytics API)
  const activityData = mockDashboardData.activity;

  const handleRetry = () => {
    refetchUser();
    refetchReadiness();
  };

  if (hasError && !isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar user={user} />
        <main className="container mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-12">
          <DashboardError
            message="Gagal memuat data dashboard. Silakan coba lagi."
            onRetry={handleRetry}
          />
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
        <motion.div variants={itemVariants}>
          <WelcomeHeader
            user={user}
            streakDays={mockDashboardData.welcome.streak_days}
            isLoading={isLoading}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <QuickActions />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsActivityCard
            tps={transformedReadiness.tps}
            literasi={transformedReadiness.literasi}
            overall={transformedReadiness.overall}
            activity={activityData}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <TryoutCtaBanner user={user} isLoading={isLoading} />
        </motion.div>
      </motion.main>

      <MobileNav />
    </div>
  );
}

// Helper function to transform section readiness from API to component format
function transformSectionReadiness(
  section:
    | {
        readiness_percentage: number;
        predicted_score_low: number;
        predicted_score_high: number;
        days_to_ready?: number | null;
      }
    | undefined,
) {
  if (!section) {
    return {
      percentage: 0,
      predicted_score_low: 0,
      predicted_score_high: 0,
      days_to_ready: null,
    };
  }
  return {
    percentage: Math.round(section.readiness_percentage),
    predicted_score_low: section.predicted_score_low,
    predicted_score_high: section.predicted_score_high,
    days_to_ready: section.days_to_ready ?? null,
  };
}

// Helper function to calculate average predicted score
function calculatePredictedScore(
  sectionReadiness:
    | Record<
        string,
        {
          predicted_score_low: number;
          predicted_score_high: number;
        }
      >
    | undefined,
): number {
  if (!sectionReadiness) return 0;
  const sections = Object.values(sectionReadiness);
  if (sections.length === 0) return 0;
  const avgLow = sections.reduce((sum, s) => sum + s.predicted_score_low, 0) / sections.length;
  const avgHigh = sections.reduce((sum, s) => sum + s.predicted_score_high, 0) / sections.length;
  return Math.round((avgLow + avgHigh) / 2);
}
