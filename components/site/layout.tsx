import type { ReactNode } from 'react';
import { PageIndex, type IndexItem } from './page-index';

/** The site's measure: one max width and gutter everywhere. */
export const WRAP = 'mx-auto max-w-[1400px] px-5 sm:px-8';

/**
 * Indexed — a page body with its table of contents beside it.
 *
 * From `lg` the index sits in a narrow left column and stays in view while
 * the blocks scroll past, marking the one being read. Below `lg` it is left
 * out: the page is short enough to scroll.
 */
export function Indexed({ items, label, children }: { items: IndexItem[]; label: string; children: ReactNode }) {
  return (
    <div className={`${WRAP} grid gap-x-16 lg:grid-cols-[200px_minmax(0,1fr)]`}>
      <PageIndex items={items} label={label} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** One block of an indexed page: a rule, a headline, an optional lede, content. */
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
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-[var(--line-strong)] pb-20 pt-8 sm:pb-28 sm:pt-10">
      <h2 id={`${id}-title`} data-reveal className="t-display t-title max-w-[18ch] text-[var(--fg)]">
        {title}
      </h2>
      {lede ? (
        <p data-reveal className="t-lede mt-6">
          {lede}
        </p>
      ) : null}
      {children ? <div className="mt-10 sm:mt-14">{children}</div> : null}
    </section>
  );
}

/** The head of an inner page. */
export function PageHead({ title, lede, children }: { title: ReactNode; lede: ReactNode; children?: ReactNode }) {
  return (
    <section className={`${WRAP} pb-14 pt-10 sm:pb-20 sm:pt-16`}>
      <h1 className="t-display t-hero type-settle max-w-[17ch] text-[var(--fg)] sm:text-[clamp(4rem,8vw,8.5rem)]">{title}</h1>
      <p className="t-lede mt-8">{lede}</p>
      {children}
    </section>
  );
}

/** A plain two-column list of statements: a head and one sentence each. */
export function Statements({ items }: { items: { title: string; line: string }[] }) {
  return (
    <ul className="grid gap-x-14 gap-y-10 sm:grid-cols-2" data-stagger>
      {items.map((it) => (
        <li key={it.title} data-reveal>
          <h3 className="t-head text-[var(--fg)]">{it.title}</h3>
          <p className="mt-2.5 max-w-[46ch] text-[16.5px] leading-relaxed text-[var(--fg-2)]">{it.line}</p>
        </li>
      ))}
    </ul>
  );
}
