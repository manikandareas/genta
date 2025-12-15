"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlayIcon, Analytics01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

export function QuickActions() {
  return (
    <motion.section
      className="flex flex-col gap-3 sm:flex-row sm:items-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Link href="/practice" className="flex-1 sm:flex-none">
        <Button size="lg" className="w-full gap-2 font-semibold sm:w-auto">
          <HugeiconsIcon icon={PlayIcon} className="size-4" />
          Mulai Latihan
        </Button>
      </Link>
      <Link href="/analytics" className="flex-1 sm:flex-none">
        <Button variant="outline" size="lg" className="w-full gap-2 font-medium sm:w-auto">
          <HugeiconsIcon icon={Analytics01Icon} className="size-4" />
          Lihat Analitik
        </Button>
      </Link>
    </motion.section>
  );
}
