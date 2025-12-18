"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, type buttonVariants } from "./button";
import { Spinner } from "./spinner";
import type { VariantProps } from "class-variance-authority";

interface LoadingButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  /** Whether the button is in loading state */
  loading?: boolean;
  /** Text to show while loading (optional) */
  loadingText?: string;
  /** Position of the spinner */
  spinnerPosition?: "left" | "right";
  asChild?: boolean;
}

/**
 * Button component with built-in loading state
 * Shows a spinner and optionally different text when loading
 */
function LoadingButton({
  children,
  loading = false,
  loadingText,
  spinnerPosition = "left",
  disabled,
  className,
  size,
  ...props
}: LoadingButtonProps) {
  const spinnerSize = size === "xs" || size === "sm" ? "xs" : "sm";

  return (
    <Button
      disabled={disabled || loading}
      className={cn(loading && "cursor-wait", className)}
      size={size}
      {...props}
    >
      {loading && spinnerPosition === "left" && <Spinner size={spinnerSize} className="mr-1" />}
      {loading && loadingText ? loadingText : children}
      {loading && spinnerPosition === "right" && <Spinner size={spinnerSize} className="ml-1" />}
    </Button>
  );
}

export { LoadingButton };
