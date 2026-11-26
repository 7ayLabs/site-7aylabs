/**
 * Coverage — what Vizzor reads and who it works with.
 *
 * The blockchains are shown all at once, as a grid of their own marks: the
 * number in the headline is the number of tiles. Under it, three plain rows
 * say where the data comes from, what the product runs on, and which
 * communities are confirmed partners. None of it is a "trusted by" wall.
 */
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ChainMark } from '@/components/ui/chain-mark';
import { BUILT_WITH, DATA_SOURCES, PARTNERS } from '@/lib/site';
import { CHAINS } from '@/lib/vizzor/chains';

function Row({ head, note, children }: { head: string; note: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-x-10 gap-y-3 border-t border-[var(--line)] py-6 sm:grid-cols-[220px_minmax(0,1fr)]">
      <dt>
        <span className="text-[16.5px] font-semibold text-[var(--fg)]">{head}</span>
        <span className="t-note mt-1 block max-w-[30ch]">{note}</span>
      </dt>
      <dd className="text-[1.25rem] leading-snug text-[var(--fg)]">{children}</dd>
    </div>
  );
}

export async function Coverage() {
  const t = await getTranslations('coverage');
  const list = new Intl.ListFormat(undefined, { style: 'long', type: 'conjunction' });

  return (
    <>
      <ul className="grid grid-cols-2 border-l border-t border-[var(--line)] sm:grid-cols-4 xl:grid-cols-6">
        {CHAINS.map((c) => (
          <li key={c.id} className="flex min-h-14 items-center gap-3 border-b border-r border-[var(--line)] px-3.5">
            <ChainMark chain={c.id} size={24} />
            <span className="truncate text-[15px] font-medium text-[var(--fg)]">{c.name}</span>
          </li>
        ))}
      </ul>

      <dl className="mt-12 border-b border-[var(--line)]">
        <Row head={t('sources')} note={t('sourcesNote')}>
          {list.format([...DATA_SOURCES])}
        </Row>
        <Row head={t('builtWith')} note={t('builtWithNote')}>
          {list.format([...BUILT_WITH])}
        </Row>
        <Row head={t('partners')} note={t('partnersNote')}>
          <ul className="flex flex-wrap gap-x-8 gap-y-4">
            {PARTNERS.map((p) => (
              <li key={p.id}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-11 items-center gap-4 font-semibold transition-colors duration-200 hover:text-[var(--accent)]"
                >
                  <Image src={p.logo.onLight} alt="" width={p.logo.width} height={p.logo.height} unoptimized className="block h-9 w-auto dark:hidden" />
                  <Image src={p.logo.onDark} alt="" width={p.logo.width} height={p.logo.height} unoptimized className="hidden h-9 w-auto dark:block" />
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </Row>
      </dl>
    </>
  );
}
