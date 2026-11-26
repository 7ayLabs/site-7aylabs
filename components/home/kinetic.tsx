/**
 * Kinetic — two rows of display words drifting in opposite directions.
 * Decorative: the words repeat what the page already says.
 */
import { getTranslations } from 'next-intl/server';
import { Marquee } from '@/components/landing/v4/marquee';

export async function Kinetic() {
  const t = await getTranslations('home.kinetic');
  const words = t.raw('words') as string[];

  const row = (cls: string) =>
    words.map((w) => (
      <span key={w} className={`l-display mx-6 whitespace-nowrap text-[clamp(2.6rem,7vw,6.5rem)] ${cls}`}>
        {w}
        <span className="mx-6 text-[var(--fg-3)]">·</span>
      </span>
    ));

  return (
    <section aria-hidden className="overflow-hidden py-10 sm:py-16">
      <Marquee speed={48}>{row('text-[var(--fg)]')}</Marquee>
      <Marquee speed={40} reverse className="mt-2">
        {row('l-chrome')}
      </Marquee>
    </section>
  );
}
