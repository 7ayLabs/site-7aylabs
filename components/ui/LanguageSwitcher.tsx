"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Globe, Check } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils/cn";

const LANGUAGE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Espa\u00f1ol",
  pt: "Portugu\u00eas",
  fr: "Fran\u00e7ais",
  de: "Deutsch",
  zh: "\u4e2d\u6587",
  ja: "\u65e5\u672c\u8a9e",
};

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(newLocale: Locale) {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=${60 * 60 * 24 * 365}`;
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 px-2.5 h-8 rounded-lg transition-all duration-200",
          "text-fg-secondary hover:text-fg",
          "hover:bg-[var(--color-bg-card-hover)]",
          "text-xs font-semibold uppercase tracking-wider"
        )}
        aria-label="Change language"
        aria-expanded={open}
      >
        <Globe size={14} strokeWidth={1.75} />
        <span>{locale.toUpperCase()}</span>
      </button>

      {open && (
        <div
          className={cn(
            "absolute right-0 top-full mt-2 z-[60]",
            "rounded-xl overflow-hidden min-w-[160px]",
            "border shadow-xl",
            "backdrop-blur-2xl backdrop-saturate-150"
          )}
          style={{
            backgroundColor:
              theme === "dark"
                ? "rgba(12, 12, 20, 0.96)"
                : "rgba(253, 245, 226, 0.96)",
            borderColor:
              theme === "dark"
                ? "rgba(255, 255, 255, 0.12)"
                : "rgba(0, 0, 0, 0.1)",
            boxShadow:
              theme === "dark"
                ? "0 8px 32px -4px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04)"
                : "0 8px 32px -4px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div className="py-1.5">
            {routing.locales.map((l) => {
              const isActive = l === locale;
              return (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm transition-colors duration-150",
                    "flex items-center gap-2.5",
                    isActive
                      ? "text-[var(--color-accent-primary)] font-medium"
                      : "text-fg-secondary hover:text-fg",
                    theme === "dark"
                      ? "hover:bg-white/[0.06]"
                      : "hover:bg-black/[0.04]"
                  )}
                >
                  <span className="uppercase text-[10px] tracking-wider text-fg-muted w-5 shrink-0 font-mono">
                    {l}
                  </span>
                  <span className="flex-1">{LANGUAGE_NAMES[l]}</span>
                  {isActive && (
                    <Check size={14} strokeWidth={2} className="shrink-0 text-[var(--color-accent-primary)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
