"use client";

import { memo } from "react";
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
  /** Description paragraph(s) */
  description: string | string[];
  /** Optional illustration element below description */
  illustration?: React.ReactNode;
  /** Additional className for the section */
  className?: string;
}

function PageHeroComponent({
  label,
  title,
  description,
  illustration,
  className,
}: PageHeroProps) {
  const descriptions = Array.isArray(description) ? description : [description];

  return (
    <section
      aria-label={title}
      className={cn(
        "max-w-5xl mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-20 md:pb-24 text-center",
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
          className="block text-sm uppercase tracking-widest text-white/40 mb-6"
        >
          {label}
        </motion.span>

        <motion.h1
          variants={fadeUpItem}
          className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white"
        >
          {title}
        </motion.h1>

        {descriptions.map((desc, index) => (
          <motion.p
            key={index}
            variants={fadeUpItem}
            className="mt-6 mx-auto max-w-2xl text-white/60 text-base sm:text-lg leading-relaxed"
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
