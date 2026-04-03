"use client";

import { motion, type Variants } from "framer-motion";
import { fadeUpItem } from "@/lib/constants/animations";
import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

interface AnimatedDivProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  /** HTML element to render */
  as?: "div" | "article" | "aside" | "nav" | "ul";
}

/**
 * A minimal client-side motion wrapper for use inside server-component pages.
 * Inherits stagger timing from parent Section or staggerContainer.
 *
 * Usage in server pages:
 *   <Section title="...">
 *     <AnimatedDiv className="grid grid-cols-3 gap-6">
 *       ...static children...
 *     </AnimatedDiv>
 *   </Section>
 */
export default function AnimatedDiv({
  children,
  className,
  variants = fadeUpItem,
  as = "div",
}: AnimatedDivProps) {
  const Component = motion[as];

  return (
    <Component variants={variants} className={cn(className)}>
      {children}
    </Component>
  );
}
