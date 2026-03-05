"use client";

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
      className="relative w-full section-padding overflow-hidden"
    >
      {/* Accent gradient background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_800px_400px_at_50%_50%,rgba(20,184,166,0.05),transparent_70%)]"
      />

      <div className="section-container">
        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            className="flex flex-col items-center text-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            <motion.span
              variants={fadeUpItem}
              className="label-sm block mb-4"
            >
              Stay connected
            </motion.span>

            <motion.h2
              id="newsletter-title"
              variants={fadeUpItem}
              className="heading-lg text-white mb-4"
            >
              Stay Updated
            </motion.h2>

            <motion.p
              variants={fadeUpItem}
              className="body-lg max-w-xl mb-10"
            >
              Product insights, protocol progress, and real-world presence
              infrastructure updates. Signal, not noise.
            </motion.p>

            <motion.a
              variants={fadeUpItem}
              href="/newsletter"
              aria-label="Read the 7ayLabs newsletter"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-accent text-black font-semibold text-sm transition-colors duration-normal hover:bg-accent-secondary"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 4L12 13 2 4" />
              </svg>
              Read the Newsletter
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
