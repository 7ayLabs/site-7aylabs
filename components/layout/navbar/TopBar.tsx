"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { ROUTES, NAV_LINKS } from "@/lib/constants/routes";
import { useTheme } from "@/components/providers/ThemeProvider";
import ThemeToggle from "@/components/ui/ThemeToggle";

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

  return (
    <header
      className={`
        sticky top-0 z-50 w-full will-change-transform
        bg-[var(--color-bg-primary)] border-b border-[var(--color-border-primary)] backdrop-blur-xl
        transition-[height,transform] duration-300 ease-out
        ${scrolled ? "h-12 md:h-14" : "h-16"}
      `}
    >
      <nav
        className={`
          h-full max-w-screen-2xl mx-auto
          flex items-center justify-between
          transition-[padding,transform] duration-300 ease-out
          ${scrolled ? "px-6 md:px-8" : "px-8"}
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
            alt="7ayLabs Logo"
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
              className="hover:text-fg transition"
            >
              {link.label}
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
          <ThemeToggle />

          <div className="relative group">
            <Link
              href={ROUTES.waitlist}
              className={`
                rounded-full border border-[var(--color-border-secondary)]
                bg-fg text-bg
                text-xs font-medium
                hover:opacity-90 transition
                ${scrolled ? "px-3 py-1" : "px-4 py-1.5"}
              `}
            >
              Join Waitlist
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="
              md:hidden p-1 rounded-full
              text-fg-secondary hover:text-fg
              transition-transform duration-300 ease-out
            "
            aria-label={open ? "Close menu" : "Open menu"}
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
    </header>
  );
}
