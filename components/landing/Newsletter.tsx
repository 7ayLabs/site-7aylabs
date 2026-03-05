"use client";

import { Mail } from "lucide-react";
import { motion } from "framer-motion";
import {
  staggerContainer,
  fadeUpItem,
  defaultViewport,
} from "@/lib/constants/animations";

export default function Newsletter() {
  return (
    <section
      aria-labelledby="newsletter-title"
      className="w-full px-6 py-24 md:py-32 flex items-center justify-center text-center relative"
    >
      <motion.div
        className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
      >
        <motion.h2
          id="newsletter-title"
          variants={fadeUpItem}
          className="text-3xl md:text-4xl font-semibold text-white tracking-tight font-serif leading-tight"
        >
          Stay Updated
        </motion.h2>

        <motion.p
          variants={fadeUpItem}
          className="font-normal text-white/65 text-lg md:text-xl max-w-xl leading-relaxed"
        >
          Product insights, launches, and real-world presence infrastructure.
        </motion.p>

        <motion.a
          variants={fadeUpItem}
          href="/newsletter"
          aria-label="Read the 7ayLabs newsletter"
          className="mt-6 inline-flex items-center gap-3 px-8 py-3 min-h-[44px] rounded-full bg-white text-black font-medium text-base md:text-lg transition-colors duration-normal hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
        >
          <Mail size={16} aria-hidden="true" />
          Read the Newsletter
        </motion.a>
      </motion.div>
    </section>
  );
}
