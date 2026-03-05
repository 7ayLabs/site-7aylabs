"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ROUTES, NAV_LINKS } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

interface TopBarProps {
  menuOpen: boolean;
  onToggleMenu: () => void;
}

export default function TopBar({ menuOpen, onToggleMenu }: TopBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-fixed w-full transition-all duration-300",
        scrolled
          ? "glass-strong shadow-lg"
          : "bg-transparent"
      )}
    >
      <nav
        className="section-container h-16 md:h-[72px] flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href={ROUTES.home}
          className="flex items-center shrink-0"
          aria-label="7ayLabs home"
        >
          <Image
            src="/7aylabs_white_logo.svg"
            alt="7ayLabs"
            width={96}
            height={24}
            className="select-none"
            priority
          />
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-fast",
                  isActive
                    ? "text-white"
                    : "text-white/50 hover:text-white/80"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.waitlist}
            className="hidden sm:inline-flex items-center justify-center rounded-full bg-accent text-black text-sm font-semibold px-5 py-2.5 hover:bg-accent-secondary transition-colors duration-fast"
          >
            Join Waitlist
          </Link>

          {/* Hamburger */}
          <button
            onClick={onToggleMenu}
            className="lg:hidden flex items-center justify-center w-10 h-10 -mr-1 rounded-lg text-white/60 hover:text-white transition-colors duration-fast"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path
                className={cn(
                  "origin-center transition-transform duration-300",
                  menuOpen && "translate-y-[3px] rotate-45"
                )}
                d="M4 7h12"
              />
              <path
                className={cn(
                  "origin-center transition-transform duration-300",
                  menuOpen && "-translate-y-[3px] -rotate-45"
                )}
                d="M4 13h12"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
