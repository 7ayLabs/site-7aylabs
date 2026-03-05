"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { EASING } from "@/lib/constants/animations";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

interface AnnouncementBannerProps {
  visible: boolean;
  onDismiss: () => void;
  className?: string;
}

export default function AnnouncementBanner({
  visible,
  onDismiss,
  className,
}: AnnouncementBannerProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            y: -24,
            filter: "blur(4px)",
            transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
          }}
          transition={{ duration: 0.4, ease: EASING.snappy }}
          className={cn(
            "relative w-full px-4 sm:px-6 py-2 sm:py-3",
            "flex items-center justify-center",
            "text-white overflow-hidden text-[11px] sm:text-xs",
            "backdrop-blur-xl",
            "bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.22))]",
            "before:absolute before:inset-0",
            "before:bg-[linear-gradient(135deg,rgba(120,170,255,0.14),transparent)]",
            "before:opacity-15 before:pointer-events-none",
            "border-b border-white/10",
            "shadow-[0_4px_28px_rgba(0,0,0,0.28)]",
            className
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full flex flex-col sm:flex-row pr-8 sm:pr-0 items-center sm:justify-center gap-2.5 sm:gap-5 text-center sm:text-left"
          >
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
              <span
                className={cn(
                  "uppercase font-medium tracking-wider text-[9px] sm:text-[9.5px]",
                  "px-2 py-0.5 rounded-full",
                  "text-[var(--color-accent-tertiary)]",
                  "bg-[rgba(120,255,180,0.14)]"
                )}
              >
                Now live
              </span>

              <p className="text-[10px] sm:text-xs text-white/80 font-normal leading-snug">
                We build high-leverage software and protocol infrastructure for
                teams shipping fast.
              </p>

              <Link
                href={ROUTES.services}
                className="text-[var(--color-accent-tertiary)] text-[9.5px] sm:text-[10px] font-medium hover:opacity-80 transition whitespace-nowrap"
              >
                See what we build
              </Link>
            </div>
          </motion.div>

          {/* Close button */}
          <button
            onClick={onDismiss}
            className={cn(
              "absolute right-2 sm:right-4 top-1/2 -translate-y-1/2",
              "w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center",
              "rounded-full text-white/40 hover:text-white",
              "hover:bg-white/10 transition text-sm"
            )}
            aria-label="Dismiss announcement"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M1 1l8 8M9 1l-8 8" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
