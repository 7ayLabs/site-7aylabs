"use client";

import { memo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";

const PHRASES = [
  "Proof of Presence",
  "Human Verified",
  "Presence Matters",
] as const;

const INTERVAL_MS = 5200;

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
      className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden"
    >
      {/* Subtle radial overlays for depth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none
          bg-[radial-gradient(800px_400px_at_50%_-20%,rgba(255,255,255,0.04),transparent_60%),
              radial-gradient(600px_300px_at_80%_20%,rgba(255,255,255,0.025),transparent_65%),
              radial-gradient(600px_300px_at_20%_30%,rgba(255,255,255,0.02),transparent_70%)]"
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-screen-xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Image
            src="/7aylabs_white_logo.svg"
            alt="7ayLabs"
            width={300}
            height={96}
            priority
            className="scale-[0.85] sm:scale-[0.92] md:scale-[0.96]"
          />
        </motion.div>

        {/* Rotating tagline */}
        <div className="mt-1 sm:mt-3 h-8 sm:h-9 flex items-center justify-center overflow-hidden relative">
          <AnimatePresence mode="sync" initial={false}>
            <motion.p
              key={PHRASES[index]}
              className="absolute text-[0.95rem] sm:text-xl text-white/70 tracking-wide text-center"
              style={{ willChange: "opacity, filter" }}
              initial={{ opacity: 0.001, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              transition={{
                opacity: { duration: 2.2, ease: "easeInOut" },
                filter: { duration: 2.6, ease: "easeInOut" },
              }}
            >
              {PHRASES[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* CTA buttons */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        >
          <Link
            href={ROUTES.waitlist}
            className="inline-flex items-center justify-center rounded-full px-8 py-3 bg-white text-black font-medium text-sm hover:bg-white/90 transition-colors duration-normal"
          >
            Join the Waitlist
          </Link>
          <Link
            href={ROUTES.tech}
            className="inline-flex items-center justify-center rounded-full px-8 py-3 border border-white/20 text-white/80 font-medium text-sm hover:border-white/40 hover:text-white transition-colors duration-normal"
          >
            Explore the Tech
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

const Hero = memo(HeroComponent);
Hero.displayName = "Hero";

export default Hero;
