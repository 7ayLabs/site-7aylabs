'use client';

/**
 * LanguageSwitch — a small menu that keeps the reader on the same page.
 *
 * Each language is written in its own language (a Spanish reader looks for
 * "Español", not "Spanish").
 */
import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Check, Globe } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

const NAMES: Record<Locale, string> = { en: 'English', es: 'Español', fr: 'Français' };

export function LanguageSwitch({ align = 'right' }: { align?: 'left' | 'right' }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('chrome');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('language')}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 items-center gap-1.5 rounded px-2.5 text-[14px] font-semibold text-[var(--fg-2)] transition-colors duration-200 hover:text-[var(--fg)]"
      >
        <Globe size={16} strokeWidth={1.75} aria-hidden />
        <span className="uppercase">{locale}</span>
      </button>
      {open ? (
        <div
          role="menu"
          className={`absolute top-[calc(100%+6px)] z-50 min-w-[168px] rounded-md border border-[var(--line-strong)] bg-[var(--surface)] p-1 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {routing.locales.map((l) => (
            <button
              key={l}
              type="button"
              role="menuitemradio"
              aria-checked={l === locale}
              lang={l}
              onClick={() => {
                setOpen(false);
                router.replace(pathname, { locale: l });
              }}
              className="flex min-h-11 w-full items-center justify-between gap-4 rounded px-3 text-left text-[15px] font-medium text-[var(--fg)] transition-colors duration-200 hover:text-[var(--accent)]"
            >
              {NAMES[l]}
              {l === locale ? <Check size={15} strokeWidth={2.25} aria-hidden /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
