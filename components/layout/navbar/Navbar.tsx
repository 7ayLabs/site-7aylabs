"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import TopBar from "./TopBar";
import MobileAccordion from "./MobileAccordion";

const SCROLL_THRESHOLD = 60;
const SCROLL_DELTA = 5;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [accordionItem, setAccordionItem] = useState<string | null>(null);

  const lastYRef = useRef(0);
  const ticking = useRef(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  /* ── Category hover with 150ms grace ── */
  const openCategory = useCallback((label: string) => {
    clearTimeout(closeTimeout.current);
    setActiveCategory(label);
  }, []);

  const closeDropdown = useCallback(() => {
    closeTimeout.current = setTimeout(() => setActiveCategory(null), 150);
  }, []);

  const closeDropdownImmediate = useCallback(() => {
    clearTimeout(closeTimeout.current);
    setActiveCategory(null);
  }, []);

  /* ── Scroll detection ── */
  const updateScroll = useCallback(() => {
    const y = window.scrollY;
    const delta = y - lastYRef.current;
    if (y < SCROLL_THRESHOLD) setScrolled(false);
    else if (Math.abs(delta) >= SCROLL_DELTA) setScrolled(delta > 0);
    lastYRef.current = y;
    ticking.current = false;
  }, []);

  useEffect(() => {
    lastYRef.current = window.scrollY;
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(updateScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [updateScroll]);

  useEffect(() => {
    if (scrolled) closeDropdownImmediate();
  }, [scrolled, closeDropdownImmediate]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        closeDropdownImmediate();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeDropdownImmediate]);

  return (
    <>
      <TopBar
        scrolled={scrolled}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        activeCategory={activeCategory}
        openCategory={openCategory}
        closeDropdown={closeDropdown}
        closeDropdownImmediate={closeDropdownImmediate}
      />

      <AnimatePresence>
        {mobileOpen && (
          <MobileAccordion
            openItem={accordionItem}
            setOpenItem={setAccordionItem}
            onClose={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
