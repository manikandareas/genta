"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  Target01Icon,
  Analytics01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home01Icon },
  { href: "/practice", label: "Practice", icon: Target01Icon },
  { href: "/analytics", label: "Analytics", icon: Analytics01Icon },
  { href: "/settings", label: "Settings", icon: Settings01Icon },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 md:hidden">
      <div className="flex h-16 items-center justify-around px-2 safe-area-pb">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <HugeiconsIcon
                icon={item.icon}
                strokeWidth={2}
                className={cn("size-5", isActive && "text-primary")}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
