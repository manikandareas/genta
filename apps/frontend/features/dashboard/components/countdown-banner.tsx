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
import type { CountdownData } from "../types";

interface CountdownBannerProps {
  countdown: CountdownData;
}

export function CountdownBanner({ countdown }: CountdownBannerProps) {
  const formattedDate = new Date(countdown.exam_date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      className="relative col-span-1 flex h-64 flex-col justify-between overflow-hidden rounded-xl p-6 text-primary-foreground md:col-span-2 lg:col-span-3"
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

      <div className="relative z-10 space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest text-primary-foreground/70">
          Countdown UTBK
        </p>
        <div className="flex items-baseline gap-2">
          <NumberFlow
            value={countdown.days_remaining}
            className="font-playfair-display text-6xl font-bold tracking-tighter"
            format={{ useGrouping: false }}
          />
          <span className="text-lg font-medium text-primary-foreground/80">hari lagi</span>
        </div>
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-sm">
            <HugeiconsIcon icon={GraduationScrollIcon} className="size-4" />
            <span className="font-medium">{countdown.target_ptn}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-sm">
            <HugeiconsIcon icon={Target02Icon} className="size-4" />
            <span className="font-medium">{countdown.target_score}</span>
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
