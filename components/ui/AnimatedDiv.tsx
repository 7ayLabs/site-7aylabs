"use client";

import { motion, type Variants } from "framer-motion";
import { fadeUpItem, defaultViewport } from "@/lib/constants/animations";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface AnimatedDivProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  /** HTML element to render */
  as?: "div" | "article" | "aside" | "nav" | "ul";
  /** When true, animates on its own scroll trigger instead of inheriting from parent */
  standalone?: boolean;
}

/**
 * A minimal client-side motion wrapper for use inside server-component pages.
 *
 * By default, inherits animation state from a parent MotionWrapper (stagger).
 * Set standalone={true} to trigger animation independently on scroll.
 */
export default function AnimatedDiv({
  children,
  className,
  variants = fadeUpItem,
  as = "div",
  standalone = false,
}: AnimatedDivProps) {
  const Component = motion[as];

  return (
    <Component
      variants={variants}
      {...(standalone && {
        initial: "hidden",
        whileInView: "visible",
        viewport: defaultViewport,
      })}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}
