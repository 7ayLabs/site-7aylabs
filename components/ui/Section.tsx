"use client";

import { motion } from "framer-motion";
import {
  staggerContainer,
  fadeUpItem,
  defaultViewport,
} from "@/lib/constants/animations";
import { cn } from "@/lib/utils/cn";
import type { SectionProps } from "@/types/components";

type MaxWidth =
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl";
type SectionBg = "default" | "secondary" | "tertiary" | "glass" | "mesh";

interface Props extends SectionProps {
  label?: string;
  title?: string;
  subtitle?: string;
  centered?: boolean;
  maxWidth?: MaxWidth;
  background?: SectionBg;
  divider?: boolean;
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

const bgStyles: Record<SectionBg, string> = {
  default: "",
  secondary: "bg-bg-secondary",
  tertiary: "bg-bg-tertiary",
  glass: "glass-card mx-4 md:mx-8 lg:mx-12 my-4",
  mesh: "gradient-mesh",
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
  maxWidth = "6xl",
  background = "default",
  divider = false,
}: Props) {
  return (
    <Tag
      id={id}
      aria-label={title || label}
      className={cn(
        bgStyles[background],
        divider && "border-t border-[var(--color-border-primary)]"
      )}
    >
      <div
        className={cn(
          "mx-auto px-6 md:px-12",
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
              className="block text-sm uppercase tracking-widest text-fg-muted mb-6"
            >
              {label}
            </motion.span>
          )}

          {title && (
            <motion.h2
              variants={fadeUpItem}
              className="font-display font-bold text-2xl md:text-3xl text-fg mb-6"
            >
              {title}
            </motion.h2>
          )}

          {subtitle && (
            <motion.p
              variants={fadeUpItem}
              className={cn(
                "text-fg-secondary text-base sm:text-lg leading-relaxed mb-6",
                centered && "mx-auto max-w-2xl"
              )}
            >
              {subtitle}
            </motion.p>
          )}

          {children}
        </motion.div>
      </div>
    </Tag>
  );
}
