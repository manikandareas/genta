"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, type buttonVariants } from "./button";
import { Spinner } from "./spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { RefreshIcon } from "@hugeicons/core-free-icons";
import type { VariantProps } from "class-variance-authority";

interface RetryButtonProps
  extends Omit<React.ComponentProps<"button">, "children">, VariantProps<typeof buttonVariants> {
  /** Whether a retry is in progress */
  isRetrying?: boolean;
  /** Custom label text */
  label?: string;
  /** Custom retrying label text */
  retryingLabel?: string;
  /** Show icon */
  showIcon?: boolean;
}

/**
 * Retry button component for error recovery
 * Shows loading state while retrying
 */
function RetryButton({
  isRetrying = false,
  label = "Coba Lagi",
  retryingLabel = "Memuat...",
  showIcon = true,
  variant = "outline",
  size = "sm",
  className,
  disabled,
  ...props
}: RetryButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || isRetrying}
      className={cn("gap-2", className)}
      {...props}
    >
      {isRetrying ? (
        <>
          <Spinner size="sm" />
          {retryingLabel}
        </>
      ) : (
        <>
          {showIcon && <HugeiconsIcon icon={RefreshIcon} className="size-4" />}
          {label}
        </>
      )}
    </Button>
  );
}

export { RetryButton };
