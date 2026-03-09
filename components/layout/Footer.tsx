"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Github } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { EXTERNAL_LINKS, FOOTER_LINK_GROUPS } from "@/lib/constants/routes";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { footerReveal, staggerContainer, fadeUpItem } from "@/lib/constants/animations";

const FOOTER_VIEWPORT = { once: true, margin: "-100px" } as const;

export default function Footer() {
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const logoSrc =
    theme === "light"
      ? "/7aylabs_blacklogo.png"
      : "/7aylabs_white_logo.svg";

  const MotionFooter = shouldReduceMotion ? "footer" : motion.footer;

  return (
    <MotionFooter
      className="w-full border-t border-[var(--glass-border)] bg-[var(--color-bg-secondary)]/50 backdrop-blur-sm"
      {...(!shouldReduceMotion && {
        initial: "hidden",
        whileInView: "visible",
        viewport: FOOTER_VIEWPORT,
        variants: footerReveal,
      })}
    >
      {/* Main footer grid */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-12 pb-8">
        <motion.div
          className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-12"
          {...(!shouldReduceMotion && {
            variants: staggerContainer,
            initial: "hidden",
            whileInView: "visible",
            viewport: FOOTER_VIEWPORT,
          })}
        >
          {/* Brand column — spans 2 cols on all breakpoints */}
          <motion.div className="col-span-2" {...(!shouldReduceMotion && { variants: fadeUpItem })}>
            <Link href="/" aria-label="7ayLabs home">
              <Image
                src={logoSrc}
                alt="7ayLabs"
                width={120}
                height={38}
                className="mb-4"
              />
            </Link>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              <Link
                href={EXTERNAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow 7ayLabs on X"
                className="text-fg-muted hover:text-[var(--color-accent-primary)] transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.244 2H21.552L14.34 10.471L22.824 22H16.172L10.96 14.981L4.964 22H1.656L9.316 12.984L1.176 2H7.996L12.708 8.327L18.244 2ZM17.092 20H18.924L7.004 3.937H5.04L17.092 20Z" />
                </svg>
              </Link>
              <Link
                href={EXTERNAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="7ayLabs on GitHub"
                className="text-fg-muted hover:text-[var(--color-accent-primary)] transition-colors"
              >
                <Github size={16} />
              </Link>
            </div>
          </motion.div>

          {/* Link group columns */}
          {FOOTER_LINK_GROUPS.map((group) => (
            <motion.nav
              key={group.title}
              aria-label={`${group.title} links`}
              {...(!shouldReduceMotion && { variants: fadeUpItem })}
            >
              <h3 className="text-fg text-xs font-semibold uppercase tracking-widest mb-4 font-display">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => {
                  const isExternal = "external" in link && link.external;
                  return (
                    <li key={link.label}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-fg-muted text-sm hover:text-[var(--color-accent-primary)] transition-colors"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-fg-muted text-sm hover:text-[var(--color-accent-primary)] transition-colors"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.nav>
          ))}
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--glass-border)]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-fg-faint text-xs">
            &copy; {new Date().getFullYear()} 7ayLabs. All rights reserved.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </MotionFooter>
  );
}
