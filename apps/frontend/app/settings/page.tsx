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
import { Navbar } from "@/features/dashboard/components/navbar";
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Pengaturan</h1>
          <p className="text-muted-foreground">Kelola profil dan preferensi akun kamu</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button variant="link" size="sm" onClick={refetch} className="ml-2 p-0 h-auto">
                Coba lagi
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
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
    </div>
  );
}
