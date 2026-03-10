"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ROUTES, NAV_CATEGORIES } from "@/lib/constants/routes";
import { useTheme } from "@/components/providers/ThemeProvider";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import CategoryDropdown from "./CategoryDropdown";
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
}

export default function TopBar({
  scrolled,
  mobileOpen,
  setMobileOpen,
  activeCategory,
  openCategory,
  closeDropdown,
  closeDropdownImmediate,
}: TopBarProps) {
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations("nav");

  const Wrapper = shouldReduceMotion ? "header" : motion.header;

  /* Find the active category data */
  const activeCatData = activeCategory
    ? NAV_CATEGORIES.find((c) => c.label === activeCategory) ?? null
    : null;

  return (
    <Wrapper
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      {...(!shouldReduceMotion && {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      })}
    >
      {/* ── Floating pill — contains both nav row AND dropdown ── */}
      <div
        className={cn(
          "pointer-events-auto",
          "mx-4 w-full",
          "rounded-2xl",
          "backdrop-blur-2xl backdrop-saturate-150",
          "border border-[var(--color-border-secondary)]",
          "shadow-[0_4px_24px_-4px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.03)]",
          "transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled ? "mt-2 max-w-3xl" : "mt-4 max-w-4xl"
        )}
        style={{
          backgroundColor:
            theme === "dark"
              ? "rgba(8, 8, 14, 0.88)"
              : "rgba(250, 240, 220, 0.88)",
        }}
        onMouseLeave={closeDropdown}
      >
        {/* ── Nav row ── */}
        <nav
          className={cn(
            "flex items-center justify-between",
            "transition-all duration-300 ease-out",
            scrolled ? "px-4 py-2" : "px-5 py-2.5"
          )}
        >
          {/* Left: Logo */}
          <div className="flex items-center shrink-0">
            <Link
              href={ROUTES.home}
              className={cn(
                "flex items-center",
                "transition-transform duration-300 ease-out",
                scrolled ? "scale-[0.9]" : "scale-100"
              )}
            >
              <Image
                src={
                  theme === "dark"
                    ? "/7aylabs_white_logo.svg"
                    : "/7aylabs_blacklogo.png"
                }
                alt={t("logoAlt")}
                width={76}
                height={20}
                className="select-none"
                priority
              />
            </Link>
          </div>

          {/* Center: Category triggers — perfectly centered */}
          <div className="hidden md:flex items-center justify-center flex-1 gap-0.5">
            {NAV_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.label;

              return (
                <button
                  key={cat.label}
                  onMouseEnter={() => openCategory(cat.label)}
                  className={cn(
                    "flex items-center gap-1 px-3.5 py-1.5",
                    "text-[13px] font-medium",
                    "rounded-full",
                    "transition-all duration-200 ease-out",
                    isActive
                      ? "text-fg bg-[var(--color-fg-primary)]/[0.08]"
                      : "text-fg-secondary hover:text-fg"
                  )}
                >
                  {t(`categories.${CAT_KEY[cat.label]}`)}
                  <ChevronDown
                    size={11}
                    strokeWidth={2}
                    className={cn(
                      "opacity-50 transition-transform duration-200",
                      isActive && "rotate-180"
                    )}
                  />
                </button>
              );
            })}
          </div>

          {/* Right: Utils */}
          <div className="flex items-center justify-end shrink-0 gap-1">
            <LanguageSwitcher />
            <ThemeToggle />

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                "md:hidden flex items-center justify-center",
                "w-8 h-8 rounded-full",
                "text-fg-secondary hover:text-fg",
                "hover:bg-[var(--color-fg-primary)]/[0.06]",
                "transition-all duration-200"
              )}
              aria-label={
                mobileOpen ? t("aria.closeMenu") : t("aria.openMenu")
              }
            >
              {mobileOpen ? (
                <X size={16} strokeWidth={1.5} />
              ) : (
                <Menu size={16} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </nav>

        {/* ── Dropdown content — inside the pill ── */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            {activeCatData && (
              <CategoryDropdown
                key={activeCatData.label}
                category={activeCatData}
                onClose={closeDropdownImmediate}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </Wrapper>
  );
}
