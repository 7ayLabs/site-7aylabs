/**
 * Reach — what Vizzor reads, and who it works with.
 *
 * Three honest groups, labelled for what they are: the blockchains it reads
 * live (a marquee of their own marks), the sources and platforms it is built
 * on, and the community partners that are confirmed. Nothing here is a
 * "trusted by" wall.
 */
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { Marquee } from '@/components/landing/v4/marquee';
import { ChainMark } from '@/components/ui/chain-mark';
import { Section, SectionHead } from '@/components/ui/section';
import { BUILT_WITH, DATA_SOURCES, PARTNERS } from '@/lib/site';
import { CHAINS, CHAIN_COUNT } from '@/lib/vizzor/chains';

function Chip({ children }: { children: string }) {
  return (
    <li className="l-glass inline-flex min-h-10 items-center rounded-full px-4 text-[14px] font-semibold text-[var(--fg)]">
      {children}
    </li>
  );
}

export async function Reach() {
  const t = await getTranslations('home.reach');

  return (
    <Section id="reach">
      <SectionHead kicker={t('kicker')} title={t('title', { count: CHAIN_COUNT })} lede={t('lede')} />

      <div data-reveal className="mt-12">
        <Marquee speed={36} label={t('chainsLabel', { count: CHAIN_COUNT })}>
          {CHAINS.map((c) => (
            <span key={c.id} className="mx-2 inline-flex items-center gap-2.5 rounded-full border border-[var(--l-glass-line)] py-2 pl-2 pr-4">
              <ChainMark chain={c.id} size={26} />
              <span className="whitespace-nowrap text-[14.5px] font-semibold text-[var(--fg)]">{c.name}</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        <div data-reveal className="l-glass rounded-[26px] p-7">
          <h3 className="l-kicker">{t('sources')}</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {DATA_SOURCES.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </ul>
          <p className="mt-4 text-[13.5px] leading-relaxed text-[var(--fg-3)]">{t('sourcesNote')}</p>
        </div>

        <div data-reveal className="l-glass rounded-[26px] p-7">
          <h3 className="l-kicker">{t('builtWith')}</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {BUILT_WITH.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </ul>
          <p className="mt-4 text-[13.5px] leading-relaxed text-[var(--fg-3)]">{t('builtWithNote')}</p>
        </div>

        <div data-reveal className="l-glass rounded-[26px] p-7">
          <h3 className="l-kicker">{t('partners')}</h3>
          <ul className="mt-4 grid gap-3">
            {PARTNERS.map((p) => (
              <li key={p.id}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                                    className="group flex min-h-16 items-center justify-between gap-4 rounded-[18px] border border-[var(--l-glass-line)] px-5 transition-colors duration-300 hover:border-[var(--border-hi)]"
                >
                  <Image
                    src={p.logo.onLight}
                    alt=""
                    width={p.logo.width}
                    height={p.logo.height}
                    unoptimized
                    className="block h-8 w-auto dark:hidden"
                  />
                  <Image
                    src={p.logo.onDark}
                    alt=""
                    width={p.logo.width}
                    height={p.logo.height}
                    unoptimized
                    className="hidden h-8 w-auto dark:block"
                  />
                  <span className="mr-auto text-[15px] font-semibold text-[var(--fg)]">{p.name}</span>
                  <ArrowUpRight
                    size={16}
                    strokeWidth={2}
                    aria-hidden
                    className="text-[var(--fg-3)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13.5px] leading-relaxed text-[var(--fg-3)]">{t('partnersNote')}</p>
        </div>
      </div>
    </Section>
  );
}
