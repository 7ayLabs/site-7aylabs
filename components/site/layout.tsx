import type { ReactNode } from 'react';
import { PageIndex, type IndexItem } from './page-index';

/** The site's measure: one max width and gutter everywhere. */
export const WRAP = 'mx-auto max-w-[1360px] px-5 sm:px-8';

/** A page body with its section strip floating above the blocks. */
export function Indexed({ items, label, children }: { items: IndexItem[]; label: string; children: ReactNode }) {
  return (
    <div className={WRAP}>
      <PageIndex items={items} label={label} />
      {children}
    </div>
  );
}

/**
 * One section of a page. The head is split: the headline on the left, the
 * lede set against it on the right, and a line of light that draws itself
 * across when the section arrives.
 */
export function Block({
  id,
  title,
  lede,
  children,
}: {
  id: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-40 py-16 sm:py-24">
      <div data-reveal className="grid items-end gap-x-16 gap-y-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <h2 id={`${id}-title`} className="t-display t-title max-w-[18ch] text-[var(--fg)]">
          {title}
        </h2>
        {lede ? <p className="t-lede lg:pb-2">{lede}</p> : null}
        <span aria-hidden className="rule-draw col-span-full mt-3 block h-px bg-gradient-to-r from-[var(--accent-fill)] via-[var(--accent-soft)] to-transparent" />
      </div>
      {children ? <div className="mt-10 sm:mt-12">{children}</div> : null}
    </section>
  );
}

/** The head of an inner page. */
export function PageHead({ title, lede, children }: { title: ReactNode; lede: ReactNode; children?: ReactNode }) {
  return (
    <section className={`${WRAP} pb-12 pt-12 sm:pb-16 sm:pt-20`}>
      <h1 className="t-display type-settle max-w-[17ch] text-[clamp(2.6rem,1rem+5vw,6rem)] leading-[0.98] text-[var(--fg)]">{title}</h1>
      <p data-reveal className="t-lede mt-8">
        {lede}
      </p>
      {children}
    </section>
  );
}

/**
 * Tiles — statements as glass panes laid out as a mosaic: wide and narrow
 * panes alternate so the grid does not read as a row of identical cards.
 */
export function Tiles({ items }: { items: { title: string; line: string }[] }) {
  const span = (i: number) => (i % 4 === 0 || i % 4 === 3 ? 'lg:col-span-7' : 'lg:col-span-5');
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12" data-stagger>
      {items.map((it, i) => (
        <li key={it.title} data-reveal className={`glass glass-live flex min-h-[11.5rem] flex-col justify-end rounded-[24px] p-7 ${span(i)}`}>
          <h3 className="t-head text-[var(--fg)]">{it.title}</h3>
          <p className="mt-2.5 max-w-[48ch] text-[16.5px] leading-relaxed text-[var(--fg-2)]">{it.line}</p>
        </li>
      ))}
    </ul>
  );
}
