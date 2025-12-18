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
      className={cn("text-left transition-all w-full", disabled && "cursor-not-allowed opacity-50")}
    >
      <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all">
        <CardHeader className="p-3 pb-1 sm:p-6 sm:pb-2">
          <div className="flex items-center justify-between">
            <span className="text-xl sm:text-2xl">{section.icon}</span>
            <Badge
              variant={section.category === "TPS" ? "default" : "secondary"}
              className="text-[9px] px-1.5 py-0 sm:text-xs sm:px-2.5 sm:py-0.5"
            >
              {section.category}
            </Badge>
          </div>
          <CardTitle className="text-sm sm:text-base">{section.name}</CardTitle>
          <CardDescription className="text-[10px] sm:text-xs">{section.id}</CardDescription>
        </CardHeader>
        <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
          <p className="text-muted-foreground text-[10px] sm:text-xs line-clamp-2">
            {section.description}
          </p>
        </CardContent>
      </Card>
    </button>
  );
}

export function SectionSelector({ onSelect, isLoading = false }: SectionSelectorProps) {
  const tpsSections = SECTIONS.filter((s) => s.category === "TPS");
  const literasiSections = SECTIONS.filter((s) => s.category === "Literasi");

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* TPS Section */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-[10px] sm:text-xs">
            TPS
          </Badge>
          <span className="text-muted-foreground text-xs sm:text-sm">Tes Potensi Skolastik</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
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
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px] sm:text-xs">
            Literasi
          </Badge>
          <span className="text-muted-foreground text-xs sm:text-sm">Literasi dan Penalaran</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3">
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
