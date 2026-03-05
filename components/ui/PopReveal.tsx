"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { EASING } from "@/lib/constants/animations";
import { cn } from "@/lib/utils/cn";
import type { AnimatedComponentProps } from "@/types/components";

/**
 * Scroll-triggered pop reveal animation.
 * Elements scale up and blur in when entering the viewport,
 * then scale down and blur out when leaving.
 */
export default function PopReveal({
  children,
  delay = 0,
  className,
}: AnimatedComponentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    amount: 0.35,
    margin: "0px 0px -10% 0px",
  });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("show");
    } else {
      controls.start("exit");
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: {
          opacity: 0,
          scale: 0.82,
          y: 18,
          filter: "blur(10px)",
        },
        show: {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.34,
            delay,
            ease: EASING.bounce,
          },
        },
        exit: {
          opacity: 0,
          scale: 0.9,
          y: -18,
          filter: "blur(6px)",
          transition: {
            duration: 0.28,
            ease: [0.4, 0.0, 0.2, 1],
          },
        },
      }}
      initial="hidden"
      animate={controls}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
