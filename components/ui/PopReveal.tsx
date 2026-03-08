"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { EASING } from "@/lib/constants/animations";
import { cn } from "@/lib/utils/cn";
import type { AnimatedComponentProps } from "@/types/components";

/**
 * Scroll-triggered pop reveal animation.
 * Elements scale up and blur in when entering the viewport.
 * Fires once to avoid continuous IntersectionObserver churn.
 */
export default function PopReveal({
  children,
  delay = 0,
  className,
}: AnimatedComponentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true,
    amount: 0.35,
    margin: "0px 0px -10% 0px",
  });

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        scale: 0.82,
        y: 20,
        filter: "blur(12px)",
      }}
      animate={
        inView
          ? {
              opacity: 1,
              scale: 1,
              y: 0,
              filter: "blur(0px)",
            }
          : undefined
      }
      transition={{
        duration: 0.5,
        delay,
        ease: EASING.bounce,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
