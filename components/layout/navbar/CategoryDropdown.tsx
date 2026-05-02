"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

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

const LABEL_TO_DESC_KEY: Record<string, string> = {
  Technology: "technologyDesc",
  "Why Presence": "whyPresenceDesc",
  "Use Cases": "useCasesDesc",
  Devnet: "devnetDesc",
  Validators: "validatorsDesc",
  Ecosystem: "ecosystemDesc",
  Glossary: "glossaryDesc",
  Updates: "updatesDesc",
  Waitlist: "waitlistDesc",
  Newsletter: "newsletterDesc",
  GitHub: "githubDesc",
  "X (Twitter)": "xTwitterDesc",
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

/**
 * Minimal category dropdown — anchored to the nav row, full-width surface
 * with content constrained to the same `max-w-7xl` as the nav itself.
 *
 * Items are laid out as a 2-column grid on desktop with a small description
 * paragraph next to each link. No icons, no fills — type and a hairline.
 */
export default function CategoryDropdown({
  category,
  onClose,
}: CategoryDropdownProps) {
  const t = useTranslations("nav");

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
        {category.items.map((item) => {
          const isExternal = "external" in item && item.external;
          const navKey = LABEL_TO_NAV_KEY[item.label] ?? item.label;
          const descKey = LABEL_TO_DESC_KEY[item.label];

          // Try the description key; fall back gracefully if it doesn't exist.
          let description = "";
          try {
            description = descKey ? t(`descriptions.${descKey}`) : "";
          } catch {
            description = "";
          }

          const itemClasses = cn(
            "group relative flex items-start justify-between gap-6",
            "py-4 px-2 -mx-2 rounded-lg",
            "transition-colors duration-150",
            "hover:bg-[var(--color-bg-card-hover)]"
          );

          const inner = (
            <>
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-display text-[15px] font-semibold text-fg leading-tight tracking-tight">
                  {t(navKey)}
                </span>
                {description && (
                  <span className="text-[12.5px] leading-snug text-fg-tertiary line-clamp-2">
                    {description}
                  </span>
                )}
              </div>
              <ArrowUpRight
                size={14}
                strokeWidth={2}
                className={cn(
                  "shrink-0 mt-1",
                  "text-fg-muted opacity-0 -translate-x-1",
                  "group-hover:opacity-100 group-hover:translate-x-0",
                  "transition-all duration-200"
                )}
                aria-hidden="true"
              />
            </>
          );

          if (isExternal) {
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className={itemClasses}
                role="menuitem"
              >
                {inner}
              </a>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={itemClasses}
              role="menuitem"
            >
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
