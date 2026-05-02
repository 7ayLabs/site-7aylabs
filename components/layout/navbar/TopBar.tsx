"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { AnimatePresence } from "framer-motion";

import { ROUTES, NAV_CATEGORIES } from "@/lib/constants/routes";
import { useTheme } from "@/components/providers/ThemeProvider";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import CtaPill from "@/components/ui/CtaPill";
import CategoryDropdown from "./CategoryDropdown";
import MobileAccordion from "./MobileAccordion";
import { cn } from "@/lib/utils/cn";

const CAT_KEY: Record<string, string> = {
  Learn: "learn",
  Build: "build",
  Network: "network",
  Community: "community",
};

interface TopBarProps {
  scrolled: boolean;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  activeCategory: string | null;
  openCategory: (label: string) => void;
  closeDropdown: () => void;
  closeDropdownImmediate: () => void;
  accordionItem: string | null;
  setAccordionItem: (v: string | null) => void;
}

/**
 * Flat full-width top bar.
 *
 * - No floating pill, no glass effect — just type, hairline, and a calm
 *   border that fades in only when the page has scrolled.
 * - Categories are plain text triggers with a small chevron; the dropdown
 *   panel anchors directly below the trigger on desktop.
 * - Mobile collapses everything to logo + hamburger; menu lives in
 *   `MobileAccordion` (re-skinned as a full-screen overlay).
 */
export default function TopBar({
  scrolled,
  mobileOpen,
  setMobileOpen,
  activeCategory,
  openCategory,
  closeDropdown,
  closeDropdownImmediate,
  accordionItem,
  setAccordionItem,
}: TopBarProps) {
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations("nav");

  const Wrapper = shouldReduceMotion ? "header" : motion.header;
  const activeCatData = activeCategory
    ? NAV_CATEGORIES.find((c) => c.label === activeCategory) ?? null
    : null;

  return (
    <Wrapper
      className="fixed top-0 left-0 right-0 z-50"
      {...(!shouldReduceMotion && {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      })}
    >
      {/* Surface — transparent at top, near-opaque page color + hairline on scroll */}
      <div
        onMouseLeave={closeDropdown}
        className={cn(
          "relative w-full transition-colors duration-300",
          scrolled
            ? theme === "dark"
              ? "bg-[rgba(10,10,10,0.84)] backdrop-blur-md"
              : "bg-[rgba(250,250,247,0.84)] backdrop-blur-md"
            : "bg-transparent"
        )}
        style={{
          borderBottom: scrolled
            ? "1px solid var(--color-border-primary)"
            : "1px solid transparent",
        }}
      >
        <nav
          className={cn(
            "max-w-7xl mx-auto flex items-center justify-between gap-6",
            "px-6 sm:px-8 lg:px-12",
            "h-14 md:h-16"
          )}
          aria-label="Primary"
        >
          {/* Left: Logo — clickable, returns to home with a soft pop on hover. */}
          <Link
            href={ROUTES.home}
            className="flex items-center shrink-0 cursor-pointer hover-pop focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/40 rounded-sm"
            aria-label={t("aria.homeLink")}
          >
            <Image
              src={theme === "dark" ? "/7aylabs_white_logo.svg" : "/7aylabs_blacklogo.png"}
              alt={t("logoAlt")}
              width={86}
              height={22}
              className="select-none"
              priority
            />
          </Link>

          {/* Center: Category triggers (desktop only) */}
          <ul className="hidden md:flex items-center justify-center flex-1 gap-1">
            {NAV_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.label;
              return (
                <li key={cat.label} className="relative">
                  <button
                    type="button"
                    onMouseEnter={() => openCategory(cat.label)}
                    onFocus={() => openCategory(cat.label)}
                    onClick={() =>
                      isActive ? closeDropdownImmediate() : openCategory(cat.label)
                    }
                    aria-haspopup="menu"
                    aria-expanded={isActive}
                    aria-controls={`nav-dropdown-${cat.label.toLowerCase()}`}
                    className={cn(
                      "inline-flex items-center gap-1 px-3 py-2",
                      "text-[13.5px] font-medium",
                      "transition-colors duration-150",
                      isActive
                        ? "text-fg"
                        : "text-fg-secondary hover:text-fg"
                    )}
                  >
                    <span>{t(`categories.${CAT_KEY[cat.label]}`)}</span>
                    <ChevronDown
                      size={11}
                      strokeWidth={2.25}
                      className={cn(
                        "opacity-60 transition-transform duration-200",
                        isActive && "rotate-180"
                      )}
                    />
                    {/* Active underline */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute left-3 right-3 -bottom-px h-px transition-opacity duration-200",
                        isActive ? "opacity-100" : "opacity-0"
                      )}
                      style={{ background: "var(--color-fg-primary)" }}
                    />
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Right: utilities */}
          <div className="flex items-center justify-end shrink-0 gap-1.5">
            <div className="hidden md:flex items-center gap-1.5">
              <LanguageSwitcher />
              <ThemeToggle />
              <CtaPill />
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                "md:hidden inline-flex items-center justify-center",
                "w-10 h-10 rounded-full",
                "text-fg hover:bg-[var(--color-bg-card-hover)]",
                "transition-colors duration-150"
              )}
              aria-label={
                mobileOpen ? t("aria.closeMenu") : t("aria.openMenu")
              }
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X size={18} strokeWidth={2} />
              ) : (
                <Menu size={18} strokeWidth={2} />
              )}
            </button>
          </div>
        </nav>

        {/* Dropdown panel — anchored to the nav row, full-width with centered content */}
        <AnimatePresence mode="wait">
          {activeCatData && (
            <motion.div
              key={activeCatData.label}
              id={`nav-dropdown-${activeCatData.label.toLowerCase()}`}
              role="menu"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "absolute left-0 right-0 top-full",
                "border-b border-[var(--color-border-primary)]"
              )}
              style={{
                background:
                  theme === "dark"
                    ? "rgba(8, 8, 14, 0.92)"
                    : "rgba(255, 252, 244, 0.94)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              <CategoryDropdown
                category={activeCatData}
                onClose={closeDropdownImmediate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Wrapper>
  );
}
