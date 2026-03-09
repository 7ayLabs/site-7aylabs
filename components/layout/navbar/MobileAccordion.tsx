"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { NAV_LINKS } from "@/lib/constants/routes";

/** Maps hardcoded English link labels to nav translation keys */
const LABEL_TO_KEY: Record<string, string> = {
  Technology: "technology",
  "Why Presence": "whyPresence",
  "Use Cases": "useCases",
  Devnet: "devnet",
  Validators: "validators",
};

interface MobileAccordionProps {
  openItem: string | null;
  setOpenItem: (item: string | null) => void;
}

export default function MobileAccordion({
  setOpenItem,
}: MobileAccordionProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <motion.nav
      initial={{ opacity: 0, x: 48 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 64 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120) setOpenItem(null);
      }}
      className="
        w-full
        flex flex-col
        gap-6
        pt-8
        pb-12
        text-[22px]
        font-medium
        text-fg
      "
    >
      {NAV_LINKS.map((item, i) => (
        <motion.div
          key={item.href}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 32 }}
          whileHover={{ scale: 1.05, x: 6 }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
            delay: i * 0.06,
          }}
        >
          <Link
            href={item.href}
            onClick={() => setOpenItem(null)}
            className={`
              relative inline-block
              tracking-wide hover:tracking-wider
              transition-all duration-300 ease-out
              ${pathname === item.href ? "text-fg" : "text-fg-secondary hover:text-fg hover:opacity-100"}
              after:absolute after:left-0 after:-bottom-1
              after:h-px after:bg-fg
              after:transition-all after:duration-300
              ${pathname === item.href ? "after:w-full" : "after:w-0 hover:after:w-full"}
            `}
          >
            {t(LABEL_TO_KEY[item.label] || item.label)}
          </Link>
        </motion.div>
      ))}
    </motion.nav>
  );
}
