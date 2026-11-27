import type { ReactNode } from 'react';

/** The site's measure: one max width and gutter everywhere. */
export const WRAP = 'mx-auto max-w-[1280px] px-5 sm:px-8';

/** A page body: the site's measure around a run of blocks. */
export function Indexed({ children }: { children: ReactNode }) {
  return <div className={WRAP}>{children}</div>;
}

/** A string as words that rise one by one (styled by `.words`). */
export function Words({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <span className="words">
      {words.map((w, i) => (
        <span key={i}>
          <span className="w">
            <i style={{ '--i': i } as React.CSSProperties}>{w}</i>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  );
}

/**
 * A short hash for a block, derived from its id (FNV-1a). It is the same on
 * every render and for every visitor: a stamp, like a block's own hash, not
 * a random decoration.
 */
export function blockHash(id: string): string {
  let h = 0x811c9dc5;
  const seed = `7aylabs:${id}`;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  const hex = (h.toString(16).padStart(8, '0') + Math.imul(h ^ 0x9e3779b9, 0x85ebca6b).toString(16).replace('-', '').padStart(8, '0')).slice(0, 12);
  return `0x${hex.slice(0, 4)}…${hex.slice(-4)}`;
}

/**
 * The header that opens a block: its number, its name, and its hash, with a
 * rule running out to the hash. Above it hangs the link to the block before.
 */
export function BlockHeader({ id, n, label, blockWord }: { id: string; n: string; label: string; blockWord: string }) {
  return (
    <div aria-hidden>
      <div className="block-link">
        <span className="link-light" />
      </div>
      <div className="block-head mt-3">
        <span className="glass inline-flex min-h-10 items-center gap-3 rounded-[12px] px-3.5 text-[14px] font-semibold text-[var(--fg)]">
          <span className="grid h-5 w-5 place-items-center rounded-[5px] bg-[var(--fg)] text-[var(--bg)]">
            <span className="block h-2 w-2 rounded-[2px] bg-[var(--bg)]" />
          </span>
          <span className="t-num">
            {blockWord} {n}
          </span>
          <span className="h-3.5 w-px bg-[var(--line-strong)]" />
          <span className="text-[var(--fg-2)]">{label}</span>
        </span>
        <span className="t-num t-note col-start-3 whitespace-nowrap">{blockHash(id)}</span>
      </div>
    </div>
  );
}

/**
 * Block — one section of a page, and one block of the chain the page is
 * built as. Under its header the title sits left with its words rising in,
 * the lede set against it on the right; then the content.
 */
export function Block({
  id,
  n,
  label,
  blockWord,
  title,
  lede,
  children,
}: {
  id: string;
  n?: string;
  label?: string;
  blockWord?: string;
  title: string;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 pb-10 sm:pb-14">
      {n && label ? <BlockHeader id={id} n={n} label={label} blockWord={blockWord ?? 'Block'} /> : null}
      <div data-reveal className="mt-10 grid items-end gap-x-16 gap-y-5 sm:mt-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <h2 id={`${id}-title`} className="t-display t-title max-w-[18ch] text-[var(--fg)]">
          <Words text={title} />
        </h2>
        {lede ? <p className="t-lede lg:pb-2">{lede}</p> : null}
      </div>
      {children ? (
        <div data-focus className="mt-10 sm:mt-14">
          {children}
        </div>
      ) : null}
    </section>
  );
}

/** The head of an inner page. */
export function PageHead({ title, lede, children }: { title: string; lede: ReactNode; children?: ReactNode }) {
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
        <li key={it.title} data-reveal className={`glass glass-live flex min-h-[11.5rem] flex-col justify-end rounded-[22px] p-7 ${span(i)}`}>
          <h3 className="t-head text-[var(--fg)]">{it.title}</h3>
          <p className="mt-2.5 max-w-[48ch] text-[16.5px] leading-relaxed text-[var(--fg-2)]">{it.line}</p>
        </li>
      ))}
    </ul>
  );
}
