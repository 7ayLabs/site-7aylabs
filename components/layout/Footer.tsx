"use client";

import Link from "next/link";
import { Github } from "lucide-react";
import { ROUTES, EXTERNAL_LINKS } from "@/lib/constants/routes";
import ThemeToggle from "@/components/ui/ThemeToggle";

/** Simple footer links matching the old repo layout */
const FOOTER_LINKS = [
  { href: ROUTES.about, label: "About" },
  { href: ROUTES.roadmap, label: "Roadmap" },
] as const;

export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-white/10 pointer-events-auto">
      <div className="max-w-screen-xl mx-auto px-6 py-6 flex flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-left gap-4 text-xs text-white/50">

        {/* Copyright */}
        <div className="text-[11px] text-white/40 md:text-left">
          &copy; 7ayLabs {new Date().getFullYear()}
        </div>

        {/* Links + Social icons + ThemeToggle */}
        <div className="flex items-center justify-center gap-6 text-white/50 pointer-events-auto md:justify-end">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-white transition"
            >
              {link.label}
            </Link>
          ))}

          {/* X (Twitter) icon */}
          <Link
            href={EXTERNAL_LINKS.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="hover:text-white transition"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.244 2H21.552L14.34 10.471L22.824 22H16.172L10.96 14.981L4.964 22H1.656L9.316 12.984L1.176 2H7.996L12.708 8.327L18.244 2ZM17.092 20H18.924L7.004 3.937H5.04L17.092 20Z" />
            </svg>
          </Link>

          {/* GitHub icon */}
          <Link
            href={EXTERNAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-white transition"
          >
            <Github size={14} />
          </Link>

          {/* Theme toggle (not in old repo, added for dual-theme support) */}
          <ThemeToggle />
        </div>

      </div>
    </footer>
  );
}
