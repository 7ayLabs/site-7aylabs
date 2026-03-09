"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Github } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/components/providers/ThemeProvider";
import { EXTERNAL_LINKS, FOOTER_LINK_GROUPS } from "@/lib/constants/routes";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { footerReveal, staggerContainer, fadeUpItem } from "@/lib/constants/animations";

const FOOTER_VIEWPORT = { once: true, margin: "-100px" } as const;

/** Maps hardcoded English group titles to nav translation keys */
const TITLE_TO_KEY: Record<string, string> = {
  Learn: "categories.learn",
  Build: "categories.build",
  Network: "categories.network",
  Community: "categories.community",
};

/** Maps hardcoded English group titles to footer aria-label keys */
const TITLE_TO_ARIA_KEY: Record<string, string> = {
  Learn: "aria.footerLearnLinks",
  Build: "aria.footerBuildLinks",
  Network: "aria.footerNetworkLinks",
  Community: "aria.footerCommunityLinks",
};

/** Maps hardcoded English link labels to nav translation keys */
const LABEL_TO_KEY: Record<string, string> = {
  Technology: "technology",
  "Why Presence": "whyPresence",
  "Use Cases": "useCases",
  Devnet: "devnet",
  Validators: "validators",
  Ecosystem: "ecosystem",
  Glossary: "glossary",
  Updates: "updates",
  Waitlist: "waitlist",
  "Join Waitlist": "footer.joinWaitlist",
  Newsletter: "newsletter",
  GitHub: "github",
  "X (Twitter)": "xTwitter",
};

export default function Footer() {
  const { theme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations("nav");
  const tc = useTranslations("common");
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
            <Link href="/" aria-label={t("aria.homeLink")}>
              <Image
                src={logoSrc}
                alt={t("logoAltFooter")}
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
                aria-label={t("aria.followOnX")}
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
                aria-label={t("aria.githubLink")}
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
              aria-label={t(TITLE_TO_ARIA_KEY[group.title] || group.title)}
              {...(!shouldReduceMotion && { variants: fadeUpItem })}
            >
              <h3 className="text-fg text-xs font-semibold uppercase tracking-widest mb-4 font-display">
                {t(TITLE_TO_KEY[group.title] || group.title)}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => {
                  const isExternal = "external" in link && link.external;
                  const translatedLabel = t(LABEL_TO_KEY[link.label] || link.label);
                  return (
                    <li key={link.label}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-fg-muted text-sm hover:text-[var(--color-accent-primary)] transition-colors"
                        >
                          {translatedLabel}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-fg-muted text-sm hover:text-[var(--color-accent-primary)] transition-colors"
                        >
                          {translatedLabel}
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
            {tc("copyright", { year: new Date().getFullYear() })}
          </p>
          <ThemeToggle />
        </div>
      </div>
    </MotionFooter>
  );
}
