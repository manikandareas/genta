"use client";

import { useParams, notFound } from "next/navigation";
import {
  ReadinessHeader,
  MetricsGrid,
  ThetaGauge,
  AccuracyTrendChart,
  SubtypeBreakdown,
  NextStepsCard,
} from "@/features/readiness/components";
import { useSectionReadiness } from "@/features/readiness/hooks";
import type { Section } from "@/features/readiness/types";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { RefreshIcon } from "@hugeicons/core-free-icons";

const VALID_SECTIONS = ["PU", "PPU", "PBM", "PK", "LBI", "LBE", "PM"] as const;

function isValidSection(section: string): section is Section {
  return VALID_SECTIONS.includes(section as Section);
}

export default function ReadinessDetailPage() {
  const params = useParams();
  const sectionParam = params.section as string;

  // Validate section parameter
  if (!isValidSection(sectionParam)) {
    notFound();
  }

  const section = sectionParam as Section;
  const { data, isLoading, error, refetch } = useSectionReadiness(section);

  if (error) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <ReadinessHeader section={section} />
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border bg-card/50 p-8">
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={refetch} variant="outline" className="mt-4">
            <HugeiconsIcon icon={RefreshIcon} className="mr-2 size-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <ReadinessHeader section={section} isLoading={isLoading} />

      {/* Metrics Grid */}
      <div className="mt-8">
        <MetricsGrid data={data} isLoading={isLoading} />
      </div>

      {/* Main Content Grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <ThetaGauge data={data} isLoading={isLoading} />
          <AccuracyTrendChart data={data?.accuracy_trend} isLoading={isLoading} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <SubtypeBreakdown data={data?.subtype_breakdown} isLoading={isLoading} />
          <NextStepsCard
            data={data?.next_steps}
            section={section}
            readinessPercentage={data?.readiness_percentage ?? 0}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
