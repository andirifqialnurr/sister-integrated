"use client";

import { Monitor, Moon, Sun } from "lucide-react";

import { useTheme, type ThemeMode } from "@/hook/use-theme";

const themeLabels: Record<ThemeMode, string> = {
  light: "terang",
  dark: "gelap",
  system: "sistem",
};

const nextTheme: Record<ThemeMode, ThemeMode> = {
  system: "light",
  light: "dark",
  dark: "system",
};

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const Icon = theme === "system" ? Monitor : resolvedTheme === "dark" ? Sun : Moon;
  const next = nextTheme[theme];

  return (
    <button
      aria-label={`Tema ${themeLabels[theme]}. Ubah ke tema ${themeLabels[next]}`}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[hsl(var(--color-muted))] transition-colors hover:bg-[hsl(var(--color-primary-soft))] hover:text-[hsl(var(--color-primary-strong))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--color-primary))]"
      onClick={() => setTheme(next)}
      title={`Tema ${themeLabels[theme]}`}
      type="button"
    >
      <Icon aria-hidden size={16} />
      <span className="sr-only">Tema {themeLabels[theme]}</span>
    </button>
  );
}
