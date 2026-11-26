import Link from 'next/link';
import { display, sans } from './fonts';

/** Reached only for paths outside every locale; the locale 404 handles the rest. */
export default function RootNotFound() {
  return (
    <html lang="en" data-theme="dark" className={`${sans.variable} ${display.variable}`}>
      <body>
        <main className="mx-auto flex min-h-dvh max-w-[1320px] flex-col items-start justify-center px-4 sm:px-6">
          <p className="mono text-[14px] font-semibold text-[var(--fg-3)]">404</p>
          <h1 className="l-display l-hero-title mt-5 text-[var(--fg)]">Page not found.</h1>
          <Link href="/" className="l-btn l-btn-primary mt-10">
            Back to 7ayLabs
          </Link>
        </main>
      </body>
    </html>
  );
}
