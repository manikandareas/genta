"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SECTIONS, type Section, type SectionInfo } from "../types";

interface SectionSelectorProps {
  onSelect: (section: Section) => void;
  isLoading?: boolean;
}

function SectionCard({
  section,
  onClick,
  disabled,
}: {
  section: SectionInfo;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn("text-left transition-all", disabled && "cursor-not-allowed opacity-50")}
    >
      <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl">{section.icon}</span>
            <Badge variant={section.category === "TPS" ? "default" : "secondary"}>
              {section.category}
            </Badge>
          </div>
          <CardTitle className="text-base">{section.name}</CardTitle>
          <CardDescription className="text-xs">{section.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xs">{section.description}</p>
        </CardContent>
      </Card>
    </button>
  );
}

export function SectionSelector({ onSelect, isLoading = false }: SectionSelectorProps) {
  const tpsSections = SECTIONS.filter((s) => s.category === "TPS");
  const literasiSections = SECTIONS.filter((s) => s.category === "Literasi");

  return (
    <div className="space-y-8">
      {/* TPS Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="default">TPS</Badge>
          <span className="text-muted-foreground text-sm">Tes Potensi Skolastik</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tpsSections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              onClick={() => onSelect(section.id)}
              disabled={isLoading}
            />
          ))}
        </div>
      </div>

      {/* Literasi Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Literasi</Badge>
          <span className="text-muted-foreground text-sm">Literasi dan Penalaran</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {literasiSections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              onClick={() => onSelect(section.id)}
              disabled={isLoading}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
