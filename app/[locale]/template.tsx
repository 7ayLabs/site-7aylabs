import type { ReactNode } from 'react';

/** Re-mounted on every navigation, so each page plays its entrance. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
