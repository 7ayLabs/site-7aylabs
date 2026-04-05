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
  id?: string;
}

export default function MotionWrapper({
  children,
  className,
  variants: variantsProp = fadeUpItem,
  delay,
  as = "div",
  id,
}: MotionWrapperProps) {
  const resolvedVariants = delay
    ? withDelay(variantsProp, delay)
    : variantsProp;

  const Component = motion[as];

  return (
    <Component
      id={id}
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
