"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Globe } from "lucide-react";
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
          "flex items-center gap-1.5 px-2 h-9 rounded-xl transition-colors duration-fast",
          "text-fg-muted hover:text-[var(--color-accent-primary)] hover:bg-[var(--glass-bg-hover)] hover:shadow-glow-sm",
          "text-xs font-medium uppercase tracking-wider"
        )}
        aria-label="Change language"
        aria-expanded={open}
      >
        <Globe size={16} />
        <span>{locale.toUpperCase()}</span>
      </button>

      {open && (
        <div
          className={cn(
            "absolute right-0 top-full mt-2 z-50",
            "glass-card rounded-xl overflow-hidden min-w-[140px]",
            "border border-[var(--glass-border)] shadow-lg",
            "animate-in fade-in slide-in-from-top-1 duration-150"
          )}
        >
          {routing.locales.map((l) => (
            <button
              key={l}
              onClick={() => switchLocale(l)}
              className={cn(
                "w-full text-left px-4 py-2.5 text-sm transition-colors duration-fast",
                "hover:bg-[var(--glass-bg-hover)]",
                l === locale
                  ? "text-[var(--color-accent-primary)] font-medium"
                  : "text-fg-secondary"
              )}
            >
              <span className="uppercase text-[10px] tracking-wider text-fg-muted mr-2 inline-block w-5">
                {l}
              </span>
              {LANGUAGE_NAMES[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
