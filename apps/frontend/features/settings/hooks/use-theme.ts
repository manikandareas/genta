"use client";

import { useState, useEffect, useCallback, useMemo, useSyncExternalStore } from "react";
import type { Theme } from "../types";

const THEME_STORAGE_KEY = "genta-theme";

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const effectiveTheme = theme === "system" ? getSystemTheme() : theme;

  root.classList.remove("light", "dark");
  root.classList.add(effectiveTheme);
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  if (stored && ["light", "dark", "system"].includes(stored)) {
    return stored;
  }
  return "system";
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getServerSnapshot(): Theme {
  return "system";
}

// Subscribe to system theme changes
function subscribeToSystemTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSystemThemeSnapshot(): "light" | "dark" {
  return getSystemTheme();
}

function getSystemThemeServerSnapshot(): "light" | "dark" {
  return "light";
}

interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: "light" | "dark";
}

export function useTheme(): UseThemeReturn {
  // Use useSyncExternalStore for initial theme to avoid hydration mismatch
  const storedTheme = useSyncExternalStore(subscribeToStorage, getStoredTheme, getServerSnapshot);
  const [theme, setThemeState] = useState<Theme>(storedTheme);

  // Track system theme changes
  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemThemeSnapshot,
    getSystemThemeServerSnapshot,
  );

  // Compute effective theme based on current theme and system preference
  const effectiveTheme = useMemo(() => {
    return theme === "system" ? systemTheme : theme;
  }, [theme, systemTheme]);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme, systemTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  }, []);

  return {
    theme,
    setTheme,
    effectiveTheme,
  };
}
