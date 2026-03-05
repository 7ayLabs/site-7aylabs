"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopBar from "./TopBar";
import MobileAccordion from "./MobileAccordion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleToggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <>
      <TopBar menuOpen={menuOpen} onToggleMenu={handleToggleMenu} />

      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-fixed bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleCloseMenu}
              aria-hidden="true"
            />

            {/* Slide-in panel */}
            <motion.aside
              className="fixed top-0 right-0 bottom-0 z-modal w-full sm:w-[380px] bg-dark/95 backdrop-blur-2xl border-l border-white/[0.06] flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              role="dialog"
              aria-label="Mobile navigation menu"
            >
              {/* Close button */}
              <div className="flex items-center justify-end px-6 h-16">
                <button
                  onClick={handleCloseMenu}
                  className="flex items-center justify-center w-10 h-10 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors duration-fast"
                  aria-label="Close menu"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M4 4l10 10M14 4L4 14" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-8 pb-8">
                <MobileAccordion onClose={handleCloseMenu} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
