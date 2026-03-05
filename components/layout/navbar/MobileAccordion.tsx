"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { NAV_LINKS, ROUTES, EXTERNAL_LINKS } from "@/lib/constants/routes";
import { EASING } from "@/lib/constants/animations";
import { cn } from "@/lib/utils/cn";

interface MobileAccordionProps {
  onClose: () => void;
}

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2H21.552L14.34 10.471L22.824 22H16.172L10.96 14.981L4.964 22H1.656L9.316 12.984L1.176 2H7.996L12.708 8.327L18.244 2ZM17.092 20H18.924L7.004 3.937H5.04L17.092 20Z" />
    </svg>
  );
}

function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export default function MobileAccordion({ onClose }: MobileAccordionProps) {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: EASING.smooth }}
      className="flex flex-col h-full"
      aria-label="Mobile navigation"
    >
      {/* Navigation links */}
      <div className="flex flex-col gap-1 py-4">
        {NAV_LINKS.map((item, i) => {
          const isActive = pathname === item.href;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.35,
                ease: EASING.smooth,
                delay: i * 0.05,
              }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center px-4 py-3.5 rounded-xl text-lg font-medium transition-colors duration-fast",
                  isActive
                    ? "text-white bg-white/[0.06]"
                    : "text-white/60 hover:text-white hover:bg-white/[0.03]"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.06] my-4" aria-hidden="true" />

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.3, ease: EASING.smooth }}
      >
        <Link
          href={ROUTES.waitlist}
          onClick={onClose}
          className="flex items-center justify-center w-full rounded-xl bg-accent text-black text-base font-semibold py-3.5 hover:bg-accent-secondary transition-colors duration-fast"
        >
          Join Waitlist
        </Link>
      </motion.div>

      {/* Social links at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.4, ease: EASING.smooth }}
        className="mt-auto pt-8 flex items-center gap-3"
      >
        <Link
          href={EXTERNAL_LINKS.twitter}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow 7ayLabs on X"
          className="flex items-center justify-center w-10 h-10 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors duration-fast"
        >
          <XIcon />
        </Link>
        <Link
          href={EXTERNAL_LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="7ayLabs on GitHub"
          className="flex items-center justify-center w-10 h-10 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors duration-fast"
        >
          <GitHubIcon />
        </Link>
      </motion.div>
    </motion.nav>
  );
}
