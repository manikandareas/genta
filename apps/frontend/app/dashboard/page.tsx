"use client";

import { motion } from "motion/react";
import {
  Navbar,
  WelcomeHeader,
  TryoutCtaBanner,
  StatsActivityCard,
  QuickActions,
  mockDashboardData,
} from "@/features/dashboard";

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
  const data = mockDashboardData;

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={data.user} notifications={data.notifications} />

      <motion.main
        className="container mx-auto max-w-6xl space-y-6 px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <WelcomeHeader welcome={data.welcome} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <QuickActions />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatsActivityCard
            tps={data.readiness.tps}
            literasi={data.readiness.literasi}
            overall={data.readiness.overall}
            activity={data.activity}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <TryoutCtaBanner countdown={data.countdown} />
        </motion.div>
      </motion.main>
    </div>
  );
}
