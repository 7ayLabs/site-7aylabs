import localFont from 'next/font/local';
import { Plus_Jakarta_Sans } from 'next/font/google';

/**
 * The same three faces as the Vizzor landing, so the company and the product
 * read as one family.
 *
 * Body: Plus Jakarta Sans, downloaded at build time and served from our own
 * origin (no request to a third party at runtime).
 */
export const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

/** Numbers and readouts: fixed advance widths so columns line up. */
export const mono = localFont({
  src: '../public/fonts/JetBrainsMono-Variable.woff2',
  variable: '--font-mono',
  display: 'swap',
  weight: '100 800',
  preload: false,
});

/** Headlines only: Unbounded, a wide geometric display (OFL 1.1, self-hosted). */
export const display = localFont({
  src: '../public/fonts/Unbounded-Variable.woff2',
  variable: '--font-display',
  display: 'swap',
  weight: '200 900',
});
