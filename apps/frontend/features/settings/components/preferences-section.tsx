"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Sun, Moon, Monitor } from "lucide-react";
import type { Theme } from "../types";

interface PreferencesSectionProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  isLoading?: boolean;
}

export function PreferencesSection({ theme, onThemeChange, isLoading }: PreferencesSectionProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Preferensi</CardTitle>
          <CardDescription>Pengaturan tampilan aplikasi</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferensi</CardTitle>
        <CardDescription>Pengaturan tampilan aplikasi</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label>Tema</Label>
          <ToggleGroup
            type="single"
            value={theme}
            onValueChange={(value) => value && onThemeChange(value as Theme)}
            className="justify-start"
          >
            <ToggleGroupItem value="light" aria-label="Light theme" className="gap-2">
              <Sun className="h-4 w-4" />
              <span>Terang</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="dark" aria-label="Dark theme" className="gap-2">
              <Moon className="h-4 w-4" />
              <span>Gelap</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="system" aria-label="System theme" className="gap-2">
              <Monitor className="h-4 w-4" />
              <span>Sistem</span>
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="text-xs text-muted-foreground">
            {theme === "system"
              ? "Mengikuti pengaturan sistem perangkat kamu"
              : theme === "light"
                ? "Tampilan terang untuk penggunaan siang hari"
                : "Tampilan gelap untuk mengurangi ketegangan mata"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
