"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GraduationScrollIcon,
  Target02Icon,
  Calendar03Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import NumberFlow from "@number-flow/react";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@genta/zod";

interface CountdownBannerProps {
  user: User | null;
  isLoading?: boolean;
}

function calculateDaysRemaining(examDate: string | null): number {
  if (!examDate) return 0;
  const exam = new Date(examDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  exam.setHours(0, 0, 0, 0);
  const diffTime = exam.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function CountdownBanner({ user, isLoading }: CountdownBannerProps) {
  if (isLoading) {
    return (
      <div className="relative col-span-1 flex h-64 flex-col justify-between overflow-hidden rounded-lg p-6 md:col-span-2 lg:col-span-3 bg-muted/50">
        <Skeleton className="h-16 w-32" />
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
          <Skeleton className="h-12 w-48 rounded-lg" />
        </div>
      </div>
    );
  }

  const daysRemaining = calculateDaysRemaining(user?.examDate ?? null);
  const formattedDate = user?.examDate
    ? new Date(user.examDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Belum diatur";

  return (
    <motion.div
      className="relative col-span-1 flex h-64 flex-col justify-between overflow-hidden rounded-lg p-6 text-primary-foreground md:col-span-2 lg:col-span-3"
      style={{
        background:
          "linear-gradient(135deg, var(--primary) 0%, oklch(0.5 0.14 165) 50%, oklch(0.45 0.12 170) 100%)",
      }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Decorative elements */}
      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 size-40 rounded-full bg-white/5 blur-3xl" />

      <div className="flex items-baseline gap-2">
        <NumberFlow
          value={daysRemaining}
          className="font-playfair-display text-6xl font-bold tracking-tighter"
          format={{ useGrouping: false }}
        />
        <span className="text-lg font-medium text-primary-foreground/80">hari lagi</span>
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-sm">
            <HugeiconsIcon icon={GraduationScrollIcon} className="size-4" />
            <span className="font-medium">{user?.targetPtn || "Belum diatur"}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-sm">
            <HugeiconsIcon icon={Target02Icon} className="size-4" />
            <span className="font-medium">{user?.targetScore || "-"}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-sm">
            <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
            <span className="font-medium">{formattedDate}</span>
          </div>
        </div>

        <Link href="/practice" className="w-fit">
          <Button
            variant="secondary"
            size={"lg"}
            className="gap-2 font-semibold transition-transform hover:scale-[1.02]"
          >
            Mulai Latihan Sekarang
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
