'use client';

/**
 * Theme: light, dark, or follow the system.
 *
 * The choice lives in localStorage and is applied to <html data-theme> by a
 * tiny inline script before first paint (`themeBootScript`), so there is no
 * flash. With no stored choice the page follows the OS and keeps following
 * it when the OS switches.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';
type Resolved = 'light' | 'dark';

const KEY = '7aylabs-theme';
const ORDER: readonly Theme[] = ['light', 'dark', 'system'];

interface ThemeContextValue {
  theme: Theme;
  resolved: Resolved;
  setTheme: (t: Theme) => void;
  cycle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemTheme(): Resolved {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStored(): Theme {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch {
    return 'system';
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolved, setResolved] = useState<Resolved>('dark');

  // Adopt what the boot script already applied.
  useEffect(() => {
    const stored = readStored();
    setThemeState(stored);
    setResolved(stored === 'system' ? systemTheme() : stored);
  }, []);

  // Follow the OS while on `system`.
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const next = mq.matches ? 'dark' : 'light';
      setResolved(next);
      document.documentElement.dataset.theme = next;
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    const applied = next === 'system' ? systemTheme() : next;
    setThemeState(next);
    setResolved(applied);
    document.documentElement.dataset.theme = applied;
    try {
      if (next === 'system') window.localStorage.removeItem(KEY);
      else window.localStorage.setItem(KEY, next);
    } catch {
      /* private mode: the choice lasts for this page only */
    }
  }, []);

  const cycle = useCallback(() => {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length] ?? 'system';
    setTheme(next);
  }, [theme, setTheme]);

  const value = useMemo(() => ({ theme, resolved, setTheme, cycle }), [theme, resolved, setTheme, cycle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}

/** Runs before first paint. Kept tiny and dependency-free. */
export const themeBootScript = `(function(){try{var k='${KEY}',s=localStorage.getItem(k),d=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=(s==='light'||s==='dark')?s:(d?'dark':'light');}catch(e){document.documentElement.dataset.theme='dark';}})();`;
