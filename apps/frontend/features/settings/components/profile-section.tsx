"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileSectionProps {
  fullName: string | null;
  email: string;
  avatarUrl: string | null;
  isLoading?: boolean;
}

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ProfileSection({ fullName, email, avatarUrl, isLoading }: ProfileSectionProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Informasi akun kamu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil</CardTitle>
        <CardDescription>Informasi akun kamu</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Avatar size="lg" className="h-16 w-16">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName || "User"} />}
            <AvatarFallback className="text-lg">{getInitials(fullName)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-base font-medium">{fullName || "Pengguna"}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
