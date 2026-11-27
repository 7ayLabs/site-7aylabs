import type { ReactNode } from 'react';
import './globals.css';

/** The document itself (<html>, <body>) is rendered by `app/[locale]/layout.tsx`. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
