import type { ReactNode } from 'react';

/** The site's measure: one max width and gutter everywhere. */
export const WRAP = 'mx-auto max-w-[1240px] px-5 sm:px-8';

/** A page body: the site's measure around a run of sections. */
export function Indexed({ children }: { children: ReactNode }) {
  return <div className={WRAP}>{children}</div>;
}

/**
 * Duo — a two-tone title. The text is written "light part|bold part": the
 * first is set light, the second heavy and upper-case on its own line. A
 * title with no bar is all bold.
 */
export function Duo({ text, as: Tag = 'h2', id, size = 'duo-title' }: { text: string; as?: 'h1' | 'h2'; id?: string; size?: string }) {
  const [a, b] = text.includes('|') ? (text.split('|') as [string, string]) : ['', text];
  return (
    <Tag id={id} className={`duo ${size}`}>
      {a ? <span className="lite">{a}</span> : null}
      <span className="bold">{b}</span>
    </Tag>
  );
}

/** The divider that opens a numbered section: "01 | Lab" on a hairline. */
export function Divider({ n, label }: { n: string; label: string }) {
  return (
    <div className="divider" aria-hidden>
      <span className="glass relative z-10 inline-flex min-h-10 items-center gap-3 rounded-full px-4 text-[14px] font-semibold text-[var(--fg-2)]">
        <span className="t-num text-[var(--fg)]">{n}</span>
        <span className="h-3.5 w-px bg-[var(--line-strong)]" />
        {label}
      </span>
    </div>
  );
}

/**
 * Block — one section of a page: an optional numbered divider, a centred
 * two-tone title and lede, then the content. The whole section sharpens out
 * of a blur as it comes into view and softens again when it leaves.
 */
export function Block({
  id,
  n,
  label,
  title,
  lede,
  children,
}: {
  id: string;
  n?: string;
  label?: string;
  title: string;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 py-14 sm:py-20">
      {n && label ? <Divider n={n} label={label} /> : null}
      <div data-reveal className={`mx-auto max-w-[820px] text-center ${n ? 'mt-12 sm:mt-16' : ''}`}>
        <Duo id={`${id}-title`} text={title} />
        {lede ? <p className="t-lede mx-auto mt-6">{lede}</p> : null}
      </div>
      {children ? (
        <div data-focus className="mt-12 sm:mt-16">
          {children}
        </div>
      ) : null}
    </section>
  );
}

/** The head of an inner page, centred like the home sections. */
export function PageHead({ title, lede, children }: { title: string; lede: ReactNode; children?: ReactNode }) {
  return (
    <section className={`${WRAP} pb-10 pt-14 text-center sm:pb-14 sm:pt-24`}>
      <div className="type-settle mx-auto max-w-[900px]">
        <Duo as="h1" text={title} size="duo-hero" />
      </div>
      <p data-reveal className="t-lede mx-auto mt-8">
        {lede}
      </p>
      {children ? <div className="mt-8 flex justify-center">{children}</div> : null}
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
        <li key={it.title} data-reveal className={`glass glass-live flex min-h-[11.5rem] flex-col justify-end rounded-[22px] p-7 ${span(i)}`}>
          <h3 className="t-head text-[var(--fg)]">{it.title}</h3>
          <p className="mt-2.5 max-w-[48ch] text-[16.5px] leading-relaxed text-[var(--fg-2)]">{it.line}</p>
        </li>
      ))}
    </ul>
  );
}
