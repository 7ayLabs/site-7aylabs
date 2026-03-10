"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ThemeToggleProps {
  className?: string;
  size?: number;
}

export default function ThemeToggle({
  className,
  size = 18,
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center justify-center w-9 h-9 rounded-xl transition-colors duration-fast",
        "text-fg-muted hover:text-[var(--color-accent-primary)] hover:bg-[var(--glass-bg-hover)] hover:shadow-glow-sm",
        className
      )}
      aria-label={
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
    >
      {theme === "light" ? <Sun size={size} /> : <Moon size={size} />}
    </button>
  );
}
