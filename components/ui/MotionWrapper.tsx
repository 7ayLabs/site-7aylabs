"use client";

import { motion, type Variants } from "framer-motion";
import {
  fadeUpItem,
  defaultViewport,
  withDelay,
} from "@/lib/constants/animations";
import { cn } from "@/lib/utils/cn";
import type { AnimatedComponentProps } from "@/types/components";

interface MotionWrapperProps extends AnimatedComponentProps {
  variants?: Variants;
  as?: "div" | "span" | "article" | "section";
}

export default function MotionWrapper({
  children,
  className,
  variants: variantsProp = fadeUpItem,
  delay,
  as = "div",
}: MotionWrapperProps) {
  const resolvedVariants = delay
    ? withDelay(variantsProp, delay)
    : variantsProp;

  const Component = motion[as];

  return (
    <Component
      variants={resolvedVariants}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}
