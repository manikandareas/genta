"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface SubscriptionSectionProps {
  tier: string;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  isLoading?: boolean;
}

function getTierDisplay(tier: string): {
  label: string;
  color: "default" | "secondary" | "outline";
} {
  switch (tier.toLowerCase()) {
    case "premium":
      return { label: "Premium", color: "default" };
    case "pro":
      return { label: "Pro", color: "secondary" };
    default:
      return { label: "Gratis", color: "outline" };
  }
}

export function SubscriptionSection({
  tier,
  isActive,
  startDate,
  endDate,
  isLoading,
}: SubscriptionSectionProps) {
  const tierDisplay = getTierDisplay(tier);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Langganan</CardTitle>
          <CardDescription>Status paket langganan kamu</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Langganan</CardTitle>
        <CardDescription>Status paket langganan kamu</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Crown className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Paket {tierDisplay.label}</span>
                <Badge variant={tierDisplay.color}>{tierDisplay.label}</Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                {isActive ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Aktif</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 text-red-500" />
                    <span>Tidak Aktif</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {(startDate || endDate) && (
          <div className="space-y-2 text-sm">
            {startDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mulai</span>
                <span>{format(new Date(startDate), "PPP", { locale: id })}</span>
              </div>
            )}
            {endDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Berakhir</span>
                <span>{format(new Date(endDate), "PPP", { locale: id })}</span>
              </div>
            )}
          </div>
        )}

        {tier.toLowerCase() === "free" && (
          <p className="text-xs text-muted-foreground">
            Upgrade ke Premium untuk akses fitur lengkap dan latihan tanpa batas.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
