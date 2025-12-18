"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { AbsoluteIcon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import type { User } from "@genta/zod";

interface NavbarProps {
  user?: User | null;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/practice", label: "Practice" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" },
];

export function Navbar({ user: _user }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 h-14 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sm:h-16">
      <div className="container mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center transition-opacity gap-2 hover:opacity-80"
        >
          <HugeiconsIcon icon={AbsoluteIcon} strokeWidth={2} className="size-5 sm:size-6" />
          <span className="text-lg font-bold sm:text-xl font-mono">
            Gen<span className="text-primary">ta</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-3">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-8 sm:size-9",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
