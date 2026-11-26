import Link from 'next/link';
import { sans } from './fonts';

/** Reached only for paths outside every locale; the locale 404 handles the rest. */
export default function RootNotFound() {
  return (
    <html lang="en" data-theme="dark" className={sans.variable}>
      <body>
        <main className="mx-auto flex min-h-dvh max-w-[1400px] flex-col items-start justify-center px-5 sm:px-8">
                    <h1 className="t-display t-hero text-[var(--fg)]">Page not found.</h1>
          <Link href="/" className="btn btn-ink mt-10">
            Back to 7ayLabs
          </Link>
        </main>
      </body>
    </html>
  );
}
