import { Archivo } from 'next/font/google';

/**
 * One family for the whole site: Archivo, loaded with its width axis.
 *
 * Headlines use it at its narrowest and heaviest, text at normal width. The
 * file is downloaded at build time and served from our own origin, so no
 * request goes to a third party at runtime.
 */
export const sans = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-sans',
  display: 'swap',
});
