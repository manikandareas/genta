"use client";

import * as React from "react";
import { Button } from "./button";
import { Card, CardContent } from "./card";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, RefreshIcon } from "@hugeicons/core-free-icons";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Fallback component to render on error */
  fallback?: React.ReactNode;
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Callback when reset is triggered */
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component that catches JavaScript errors in child components
 * Displays a fallback UI and provides retry functionality
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} onRetry={this.handleReset} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error | null;
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

/**
 * Default error fallback UI component
 * Can be used standalone or as ErrorBoundary fallback
 */
function ErrorFallback({
  error,
  title = "Terjadi Kesalahan",
  message = "Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.",
  onRetry,
  className,
}: ErrorFallbackProps) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <HugeiconsIcon icon={AlertCircleIcon} className="size-6 text-destructive" />
        </div>
        <div className="text-center">
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{message}</p>
          {error && process.env.NODE_ENV === "development" && (
            <p className="mt-2 max-w-md truncate text-xs text-destructive/70">{error.message}</p>
          )}
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
            <HugeiconsIcon icon={RefreshIcon} className="size-4" />
            Coba Lagi
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export { ErrorBoundary, ErrorFallback };
