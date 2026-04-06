"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import {
  IconTechnology,
  IconPresence,
  IconGlossary,
  IconDevnet,
  IconValidators,
  IconEcosystem,
  IconUpdates,
  IconUseCases,
  IconWaitlist,
  IconNewsletter,
  IconGithub,
} from "./NavIcons";
import { ROUTES, NAV_CATEGORIES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

type IconComponent = React.ComponentType<{
  size?: number;
  strokeWidth?: number;
  className?: string;
}>;

const ICON_MAP: Record<string, IconComponent> = {
  "/technology": IconTechnology,
  "/why-presence": IconPresence,
  "/glossary": IconGlossary,
  "/devnet": IconDevnet,
  "/validators": IconValidators,
  "/ecosystem": IconEcosystem,
  "/updates": IconUpdates,
  "/use-cases": IconUseCases,
  "/waitlist": IconWaitlist,
  "/newsletter": IconNewsletter,
};

const EXTERNAL_ICON_MAP: Record<string, IconComponent> = {
  GitHub: IconGithub,
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

const CAT_KEY: Record<string, string> = {
  Learn: "learn",
  Build: "build",
  Network: "network",
  Community: "community",
};

/* ── Animations (mirror desktop CategoryDropdown) ── */
const containerVariants: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.18, delay: 0.04 },
      staggerChildren: 0.04,
      delayChildren: 0.06,
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.12 },
    },
  },
};

const categoryVariants: Variants = {
  hidden: { opacity: 0, y: -6, filter: "blur(2px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -4, filter: "blur(2px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
  },
};

interface MobileAccordionProps {
  openItem: string | null;
  setOpenItem: (item: string | null) => void;
  onClose: () => void;
}

export default function MobileAccordion({
  openItem,
  setOpenItem,
  onClose,
}: MobileAccordionProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  const toggleCategory = (label: string) => {
    setOpenItem(openItem === label ? null : label);
  };

  return (
    <motion.div
      className="overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Hairline separator with accent gradient pinpoint */}
      <div className="relative mx-5">
        <div className="h-px bg-[var(--color-border-primary)]" />
        <div className="absolute left-0 top-0 h-px w-12 bg-gradient-to-r from-[var(--color-accent-primary)]/60 to-transparent" />
      </div>

      <nav className="px-3 py-2.5 flex flex-col">
        {NAV_CATEGORIES.map((cat) => {
          const isOpen = openItem === cat.label;

          return (
            <motion.div key={cat.label} variants={categoryVariants}>
              {/* Category header */}
              <button
                onClick={() => toggleCategory(cat.label)}
                className={cn(
                  "w-full relative flex items-center justify-between",
                  "pl-4 pr-3 py-2.5",
                  "transition-colors duration-200 ease-out",
                  isOpen
                    ? "text-[var(--color-accent-primary)]"
                    : "text-fg-secondary hover:text-fg"
                )}
              >
                {/* Left scanline — visible when open */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2",
                    "h-5 w-[2px] origin-center",
                    "bg-[var(--color-accent-primary)]",
                    isOpen ? "scale-y-100" : "scale-y-0",
                    "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "shadow-[0_0_8px_rgba(23,142,119,0.5)]"
                  )}
                />
                <span className="text-[11px] font-bold uppercase tracking-[0.14em]">
                  {t(`categories.${CAT_KEY[cat.label]}`)}
                </span>
                <ChevronDown
                  size={13}
                  strokeWidth={2}
                  className={cn(
                    "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isOpen
                      ? "rotate-180 text-[var(--color-accent-primary)]"
                      : "opacity-50"
                  )}
                />
              </button>

              {/* Items */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                      opacity: { duration: 0.18, delay: 0.04 },
                    }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      className="flex flex-col pb-1"
                      initial="hidden"
                      animate="visible"
                      transition={{
                        staggerChildren: 0.035,
                        delayChildren: 0.05,
                      }}
                    >
                      {cat.items.map((item) => {
                        const isExternal = "external" in item;
                        const Icon =
                          ICON_MAP[item.href] ??
                          EXTERNAL_ICON_MAP[item.label] ??
                          IconEcosystem;
                        const navKey =
                          LABEL_TO_NAV_KEY[item.label] ?? item.label;
                        const isActive = pathname === item.href;

                        const cls = cn(
                          "group relative flex items-center gap-3",
                          "pl-4 pr-3 py-2.5",
                          "transition-colors duration-200 ease-out",
                          "cursor-pointer outline-none",
                          isActive
                            ? "text-[var(--color-accent-primary)]"
                            : "text-fg-secondary hover:text-[var(--color-accent-primary)] focus-visible:text-[var(--color-accent-primary)]"
                        );

                        const innerContent = (
                          <>
                            {/* Left scanline */}
                            <span
                              aria-hidden="true"
                              className={cn(
                                "absolute left-0 top-1/2 -translate-y-1/2",
                                "h-5 w-[2px] origin-center",
                                "bg-[var(--color-accent-primary)]",
                                isActive ? "scale-y-100" : "scale-y-0",
                                "group-hover:scale-y-100 group-focus-visible:scale-y-100",
                                "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                                "shadow-[0_0_8px_rgba(23,142,119,0.5)]"
                              )}
                            />
                            <Icon
                              size={17}
                              strokeWidth={1.5}
                              className={cn(
                                "shrink-0 transition-colors duration-200",
                                isActive
                                  ? "text-[var(--color-accent-primary)]"
                                  : "text-fg-muted group-hover:text-[var(--color-accent-primary)] group-focus-visible:text-[var(--color-accent-primary)]"
                              )}
                            />
                            <span className="flex-1 text-[14px] font-medium tracking-[-0.005em]">
                              {t(navKey)}
                            </span>
                            <ArrowUpRight
                              size={14}
                              strokeWidth={1.75}
                              className={cn(
                                "shrink-0 text-[var(--color-accent-primary)]",
                                isActive
                                  ? "opacity-100 translate-x-0"
                                  : "opacity-0 -translate-x-1",
                                "group-hover:opacity-100 group-hover:translate-x-0",
                                "group-focus-visible:opacity-100 group-focus-visible:translate-x-0",
                                "transition-all duration-250 ease-out"
                              )}
                            />
                          </>
                        );

                        if (isExternal) {
                          return (
                            <motion.a
                              key={item.href}
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={onClose}
                              className={cls}
                              variants={itemVariants}
                            >
                              {innerContent}
                            </motion.a>
                          );
                        }

                        return (
                          <motion.div
                            key={item.href}
                            variants={itemVariants}
                          >
                            <Link
                              href={item.href}
                              onClick={onClose}
                              className={cls}
                            >
                              {innerContent}
                            </Link>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </nav>

      {/* CTA — squared edges, in-pill footer */}
      <div className="px-3 pb-3 pt-1">
        <Link
          href={ROUTES.waitlist}
          onClick={onClose}
          className={cn(
            "flex items-center justify-center",
            "w-full py-2.5",
            "rounded-[10px]",
            "bg-[var(--color-accent-primary)] text-white",
            "text-[13px] font-semibold tracking-wide",
            "transition-all duration-200",
            "hover:shadow-[0_0_20px_-2px_rgba(23,142,119,0.4)] active:scale-[0.98]"
          )}
        >
          {tc("joinWaitlist")}
        </Link>
      </div>
    </motion.div>
  );
}
