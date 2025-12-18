"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { SectionSelector } from "@/features/practice/components";
import { useSession } from "@/features/practice/hooks";
import type { Section } from "@/features/practice/types";

export default function PracticePage() {
  const router = useRouter();
  const { createSession, isCreating } = useSession();
  const [error, setError] = useState<string | null>(null);

  const handleSectionSelect = async (section: Section) => {
    setError(null);
    const session = await createSession(section);
    if (session) {
      router.push(`/practice/session/${session.id}?section=${section}`);
    } else {
      setError("Failed to start practice session. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card px-4 py-3">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/dashboard">
              <HugeiconsIcon icon={ArrowLeft01Icon} />
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Pilih Subtes</h1>
            <p className="text-muted-foreground text-xs">Pilih subtes yang ingin kamu latih</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
            <CardContent className="py-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Latihan Adaptif</CardTitle>
            <CardDescription>
              Sistem akan menyesuaikan tingkat kesulitan soal berdasarkan kemampuanmu. Semakin
              banyak latihan, semakin akurat prediksi skormu.
            </CardDescription>
          </CardHeader>
        </Card>

        <SectionSelector onSelect={handleSectionSelect} isLoading={isCreating} />
      </div>
    </div>
  );
}
