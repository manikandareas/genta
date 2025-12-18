"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { SECTION_METADATA, type Section } from "../types";

interface ReadinessHeaderProps {
  section: Section;
  isLoading?: boolean;
}

export function ReadinessHeader({ section, isLoading }: ReadinessHeaderProps) {
  const metadata = SECTION_METADATA[section];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-24" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/dashboard">
          <HugeiconsIcon icon={ArrowLeft01Icon} className="mr-1 size-4" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold tracking-tight">{metadata.fullName}</h1>
        <Badge
          variant={metadata.category === "TPS" ? "default" : "secondary"}
          className={
            metadata.category === "TPS"
              ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          }
        >
          {metadata.category}
        </Badge>
      </div>

      <p className="text-muted-foreground">{metadata.description}</p>
    </div>
  );
}
