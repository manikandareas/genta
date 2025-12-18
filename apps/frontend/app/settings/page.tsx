"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  ProfileSection,
  GoalsSection,
  PreferencesSection,
  SubscriptionSection,
} from "@/features/settings";
import { useProfile, useUpdateProfile, useTheme } from "@/features/settings/hooks";
import { Navbar, MobileNav } from "@/features/dashboard/components";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SettingsPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { profile, isLoading, error, refetch } = useProfile();
  const { updateProfile, isUpdating } = useUpdateProfile();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (profile && !profile.onboardingCompleted) {
      router.push("/onboarding");
    }
  }, [profile, router]);

  const handleGoalsSave = async (data: {
    targetPtn?: string;
    targetScore?: number;
    examDate?: string;
    studyHoursPerWeek?: number;
  }) => {
    const result = await updateProfile(data);
    if (result) {
      refetch();
    }
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      <main className="container mx-auto px-3 py-4 max-w-2xl sm:px-4 sm:py-6">
        <div className="mb-4 sm:mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="mb-3 sm:mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="text-xs sm:text-sm">Kembali ke Dashboard</span>
          </Button>
          <h1 className="text-xl font-bold sm:text-2xl">Pengaturan</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Kelola profil dan preferensi akun kamu
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4 sm:mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs sm:text-sm">
              {error}
              <Button
                variant="link"
                size="sm"
                onClick={refetch}
                className="ml-2 p-0 h-auto text-xs sm:text-sm"
              >
                Coba lagi
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4 sm:space-y-6">
          <ProfileSection
            fullName={profile?.fullName ?? null}
            email={profile?.email ?? ""}
            avatarUrl={profile?.avatarUrl ?? null}
            isLoading={isLoading}
          />

          <GoalsSection
            targetPtn={profile?.targetPtn ?? null}
            targetScore={profile?.targetScore ?? null}
            examDate={profile?.examDate ?? null}
            studyHoursPerWeek={profile?.studyHoursPerWeek ?? null}
            isLoading={isLoading}
            onSave={handleGoalsSave}
            isSaving={isUpdating}
          />

          <PreferencesSection theme={theme} onThemeChange={setTheme} isLoading={isLoading} />

          <SubscriptionSection
            tier={profile?.subscriptionTier ?? "free"}
            isActive={profile?.isSubscriptionActive ?? false}
            startDate={profile?.subscriptionStartDate ?? null}
            endDate={profile?.subscriptionEndDate ?? null}
            isLoading={isLoading}
          />
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
