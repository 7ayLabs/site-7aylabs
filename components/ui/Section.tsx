"use client";

import { motion } from "framer-motion";
import {
  staggerContainer,
  fadeUpItem,
  defaultViewport,
} from "@/lib/constants/animations";
import { cn } from "@/lib/utils/cn";
import type { SectionProps } from "@/types/components";

type MaxWidth = "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl";

interface Props extends SectionProps {
  label?: string;
  title?: string;
  subtitle?: string;
  centered?: boolean;
  maxWidth?: MaxWidth;
}

const maxWidthStyles: Record<MaxWidth, string> = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
} as const;

export default function Section({
  children,
  className,
  id,
  as: Tag = "section",
  label,
  title,
  subtitle,
  centered = false,
  maxWidth = "7xl",
}: Props) {
  return (
    <Tag
      id={id}
      aria-label={title || label}
      className={cn(
        "mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-28",
        maxWidthStyles[maxWidth],
        centered && "text-center",
        className
      )}
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        {label && (
          <motion.span
            variants={fadeUpItem}
            className="label-sm block mb-4"
          >
            {label}
          </motion.span>
        )}

        {title && (
          <motion.h2
            variants={fadeUpItem}
            className="heading-md text-white mb-4"
          >
            {title}
          </motion.h2>
        )}

        {subtitle && (
          <motion.p
            variants={fadeUpItem}
            className={cn(
              "body-lg mb-10",
              centered && "mx-auto max-w-2xl"
            )}
          >
            {subtitle}
          </motion.p>
        )}

        {children}
      </motion.div>
    </Tag>
  );
}
