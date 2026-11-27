/**
 * Coverage — every blockchain Vizzor reads, as a grid of their own marks
 * (the number in the headline is the number of tiles), and under it who
 * trusts the lab's work.
 */
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { ChainMark } from '@/components/ui/chain-mark';
import { PARTNERS } from '@/lib/site';
import { CHAINS } from '@/lib/vizzor/chains';

export async function Coverage() {
  const t = await getTranslations('coverage');

  return (
    <>
      <ul data-reveal="scale" className="glass grid grid-cols-2 overflow-hidden rounded-[22px] sm:grid-cols-4 xl:grid-cols-6">
        {CHAINS.map((c) => (
          <li
            key={c.id}
            className="-mb-px -mr-px flex min-h-14 items-center gap-3 border-b border-r border-[var(--glass-line)] px-3.5 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--fg)_8%,transparent)]"
          >
            <ChainMark chain={c.id} size={24} />
            <span className="truncate text-[15px] font-medium text-[var(--fg)]">{c.name}</span>
          </li>
        ))}
      </ul>

      <div data-reveal className="mt-6">
        {PARTNERS.map((p) => (
          <a
            key={p.id}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="glass glass-live group flex flex-col gap-5 rounded-[22px] p-6 sm:flex-row sm:items-center sm:p-7"
          >
            <span className="t-note font-semibold sm:w-[11rem]">{t('trusted')}</span>
            <span className="flex flex-1 items-center gap-5">
              <Image src={p.logo.onLight} alt="" width={p.logo.width} height={p.logo.height} unoptimized className="block h-14 w-auto dark:hidden" />
              <Image src={p.logo.onDark} alt="" width={p.logo.width} height={p.logo.height} unoptimized className="hidden h-14 w-auto dark:block" />
              <span>
                <span className="t-display block text-[1.9rem] text-[var(--fg)]">{p.name}</span>
                <span className="mt-1 block text-[15px] text-[var(--fg-2)]">{t('trustedNote')}</span>
              </span>
            </span>
            <ArrowUpRight
              size={20}
              strokeWidth={2}
              aria-hidden
              className="hidden shrink-0 text-[var(--fg-3)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--fg)] sm:block"
            />
          </a>
        ))}
      </div>
    </>
  );
}
