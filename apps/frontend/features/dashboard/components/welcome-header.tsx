"use client";

import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Fire02Icon } from "@hugeicons/core-free-icons";
import NumberFlow from "@number-flow/react";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@genta/zod";

interface WelcomeHeaderProps {
  user: User | null;
  streakDays?: number;
  isLoading?: boolean;
}

export function WelcomeHeader({ user, streakDays = 0, isLoading }: WelcomeHeaderProps) {
  if (isLoading) {
    return (
      <section className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-16 w-32 rounded-xl" />
      </section>
    );
  }

  const displayName = user?.fullName?.split(" ")[0] || "User";

  return (
    <section className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">Selamat Datang, {displayName} 👋</p>
        <div className="inline-flex items-baseline gap-1">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
            Ayo Mulai
          </h1>
          <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground font-playfair-display italic">
            Latihan
          </span>
        </div>
        <p className="text-muted-foreground text-sm max-w-md">
          Pantau metrik penting seperti jumlah latihan, tingkat keberhasilan, dan kesalahan untuk
          tetap memantau performa latihanmu.
        </p>
      </div>

      <motion.div
        className="flex items-center gap-3 rounded-xl border bg-card/50 px-4 py-3 backdrop-blur-sm"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10">
          <HugeiconsIcon icon={Fire02Icon} className="size-5 text-orange-500" />
        </div>
        <div className="flex flex-col">
          <NumberFlow
            value={streakDays}
            className="text-2xl font-bold tabular-nums"
            transformTiming={{ duration: 500, easing: "ease-out" }}
            spinTiming={{ duration: 500, easing: "ease-out" }}
          />
          <span className="text-xs text-muted-foreground font-medium">Hari Streak</span>
        </div>
      </motion.div>
    </section>
  );
}
