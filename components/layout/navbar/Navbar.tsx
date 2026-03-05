"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopBar from "./TopBar";
import MobileAccordion from "./MobileAccordion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <TopBar open={open} setOpen={setOpen} />

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              className="fixed inset-0 z-[30] bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            {/* Slide-in mobile panel */}
            <motion.aside
              className="
                fixed top-12 md:top-16 right-0 bottom-0 z-[40]
                w-[53%] sm:w-[420px]
                bg-[#060606]
                border-l border-white/10
                flex flex-col
              "
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
            >
              <div className="flex-1 overflow-y-auto px-6 py-6 md:hidden">
                <MobileAccordion
                  openItem={hovered}
                  setOpenItem={setHovered}
                />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
