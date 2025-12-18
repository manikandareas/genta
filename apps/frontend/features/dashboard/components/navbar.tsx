"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Agreement02Icon,
  Menu01Icon,
  Home01Icon,
  Target01Icon,
  Analytics01Icon,
  Settings01Icon,
  AbsoluteIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import type { User } from "@genta/zod";

interface NavbarProps {
  user?: User | null;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home01Icon },
  { href: "/practice", label: "Practice", icon: Target01Icon },
  { href: "/analytics", label: "Analytics", icon: Analytics01Icon },
  { href: "/settings", label: "Settings", icon: Settings01Icon },
];

export function Navbar({ user: _user }: NavbarProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

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

          {/* Mobile Menu - Full Screen Bottom Drawer */}
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="size-9 md:hidden">
                <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} className="size-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-dvh max-h-dvh px-6">
              <DrawerTitle className="sr-only">Menu</DrawerTitle>

              {/* Logo */}
              <div className="flex items-center gap-2 py-6">
                <HugeiconsIcon
                  icon={Agreement02Icon}
                  strokeWidth={2}
                  className="size-6 text-primary"
                />
                <span className="text-xl font-bold text-primary">GENTA</span>
              </div>

              {/* Navigation */}
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      className={cn(
                        "flex items-center gap-4 rounded-xl px-4 py-4 text-base font-medium transition-all",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <HugeiconsIcon
                        icon={item.icon}
                        strokeWidth={2}
                        className={cn(
                          "size-6",
                          isActive ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* User Info at Bottom */}
              <div className="mt-auto border-t py-6">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "size-12",
                    },
                  }}
                  showName
                  customMenuItems={[
                    {
                      label: "Analytics",
                      href: "/analytics",
                    },
                  ]}
                />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
