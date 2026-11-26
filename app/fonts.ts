import { Geist, Geist_Mono, Sora } from 'next/font/google';

/**
 * Three faces, each with one job.
 *
 * Sora for headlines: a geometric display face drawn for a blockchain
 * project, so it carries the lab's field in its shapes. Geist for text: calm
 * and very legible at small sizes. Geist Mono for numbers and readouts, so
 * columns of figures line up.
 *
 * All three are downloaded at build time and served from our own origin.
 */
export const display = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const sans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
});
