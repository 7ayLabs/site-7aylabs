"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import {
  staggerContainer,
  fadeUpItem,
  defaultViewport,
} from "@/lib/constants/animations";
import { cn } from "@/lib/utils/cn";

interface PageHeroProps {
  /** Small label above the title (e.g., "WHO WE ARE") */
  label: string;
  /** Main page title */
  title: string;
  /** Words in the title that should get gradient-text-accent treatment */
  accentWords?: string[];
  /** Description paragraph(s) */
  description: string | string[];
  /** Optional illustration element below description */
  illustration?: React.ReactNode;
  /** Additional className for the section */
  className?: string;
}

function renderTitleWithAccent(title: string, accentWords?: string[]) {
  if (!accentWords || accentWords.length === 0) return title;

  const pattern = new RegExp(`(${accentWords.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|")})`, "gi");
  const parts = title.split(pattern);

  return parts.map((part, i) => {
    const isAccent = accentWords.some(w => w.toLowerCase() === part.toLowerCase());
    return isAccent ? (
      <span key={i} className="gradient-text-accent">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}

function PageHeroComponent({
  label,
  title,
  accentWords,
  description,
  illustration,
  className,
}: PageHeroProps) {
  const descriptions = Array.isArray(description) ? description : [description];
  const renderedTitle = useMemo(() => renderTitleWithAccent(title, accentWords), [title, accentWords]);

  return (
    <section
      aria-label={title}
      className={cn(
        "max-w-6xl mx-auto px-6 md:px-12 pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 md:pb-24 text-center",
        className
      )}
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <motion.span
          variants={fadeUpItem}
          className="block text-sm uppercase tracking-widest text-fg-muted mb-6"
        >
          {label}
        </motion.span>

        <motion.h1
          variants={fadeUpItem}
          className="font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight text-fg"
        >
          {renderedTitle}
        </motion.h1>

        {descriptions.map((desc, index) => (
          <motion.p
            key={index}
            variants={fadeUpItem}
            className="mt-6 mx-auto max-w-2xl text-fg-secondary text-base sm:text-lg leading-relaxed"
          >
            {desc}
          </motion.p>
        ))}

        {illustration && (
          <motion.div variants={fadeUpItem} className="mt-10">
            {illustration}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

const PageHero = memo(PageHeroComponent);
PageHero.displayName = "PageHero";

export default PageHero;
