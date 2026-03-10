"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
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

/* ── Animation ── */
const containerVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.2, delay: 0.05 },
      staggerChildren: 0.03,
      delayChildren: 0.08,
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.12 },
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, transition: { duration: 0.1 } },
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
      {/* Separator */}
      <div className="mx-5 border-t border-[var(--color-border-primary)]" />

      {/* Item list */}
      <div className="px-5 py-3 flex flex-col gap-0.5">
        {category.items.map((item) => {
          const isExternal = "external" in item && item.external;
          const Icon =
            ICON_MAP[item.href] ??
            EXTERNAL_ICON_MAP[item.label] ??
            IconEcosystem;
          const navKey = LABEL_TO_NAV_KEY[item.label] ?? item.label;

          const cls = cn(
            "group flex items-center gap-4",
            "px-2 py-3",
            "rounded-xl",
            "hover:bg-[var(--color-fg-primary)]/[0.04]",
            "text-fg-secondary hover:text-fg",
            "transition-all duration-150 ease-out",
            "cursor-pointer"
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
                <Icon
                  size={18}
                  strokeWidth={1.5}
                  className="text-fg-tertiary group-hover:text-fg-secondary transition-colors shrink-0"
                />
                <span className="flex-1 text-[15px] font-medium">
                  {t(navKey)}
                </span>
                <ArrowRight
                  size={16}
                  strokeWidth={1.5}
                  className="text-fg-muted shrink-0 opacity-0 group-hover:opacity-60 transition-opacity"
                />
              </motion.a>
            );
          }

          return (
            <motion.div key={item.href} variants={itemVariants}>
              <Link href={item.href} onClick={onClose} className={cls}>
                <Icon
                  size={18}
                  strokeWidth={1.5}
                  className="text-fg-tertiary group-hover:text-fg-secondary transition-colors shrink-0"
                />
                <span className="flex-1 text-[15px] font-medium">
                  {t(navKey)}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
