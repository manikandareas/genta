"use client";

import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Fire02Icon } from "@hugeicons/core-free-icons";
import NumberFlow from "@number-flow/react";
import type { WelcomeData } from "../types";

interface WelcomeHeaderProps {
  welcome: WelcomeData;
}

export function WelcomeHeader({ welcome }: WelcomeHeaderProps) {
  return (
    <section className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-3">
        <p className="text-muted-foreground text-sm">Selamat Datang, {welcome.full_name} 👋</p>
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
            value={welcome.streak_days}
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
