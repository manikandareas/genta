"use client";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

interface DashboardEmptyProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function DashboardEmpty({
  title = "Belum ada data",
  description = "Mulai latihan untuk melihat progress dan statistik kamu.",
  actionLabel = "Mulai Latihan",
  actionHref = "/practice",
}: DashboardEmptyProps) {
  return (
    <Empty className="py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={BookOpen01Icon} className="size-5" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href={actionHref}>
          <Button size="sm" className="gap-2">
            {actionLabel}
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
          </Button>
        </Link>
      </EmptyContent>
    </Empty>
  );
}
