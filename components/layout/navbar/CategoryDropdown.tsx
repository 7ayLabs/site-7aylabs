"use client";

import { Link } from "@/i18n/navigation";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
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
import { cn } from "@/lib/utils/cn";

/* ── Route → custom icon component ── */
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

/* ── Animations ── */
const containerVariants: Variants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.18, delay: 0.04 },
      staggerChildren: 0.035,
      delayChildren: 0.06,
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.1 },
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -6, filter: "blur(2px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.1 },
  },
};

interface CategoryDropdownProps {
  category: {
    readonly label: string;
    readonly items: readonly {
      readonly href: string;
      readonly label: string;
      readonly external?: boolean;
    }[];
  };
  onClose: () => void;
}

export default function CategoryDropdown({
  category,
  onClose,
}: CategoryDropdownProps) {
  const t = useTranslations("nav");

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

      {/* Item list */}
      <div className="px-3 py-2.5 flex flex-col">
        {category.items.map((item) => {
          const isExternal = "external" in item && item.external;
          const Icon =
            ICON_MAP[item.href] ??
            EXTERNAL_ICON_MAP[item.label] ??
            IconEcosystem;
          const navKey = LABEL_TO_NAV_KEY[item.label] ?? item.label;

          const cls = cn(
            "group relative flex items-center gap-3",
            "pl-4 pr-3 py-2.5",
            "text-fg-secondary hover:text-[var(--color-accent-primary)]",
            "transition-colors duration-200 ease-out",
            "cursor-pointer outline-none",
            "focus-visible:text-[var(--color-accent-primary)]"
          );

          const innerContent = (
            <>
              {/* Left scanline — draws on hover */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2",
                  "h-5 w-[2px] origin-center",
                  "bg-[var(--color-accent-primary)]",
                  "scale-y-0 group-hover:scale-y-100 group-focus-visible:scale-y-100",
                  "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "shadow-[0_0_8px_rgba(23,142,119,0.5)]"
                )}
              />
              <Icon
                size={17}
                strokeWidth={1.5}
                className={cn(
                  "text-fg-muted shrink-0",
                  "group-hover:text-[var(--color-accent-primary)] group-focus-visible:text-[var(--color-accent-primary)]",
                  "transition-colors duration-200"
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
                  "opacity-0 -translate-x-1",
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
            <motion.div key={item.href} variants={itemVariants}>
              <Link href={item.href} onClick={onClose} className={cls}>
                {innerContent}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
