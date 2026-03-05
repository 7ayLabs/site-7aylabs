import Link from "next/link";
import { FOOTER_LINKS, EXTERNAL_LINKS } from "@/lib/constants/routes";

/**
 * XIcon - inline SVG for the X/Twitter logo to avoid
 * pulling in an external icon dependency for a single icon.
 */
function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2H21.552L14.34 10.471L22.824 22H16.172L10.96 14.981L4.964 22H1.656L9.316 12.984L1.176 2H7.996L12.708 8.327L18.244 2ZM17.092 20H18.924L7.004 3.937H5.04L17.092 20Z" />
    </svg>
  );
}

function GitHubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-dark border-t border-white/10">
      <div className="max-w-screen-xl mx-auto px-6 py-6 flex flex-col items-center text-center md:flex-row md:items-center md:justify-between md:text-left gap-4 text-xs text-white/50">
        {/* Copyright */}
        <div className="text-[11px] text-white/40 md:text-left">
          <span>&copy; 7ayLabs {new Date().getFullYear()}</span>
        </div>

        {/* Links and social */}
        <nav aria-label="Footer navigation" className="flex items-center justify-center gap-6 text-white/50 md:justify-end">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-white focus-visible:text-white transition-colors duration-fast"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href={EXTERNAL_LINKS.twitter}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow 7ayLabs on X"
            className="hover:text-white focus-visible:text-white transition-colors duration-fast"
          >
            <XIcon />
          </Link>

          <Link
            href={EXTERNAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="7ayLabs on GitHub"
            className="hover:text-white focus-visible:text-white transition-colors duration-fast"
          >
            <GitHubIcon />
          </Link>
        </nav>
      </div>
    </footer>
  );
}
