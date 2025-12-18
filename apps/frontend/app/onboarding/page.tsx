"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useApiClient } from "@/lib/api";
import { isSuccessResponse } from "@/lib/api/error-handler";
import { OnboardingForm } from "@/features/onboarding/components";
import { useOnboarding } from "@/features/onboarding/hooks";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export default function OnboardingPage() {
  const router = useRouter();
  const api = useApiClient();
  const { submitOnboarding, isSubmitting, serverErrors } = useOnboarding();
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const response = await api.User.getMe();

        if (isSuccessResponse(response.status) && response.status === 200) {
          if (response.body.onboardingCompleted) {
            router.push("/dashboard");
            return;
          }
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      } finally {
        setIsCheckingUser(false);
      }
    };

    checkOnboardingStatus();
  }, [api, router]);

  if (isCheckingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Selamat Datang di Genta</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Mari siapkan profil belajar kamu untuk pengalaman yang lebih personal
          </p>
        </div>

        <OnboardingForm
          onSubmit={submitOnboarding}
          isSubmitting={isSubmitting}
          serverErrors={serverErrors}
        />
      </motion.div>
    </div>
  );
}
