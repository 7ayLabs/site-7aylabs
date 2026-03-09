"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { ROUTES, NAV_LINKS } from "@/lib/constants/routes";
import { useTheme } from "@/components/providers/ThemeProvider";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { navbarSlideDown } from "@/lib/constants/animations";

/** Maps hardcoded English link labels to nav translation keys */
const LABEL_TO_KEY: Record<string, string> = {
  Technology: "technology",
  "Why Presence": "whyPresence",
  "Use Cases": "useCases",
  Devnet: "devnet",
  Validators: "validators",
};

/** Minimum scroll distance from top before header can collapse */
const SCROLL_THRESHOLD = 60;
/** Minimum scroll delta (px) to prevent micro-scroll jitter */
const SCROLL_DELTA = 5;

interface TopBarProps {
  open: boolean;
  setOpen: (v: boolean) => void;
}

export default function TopBar({ open, setOpen }: TopBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  const lastYRef = useRef(0);
  const ticking = useRef(false);

  const updateScrollState = useCallback(() => {
    const y = window.scrollY;
    const lastY = lastYRef.current;
    const delta = y - lastY;

    // Always expand header when near the top
    if (y < SCROLL_THRESHOLD) {
      setScrolled(false);
    }
    // Only toggle if scroll delta exceeds hysteresis threshold
    else if (Math.abs(delta) >= SCROLL_DELTA) {
      if (delta > 0) {
        // Scrolling down past threshold — collapse
        setScrolled(true);
      } else {
        // Scrolling up with sufficient delta — expand
        setScrolled(false);
      }
    }

    lastYRef.current = y;
    ticking.current = false;
  }, []);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(updateScrollState);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [updateScrollState]);

  const MotionHeader = shouldReduceMotion ? "header" : motion.header;

  return (
    <MotionHeader
      className={`
        sticky top-0 z-50 w-full will-change-transform
        bg-[var(--color-bg-primary)]/80 border-b border-[var(--glass-border)] backdrop-blur-[24px]
        transition-[height,transform] duration-300 ease-out
        ${scrolled ? "h-12 md:h-14" : "h-16"}
      `}
      {...(!shouldReduceMotion && {
        initial: "hidden",
        animate: "visible",
        variants: navbarSlideDown,
      })}
    >
      <nav
        className={`
          h-full max-w-screen-2xl mx-auto
          flex items-center justify-between
          transition-[padding,transform] duration-300 ease-out
          ${scrolled ? "px-4 sm:px-6 lg:px-8" : "px-5 sm:px-8 lg:px-12"}
        `}
      >
        {/* Logo */}
        <Link
          href={ROUTES.home}
          className={`
            flex items-center
            transition-transform duration-300 ease-out
            ${scrolled ? "scale-[0.92]" : "scale-100"}
          `}
        >
          <Image
            src={theme === "dark" ? "/7aylabs_white_logo.svg" : "/7aylabs_blacklogo.png"}
            alt={t("logoAlt")}
            width={84}
            height={20}
            className="select-none"
            priority
          />
        </Link>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Desktop nav links */}
        <div
          className={`
            hidden md:flex items-center
            text-sm text-fg-secondary
            transition-[gap,transform] duration-300 ease-out
            ${scrolled ? "gap-6 mr-4" : "gap-8 mr-6"}
          `}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[var(--color-accent-primary)] transition-colors duration-200"
            >
              {t(LABEL_TO_KEY[link.label] || link.label)}
            </Link>
          ))}
        </div>

        {/* Actions: ThemeToggle + CTA + Mobile toggle */}
        <div
          className={`
            flex items-center
            transition-[gap,transform] duration-300 ease-out
            ${scrolled ? "gap-3 md:gap-4" : "gap-4 md:gap-6"}
          `}
        >
          <LanguageSwitcher />
          <ThemeToggle />

          <div className="relative group">
            <Link
              href={ROUTES.waitlist}
              className={`
                rounded-full
                bg-[var(--color-accent-primary)] text-white
                text-xs font-semibold
                hover:shadow-glow-sm transition-all duration-300
                ${scrolled ? "px-3 py-1" : "px-4 py-1.5"}
              `}
            >
              {tc("joinWaitlist")}
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="
              md:hidden p-1 rounded-full
              text-fg-secondary hover:text-fg
              transition-transform duration-300 ease-out
            "
            aria-label={open ? t("aria.closeMenu") : t("aria.openMenu")}
          >
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </nav>
    </MotionHeader>
  );
}
