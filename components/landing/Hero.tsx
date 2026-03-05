"use client";

import { memo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import Badge from "@/components/ui/Badge";

const PHRASES = [
  "Proof of Presence",
  "Human Verified",
  "Presence Matters",
] as const;

const INTERVAL_MS = 4800;

function HeroComponent() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % PHRASES.length);
    }, INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      aria-label="Hero"
      className="relative w-full min-h-[90svh] flex items-center overflow-hidden"
    >
      {/* Background decorative elements */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.08),transparent_60%)]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(0,255,198,0.04),transparent_60%)]" />
      </div>

      <div className="relative z-10 w-full section-container py-20 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text column */}
          <div className="flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Badge variant="accent" className="mb-8">
                Proof of Presence Protocol
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="heading-xl text-white"
            >
              The blockchain
              <br />
              that knows{" "}
              <span className="gradient-text">
                you&apos;re here
              </span>
            </motion.h1>

            {/* Rotating tagline */}
            <div
              className="mt-6 h-8 flex items-center relative overflow-hidden"
              aria-live="polite"
              aria-atomic="true"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={PHRASES[index]}
                  className="absolute text-base md:text-lg text-accent/80 font-medium tracking-wide"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  {PHRASES[index]}
                </motion.span>
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
              className="mt-6 body-lg max-w-lg"
            >
              7aychain is a Layer 1 where validators triangulate physical
              presence through network latency. No GPS, no oracles, no
              special hardware. Just reality, verified on-chain.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            >
              <Link
                href={ROUTES.waitlist}
                className="inline-flex items-center justify-center rounded-full px-8 py-3.5 bg-accent text-black font-semibold text-sm hover:bg-accent-secondary transition-colors duration-normal"
              >
                Join the Waitlist
              </Link>
              <Link
                href={ROUTES.tech}
                className="inline-flex items-center justify-center rounded-full px-8 py-3.5 border border-white/15 text-white/70 font-medium text-sm hover:border-white/30 hover:text-white transition-all duration-normal group"
              >
                Explore the Tech
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-2 transition-transform duration-normal group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <path d="M1 7h12M8 2l5 5-5 5" />
                </svg>
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
              className="mt-16 flex items-center gap-8 md:gap-12"
            >
              <div>
                <div className="text-2xl font-bold text-white">v0.8</div>
                <div className="text-xs text-white/40 mt-1">Protocol version</div>
              </div>
              <div className="w-px h-10 bg-white/10" aria-hidden="true" />
              <div>
                <div className="text-2xl font-bold text-white">6</div>
                <div className="text-xs text-white/40 mt-1">Devnet validators</div>
              </div>
              <div className="w-px h-10 bg-white/10" aria-hidden="true" />
              <div>
                <div className="text-2xl font-bold text-white">ZK</div>
                <div className="text-xs text-white/40 mt-1">Proof verified</div>
              </div>
            </motion.div>
          </div>

          {/* Illustration column */}
          <motion.div
            className="hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            <div className="relative">
              {/* Glow behind illustration */}
              <div
                aria-hidden="true"
                className="absolute inset-0 scale-125 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.12),transparent_60%)] blur-3xl"
              />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Image
                  src="/7ay_app.svg"
                  alt="7aychain application illustration"
                  width={440}
                  height={440}
                  priority
                  className="relative select-none drop-shadow-2xl"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const Hero = memo(HeroComponent);
Hero.displayName = "Hero";

export default Hero;
