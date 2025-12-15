"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { CountdownData } from "../types";

interface TryoutCtaBannerProps {
  countdown: CountdownData;
}

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const totalHours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours: totalHours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

export function TryoutCtaBanner({ countdown }: TryoutCtaBannerProps) {
  const timeLeft = useCountdown(countdown.exam_date);

  return (
    <motion.div
      className="relative flex min-h-[280px] overflow-hidden rounded-2xl"
      whileHover={{ scale: 1.005 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Background image */}
      <img
        src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        className="absolute inset-0 z-0 h-full w-full object-cover brightness-50 grayscale"
      />
      {/* Color overlay */}
      <div className="bg-primary absolute inset-0 z-10 opacity-60 mix-blend-multiply" />

      {/* Content */}
      <div className="relative z-20 flex flex-1 flex-col justify-center gap-6 p-8 md:p-10">
        {/* Main text */}
        <div className="space-y-2">
          <div className="flex gap-1 items-baseline">
            <motion.h2
              className="text-2xl font-bold text-white md:text-3xl lg:text-4xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Ngerasa persiapan udah
            </motion.h2>
            <motion.h2
              className="font-playfair-display italic text-2xl font-bold text-white md:text-3xl lg:text-4xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              cukup?
            </motion.h2>
          </div>
          <motion.p
            className="max-w-md text-base text-white/80"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Buktiin dengan tryout! Cek seberapa siap kamu menghadapi UTBK sebenarnya.
          </motion.p>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link href="/tryout">
            <Button size="lg" variant={"secondary"}>
              Coba Sekarang
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Illustration */}
      <div className="relative z-20 hidden size-[320px] items-end justify-center md:flex lg:size-[380px]">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative h-full w-full"
        >
          <Image
            src="/people-with-computer.svg"
            alt="Students preparing for exam"
            fill
            className="object-contain object-bottom p-4"
            priority
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
