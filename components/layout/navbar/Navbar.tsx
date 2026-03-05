"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopBar from "./TopBar";
import MobileAccordion from "./MobileAccordion";
import AnnouncementBanner from "./AnnouncementBanner";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);

  // Lock body scroll when mobile menu is open
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

  const handleDismissBanner = useCallback(() => {
    setBannerVisible(false);
  }, []);

  return (
    <>
      <AnnouncementBanner
        visible={bannerVisible}
        onDismiss={handleDismissBanner}
      />
      <TopBar menuOpen={menuOpen} onToggleMenu={handleToggleMenu} />

      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              className="fixed inset-0 z-fixed bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseMenu}
              aria-hidden="true"
            />

            {/* Slide-in mobile panel */}
            <motion.aside
              className="fixed top-12 md:top-16 right-0 bottom-0 z-modal-backdrop w-[53%] sm:w-[420px] bg-dark border-l border-white/10 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
              role="dialog"
              aria-label="Mobile navigation menu"
            >
              <div className="flex-1 overflow-y-auto px-6 py-6 md:hidden">
                <MobileAccordion onClose={handleCloseMenu} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
