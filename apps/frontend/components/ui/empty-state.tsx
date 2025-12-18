"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "./empty";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  BookOpen01Icon,
  ChartLineData01Icon,
  FileSearchIcon,
  UserIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

type EmptyStateVariant = "practice" | "analytics" | "search" | "profile" | "default";

interface EmptyStateProps {
  /** Predefined variant for common empty states */
  variant?: EmptyStateVariant;
  /** Custom title (overrides variant default) */
  title?: string;
  /** Custom description (overrides variant default) */
  description?: string;
  /** Custom icon (overrides variant default) */
  icon?: IconSvgElement;
  /** Action button label */
  actionLabel?: string;
  /** Action button href (renders as Link) */
  actionHref?: string;
  /** Action button onClick (renders as Button) */
  onAction?: () => void;
  /** Additional className */
  className?: string;
}

const variantConfig: Record<
  EmptyStateVariant,
  {
    icon: IconSvgElement;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
  }
> = {
  practice: {
    icon: BookOpen01Icon,
    title: "Belum ada latihan",
    description: "Mulai latihan untuk meningkatkan kemampuanmu.",
    actionLabel: "Mulai Latihan",
    actionHref: "/practice",
  },
  analytics: {
    icon: ChartLineData01Icon,
    title: "Belum ada data",
    description: "Selesaikan beberapa latihan untuk melihat analitik progressmu.",
    actionLabel: "Mulai Latihan",
    actionHref: "/practice",
  },
  search: {
    icon: FileSearchIcon,
    title: "Tidak ditemukan",
    description: "Tidak ada hasil yang cocok dengan pencarianmu.",
  },
  profile: {
    icon: UserIcon,
    title: "Profil belum lengkap",
    description: "Lengkapi profilmu untuk pengalaman yang lebih personal.",
    actionLabel: "Lengkapi Profil",
    actionHref: "/settings",
  },
  default: {
    icon: BookOpen01Icon,
    title: "Belum ada data",
    description: "Data belum tersedia saat ini.",
  },
};

/**
 * Reusable empty state component with predefined variants
 * Use for showing helpful messages when no data is available
 */
function EmptyState({
  variant = "default",
  title,
  description,
  icon,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const displayIcon = icon || config.icon;
  const displayTitle = title || config.title;
  const displayDescription = description || config.description;
  const displayActionLabel = actionLabel || config.actionLabel;
  const displayActionHref = actionHref || config.actionHref;

  const hasAction = displayActionLabel && (displayActionHref || onAction);

  return (
    <Empty className={cn("py-12", className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={displayIcon} className="size-5" />
        </EmptyMedia>
        <EmptyTitle>{displayTitle}</EmptyTitle>
        <EmptyDescription>{displayDescription}</EmptyDescription>
      </EmptyHeader>
      {hasAction && (
        <EmptyContent>
          {displayActionHref ? (
            <Link href={displayActionHref}>
              <Button size="sm" className="gap-2">
                {displayActionLabel}
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
              </Button>
            </Link>
          ) : (
            <Button size="sm" className="gap-2" onClick={onAction}>
              {displayActionLabel}
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
            </Button>
          )}
        </EmptyContent>
      )}
    </Empty>
  );
}

export { EmptyState };
