"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/providers/ThemeProvider";
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

/* ── Animations ── */
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const panelVariants = {
  hidden: { opacity: 0, y: -16, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.04,
      delayChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.97,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
  },
};

const categoryVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
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
  const { theme } = useTheme();

  const toggleCategory = (label: string) => {
    setOpenItem(openItem === label ? null : label);
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      />

      {/* ── Floating panel below the pill navbar ── */}
      <motion.div
        className="fixed top-[72px] left-0 right-0 z-50 flex justify-center px-4 md:hidden"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div
          className={cn(
            "w-full max-w-md",
            "rounded-2xl",
            "backdrop-blur-2xl backdrop-saturate-150",
            "border border-[var(--color-border-secondary)]",
            "shadow-[0_8px_40px_-8px_rgba(0,0,0,0.3)]",
            "flex flex-col",
            "max-h-[calc(100svh-5rem)]"
          )}
          style={{
            backgroundColor:
              theme === "dark"
                ? "rgba(8, 8, 14, 0.94)"
                : "rgba(250, 240, 220, 0.94)",
          }}
        >
          {/* Scrollable nav */}
          <div className="flex-1 overflow-y-auto p-3">
            <nav className="flex flex-col gap-0.5">
              {NAV_CATEGORIES.map((cat) => {
                const isOpen = openItem === cat.label;

                return (
                  <motion.div key={cat.label} variants={categoryVariants}>
                    {/* Category header */}
                    <button
                      onClick={() => toggleCategory(cat.label)}
                      className={cn(
                        "w-full flex items-center justify-between",
                        "px-3 py-2.5",
                        "rounded-lg",
                        "transition-all duration-200 ease-out",
                        isOpen
                          ? "text-fg bg-[var(--color-bg-card)]"
                          : "text-fg-secondary hover:text-fg hover:bg-[var(--color-bg-card)]"
                      )}
                    >
                      <span className="text-xs font-bold uppercase tracking-[0.12em]">
                        {t(`categories.${CAT_KEY[cat.label]}`)}
                      </span>
                      <ChevronDown
                        size={14}
                        strokeWidth={1.5}
                        className={cn(
                          "transition-transform duration-200",
                          isOpen && "rotate-180"
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
                            height: {
                              duration: 0.25,
                              ease: [0.22, 1, 0.36, 1],
                            },
                            opacity: { duration: 0.2 },
                          }}
                          className="overflow-hidden"
                        >
                          <motion.div
                            className="flex flex-col gap-1 pt-1 pb-2"
                            initial="hidden"
                            animate="visible"
                            transition={{
                              staggerChildren: 0.03,
                              delayChildren: 0.04,
                            }}
                          >
                            {cat.items.map((item) => {
                              const isExternal = "external" in item;
                              const Icon =
                                ICON_MAP[item.href] ??
                                EXTERNAL_ICON_MAP[item.label] ??
                                ArrowUpRight;
                              const navKey =
                                LABEL_TO_NAV_KEY[item.label] ?? item.label;
                              const isActive = pathname === item.href;

                              const cls = cn(
                                "group flex items-center gap-2.5",
                                "px-2.5 py-2",
                                "rounded-lg",
                                "hover:bg-[var(--color-bg-card-hover)]",
                                "text-[13px] font-medium",
                                isActive ? "text-fg" : "text-fg-secondary",
                                "transition-all duration-150 ease-out"
                              );

                              const iconBox = cn(
                                "flex items-center justify-center",
                                "w-7 h-7 rounded-md shrink-0",
                                isActive
                                  ? "bg-[var(--color-accent-primary)]/15"
                                  : "bg-[var(--color-accent-dim)]",
                                "group-hover:bg-[var(--color-accent-primary)]/15",
                                "transition-colors duration-150"
                              );

                              const iconCls = cn(
                                "text-[var(--color-accent-primary)]",
                                isActive
                                  ? "opacity-100"
                                  : "opacity-60 group-hover:opacity-100",
                                "transition-opacity duration-150"
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
                                    <div className={iconBox}>
                                      <Icon
                                        size={15}
                                        strokeWidth={1.5}
                                        className={iconCls}
                                      />
                                    </div>
                                    <span className="flex-1">
                                      {t(navKey)}
                                    </span>
                                    <ArrowUpRight
                                      size={12}
                                      strokeWidth={1.5}
                                      className="text-fg-muted shrink-0"
                                    />
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
                                    <div className={iconBox}>
                                      <Icon
                                        size={15}
                                        strokeWidth={1.5}
                                        className={iconCls}
                                      />
                                    </div>
                                    <span>{t(navKey)}</span>
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
          </div>

          {/* Bottom CTA */}
          <div className="shrink-0 px-3 pb-3 pt-2 border-t border-[var(--color-border-primary)]">
            <Link
              href={ROUTES.waitlist}
              onClick={onClose}
              className={cn(
                "flex items-center justify-center",
                "w-full py-3",
                "rounded-xl",
                "bg-[var(--color-accent-primary)] text-white",
                "text-sm font-semibold tracking-wide",
                "transition-all duration-200",
                "hover:shadow-[0_0_20px_-2px_rgba(23,142,119,0.4)] active:scale-[0.98]"
              )}
            >
              {tc("joinWaitlist")}
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
}
