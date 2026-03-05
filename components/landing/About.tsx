"use client";

import { motion } from "framer-motion";
import {
  staggerContainer,
  fadeUpItem,
  defaultViewport,
} from "@/lib/constants/animations";

const VALUE_PROPS = [
  {
    title: "People, not bots",
    description:
      "Real users only. Presence replaces fake traffic with real participation.",
  },
  {
    title: "Real growth",
    description:
      "Engagement tied to presence. Value is earned by showing up.",
  },
  {
    title: "Verified presence",
    description:
      "Proof that happens in the real world. Designed to be secure and hard to fake.",
  },
] as const;

export default function About() {
  return (
    <section aria-label="About 7ayLabs" className="relative w-full">
      <div className="w-full px-8 md:px-20 lg:px-32 py-14 md:py-16">
        <div className="max-w-[960px] mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 text-white text-center place-items-center"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
          >
            {VALUE_PROPS.map((item) => (
              <motion.div
                key={item.title}
                className="flex flex-col items-center justify-center text-center"
                variants={fadeUpItem}
              >
                <h3 className="font-serif text-2xl md:text-3xl font-semibold mb-1 tracking-tight whitespace-nowrap min-h-[2.5rem] md:min-h-[3rem]">
                  {item.title}
                </h3>
                <p className="text-base md:text-lg text-white/60 leading-tight max-w-[20rem] min-h-[3.75rem] md:min-h-[4.75rem]">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
