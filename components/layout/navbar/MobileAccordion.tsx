"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { ROUTES, NAV_CATEGORIES } from "@/lib/constants/routes";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils/cn";

const CAT_KEY: Record<string, string> = {
  Learn: "learn",
  Build: "build",
  Network: "network",
  Community: "community",
};

const LABEL_TO_NAV_KEY: Record<string, string> = {
  Technology: "technology",
  "Why Presence": "whyPresence",
  "Use Cases": "useCases",
  Devnet: "devnet",
  Validators: "validators",
  Ecosystem: "ecosystem",
  Glossary: "glossary",
  Updates: "updates",
  Waitlist: "waitlist",
  Newsletter: "newsletter",
  GitHub: "github",
  "X (Twitter)": "xTwitter",
};

interface MobileMenuProps {
  /** Retained for prop compatibility with `Navbar.tsx`. */
  openItem: string | null;
  setOpenItem: (v: string | null) => void;
  onClose: () => void;
}

/**
 * Full-screen mobile menu.
 *
 * - Replaces the accordion-style mobile menu with a flat overlay
 * - Each top-level category appears as an uppercase label followed by its
 *   items as large, tappable rows — no nested expansion needed
 * - Bottom-pinned CTA + utility row (Language + Theme)
 *
 * The component name is kept (`MobileAccordion`) for parent-import
 * compatibility, but the UX is no longer an accordion.
 */
export default function MobileMenu({ onClose }: MobileMenuProps) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-40 md:hidden flex flex-col mobile-menu-enter"
      style={{ background: "var(--color-bg-primary)" }}
    >
      {/* Spacer matches the closed nav height so content doesn't overlap the X */}
      <div className="h-14 shrink-0" aria-hidden="true" />

      {/* Scrollable category list */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="px-6 pt-4 pb-8">
          {NAV_CATEGORIES.map((cat, idx) => (
            <section
              key={cat.label}
              className={cn(
                "py-6 mobile-menu-section",
                idx > 0 && "border-t border-[var(--color-border-primary)]"
              )}
              style={{ animationDelay: `${0.05 + idx * 0.06}s` }}
            >
              <h2 className="font-mono text-[10px] tracking-[0.22em] uppercase text-fg-muted mb-4">
                {t(`categories.${CAT_KEY[cat.label]}`)}
              </h2>

              <ul className="flex flex-col">
                {cat.items.map((item) => {
                  const isExternal = "external" in item && item.external;
                  const navKey = LABEL_TO_NAV_KEY[item.label] ?? item.label;
                  const rowClasses = cn(
                    "group flex items-center justify-between",
                    "py-3 -mx-2 px-2 rounded-md",
                    "text-fg active:bg-[var(--color-bg-card-hover)]",
                    "transition-colors duration-150"
                  );

                  if (isExternal) {
                    return (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={onClose}
                          className={rowClasses}
                        >
                          <span className="font-display text-2xl font-semibold tracking-tight">
                            {t(navKey)}
                          </span>
                          <ArrowUpRight
                            size={20}
                            strokeWidth={1.75}
                            className="text-fg-tertiary"
                            aria-hidden="true"
                          />
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={rowClasses}
                      >
                        <span className="font-display text-2xl font-semibold tracking-tight">
                          {t(navKey)}
                        </span>
                        <ArrowUpRight
                          size={20}
                          strokeWidth={1.75}
                          className="text-fg-tertiary opacity-0 group-active:opacity-100 transition-opacity"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {/* Bottom-pinned actions */}
      <div
        className="shrink-0 border-t border-[var(--color-border-primary)] px-6 py-4"
        style={{ background: "var(--color-bg-primary)" }}
      >
        <div className="flex items-center justify-between gap-3">
          <Link
            href={ROUTES.waitlist}
            onClick={onClose}
            className={cn(
              "flex-1 inline-flex items-center justify-center gap-2",
              "h-12 px-6 rounded-full",
              "text-sm font-semibold",
              "bg-[var(--color-accent-primary)] text-white",
              "active:scale-[0.98] transition-transform"
            )}
          >
            <span>{tc("getEarlyAccess")}</span>
            <ArrowUpRight size={14} strokeWidth={2.25} aria-hidden="true" />
          </Link>
          <div className="flex items-center gap-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
