"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ROUTES, NAV_LINKS } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

interface TopBarProps {
  menuOpen: boolean;
  onToggleMenu: () => void;
}

export default function TopBar({ menuOpen, onToggleMenu }: TopBarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > 12) {
        setScrolled(true);
      } else if (y < lastY) {
        setScrolled(false);
      }
      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-fixed w-full",
        "bg-dark border-b border-white/10 backdrop-blur-xl",
        "transition-[height,transform] duration-300 ease-out",
        scrolled ? "h-12 md:h-14" : "h-16"
      )}
    >
      <nav
        className={cn(
          "h-full max-w-screen-2xl mx-auto",
          "flex items-center justify-between",
          "transition-[padding] duration-300 ease-out",
          scrolled ? "px-6 md:px-8" : "px-8"
        )}
      >
        {/* Logo */}
        <Link
          href={ROUTES.home}
          className={cn(
            "flex items-center transition-transform duration-300 ease-out",
            scrolled ? "scale-[0.92]" : "scale-100"
          )}
        >
          <Image
            src="/7aylabs_white_logo.svg"
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
          className={cn(
            "hidden md:flex items-center text-sm text-white/60",
            "transition-[gap] duration-300 ease-out",
            scrolled ? "gap-6 mr-4" : "gap-8 mr-6"
          )}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-white focus-visible:text-white transition-colors duration-fast"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div
          className={cn(
            "flex items-center",
            "transition-[gap] duration-300 ease-out",
            scrolled ? "gap-3 md:gap-4" : "gap-4 md:gap-6"
          )}
        >
          {/* CTA button */}
          <Link
            href={ROUTES.waitlist}
            className={cn(
              "rounded-full border border-white/20",
              "bg-white text-black text-xs font-medium",
              "hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-dark transition-colors duration-fast",
              scrolled ? "px-3 py-1" : "px-4 py-1.5"
            )}
          >
            Join Waitlist
          </Link>

          {/* Mobile menu toggle -- min 44x44px touch target */}
          <button
            onClick={onToggleMenu}
            className="md:hidden flex items-center justify-center w-11 h-11 -mr-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 focus-visible:text-white transition-colors duration-fast"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
              className={cn(
                "transition-transform duration-300",
                menuOpen && "rotate-180"
              )}
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
