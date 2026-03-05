"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants/routes";
import { EASING } from "@/lib/constants/animations";
import { cn } from "@/lib/utils/cn";

interface MobileAccordionProps {
  onClose: () => void;
}

export default function MobileAccordion({ onClose }: MobileAccordionProps) {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ opacity: 0, x: 48 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 64 }}
      transition={{ duration: 0.45, ease: EASING.smooth }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120) onClose();
      }}
      className="w-full flex flex-col gap-6 pt-8 pb-12 text-[22px] font-medium text-white/85"
      aria-label="Mobile navigation"
    >
      {NAV_LINKS.map((item, i) => {
        const isActive = pathname === item.href;

        return (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 32 }}
            whileHover={{ scale: 1.05, x: 6 }}
            transition={{
              duration: 0.4,
              ease: EASING.smooth,
              delay: i * 0.06,
            }}
          >
            <Link
              href={item.href}
              onClick={onClose}
              className={cn(
                "relative inline-block py-1 tracking-wide hover:tracking-wider",
                "transition-all duration-300 ease-out",
                isActive
                  ? "text-white"
                  : "text-white/70 hover:text-white focus-visible:text-white hover:opacity-100",
                // Underline indicator
                "after:absolute after:left-0 after:-bottom-1",
                "after:h-px after:bg-white",
                "after:transition-all after:duration-300",
                isActive ? "after:w-full" : "after:w-0 hover:after:w-full focus-visible:after:w-full"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          </motion.div>
        );
      })}
    </motion.nav>
  );
}
