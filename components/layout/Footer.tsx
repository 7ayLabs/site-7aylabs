import Link from "next/link";
import Image from "next/image";
import { FOOTER_LINK_GROUPS, EXTERNAL_LINKS } from "@/lib/constants/routes";

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2H21.552L14.34 10.471L22.824 22H16.172L10.96 14.981L4.964 22H1.656L9.316 12.984L1.176 2H7.996L12.708 8.327L18.244 2ZM17.092 20H18.924L7.004 3.937H5.04L17.092 20Z" />
    </svg>
  );
}

function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.06]">
      <div className="section-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-5" aria-label="7ayLabs home">
              <Image
                src="/7aylabs_white_logo.svg"
                alt="7ayLabs"
                width={100}
                height={24}
                className="select-none opacity-90"
              />
            </Link>
            <p className="text-sm text-white/45 leading-relaxed max-w-xs mb-6">
              Building 7aychain, a Layer 1 blockchain with on-chain Proof of
              Presence. Validators triangulate physical presence through
              network latency.
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={EXTERNAL_LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow 7ayLabs on X"
                className="flex items-center justify-center w-9 h-9 rounded-lg text-white/35 hover:text-white hover:bg-white/[0.06] transition-colors duration-fast"
              >
                <XIcon size={16} />
              </Link>
              <Link
                href={EXTERNAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="7ayLabs on GitHub"
                className="flex items-center justify-center w-9 h-9 rounded-lg text-white/35 hover:text-white hover:bg-white/[0.06] transition-colors duration-fast"
              >
                <GitHubIcon size={16} />
              </Link>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINK_GROUPS.map((group) => (
            <nav
              key={group.title}
              className="lg:col-span-2 lg:col-start-auto"
              aria-label={`${group.title} links`}
            >
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">
                {group.title}
              </h3>
              <ul className="space-y-3">
                {group.links.map((link) => {
                  const isExternal = "external" in link && link.external;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        {...(isExternal
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="text-sm text-white/40 hover:text-white transition-colors duration-fast"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/25">
          <span>&copy; {new Date().getFullYear()} 7ayLabs. All rights reserved.</span>
          <span>Built on Substrate. Powered by $7AY.</span>
        </div>
      </div>
    </footer>
  );
}
