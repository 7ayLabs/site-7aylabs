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
  label: string;
  title: string;
  description: string | string[];
  className?: string;
}

function PageHeroComponent({
  label,
  title,
  description,
  className,
}: PageHeroProps) {
  const paragraphs = Array.isArray(description) ? description : [description];

  return (
    <section
      aria-label={title}
      className={cn(
        "relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-16 md:pb-20",
        className
      )}
    >
      {/* Decorative gradient blob */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.06),transparent_70%)]"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="relative max-w-3xl"
      >
        <motion.span
          variants={fadeUpItem}
          className="label-sm inline-block mb-6"
        >
          {label}
        </motion.span>

        <motion.h1
          variants={fadeUpItem}
          className="heading-xl text-white"
        >
          {title}
        </motion.h1>

        <motion.div
          variants={fadeUpItem}
          className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-accent to-accent-secondary"
          aria-hidden="true"
        />

        {paragraphs.map((text, i) => (
          <motion.p
            key={i}
            variants={fadeUpItem}
            className="mt-6 max-w-2xl body-lg"
          >
            {text}
          </motion.p>
        ))}
      </motion.div>
    </section>
  );
}

const PageHero = memo(PageHeroComponent);
PageHero.displayName = "PageHero";

export default PageHero;
