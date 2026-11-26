'use client';

/**
 * ThemeToggle — one icon button cycling light → dark → system.
 *
 * Three stops, so a visitor who overrides the theme can go back to following
 * their device. The label announces what the next press will do.
 */
import { Moon, Sun, MonitorSmartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, cycle } = useTheme();
  const t = useTranslations('chrome.theme');

  const nextLabel = theme === 'light' ? t('toDark') : theme === 'dark' ? t('toSystem') : t('toLight');

  const iconClass = (active: boolean, rotateOut: string) =>
    `absolute transition-all duration-300 ease-out ${
      active ? 'rotate-0 scale-100 opacity-100' : `${rotateOut} scale-0 opacity-0`
    }`;

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={nextLabel}
      title={nextLabel}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded text-[var(--fg-2)] transition-colors duration-200 hover:text-[var(--fg)]"
    >
      <Sun size={17} strokeWidth={1.75} aria-hidden className={iconClass(theme === 'light', 'rotate-90')} />
      <Moon size={17} strokeWidth={1.75} aria-hidden className={iconClass(theme === 'dark', '-rotate-90')} />
      <MonitorSmartphone size={17} strokeWidth={1.75} aria-hidden className={iconClass(theme === 'system', 'rotate-45')} />
    </button>
  );
}
