"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, RefreshIcon } from "@hugeicons/core-free-icons";

interface DashboardErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function DashboardError({
  message = "Gagal memuat data. Silakan coba lagi.",
  onRetry,
}: DashboardErrorProps) {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <HugeiconsIcon icon={AlertCircleIcon} className="size-6 text-destructive" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-destructive">{message}</p>
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
