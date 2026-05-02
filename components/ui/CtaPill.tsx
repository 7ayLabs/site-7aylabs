"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils/cn";

interface CtaPillProps {
  className?: string;
  /** Translation key under the `common` namespace. Defaults to `getEarlyAccess`. */
  labelKey?: string;
  /** Override the destination. Defaults to the waitlist route. */
  href?: string;
}

/**
 * Persistent navbar call-to-action.
 *
 * Sized to sit between LanguageSwitcher and ThemeToggle in the TopBar
 * right-utilities cluster. Hidden below `md:` to keep the mobile pill
 * uncluttered (mobile users already have direct waitlist exposure via
 * the hamburger menu).
 */
export default function CtaPill({
  className,
  labelKey = "getEarlyAccess",
  href = ROUTES.waitlist,
}: CtaPillProps) {
  const t = useTranslations("common");

  return (
    <Link
      href={href}
      className={cn(
        "hidden md:inline-flex items-center gap-1.5",
        "px-4 h-9 ml-1",
        "text-[13px] font-semibold tracking-tight",
        "bg-[var(--color-fg-primary)] text-[var(--color-bg-primary)]",
        "hover:bg-[var(--color-accent-primary)] hover:text-white",
        "transition-colors duration-200",
        className
      )}
      style={{ borderRadius: 2 }}
    >
      <span>{t(labelKey)}</span>
      <ArrowUpRight size={13} strokeWidth={2.25} aria-hidden="true" />
    </Link>
  );
}
