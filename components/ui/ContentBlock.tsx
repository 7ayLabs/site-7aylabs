"use client";

import { motion } from "framer-motion";
import {
  staggerContainer,
  fadeUpItem,
  defaultViewport,
} from "@/lib/constants/animations";
import { cn } from "@/lib/utils/cn";
import SectionLabel from "./SectionLabel";

interface ContentBlockProps {
  label?: string;
  title: string;
  children: React.ReactNode;
  illustration?: React.ReactNode;
  illustrationSide?: "left" | "right";
  cta?: React.ReactNode;
  className?: string;
}

export default function ContentBlock({
  label,
  title,
  children,
  illustration,
  illustrationSide = "right",
  cta,
  className,
}: ContentBlockProps) {
  const textContent = (
    <motion.div
      variants={fadeUpItem}
      className="flex flex-col justify-center"
    >
      {label && <SectionLabel className="mb-5">{label}</SectionLabel>}
      <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-fg tracking-tight mb-5">
        {title}
      </h2>
      <div className="text-fg-tertiary text-base leading-relaxed space-y-4">
        {children}
      </div>
      {cta && <div className="mt-8">{cta}</div>}
    </motion.div>
  );

  const illustrationContent = illustration ? (
    <motion.div
      variants={fadeUpItem}
      className="flex items-center justify-center rounded-2xl bg-bg-tertiary p-8 md:p-12"
    >
      {illustration}
    </motion.div>
  ) : null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center",
        className
      )}
    >
      {illustrationSide === "left" ? (
        <>
          {illustrationContent}
          {textContent}
        </>
      ) : (
        <>
          {textContent}
          {illustrationContent}
        </>
      )}
    </motion.div>
  );
}
