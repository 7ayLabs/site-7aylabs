import type { ReactNode } from 'react';
import { LandingReveal } from '@/components/landing/landing-reveal';

/** The page's measure: one max width and gutter for every section. */
export const WRAP = 'mx-auto max-w-[1320px] px-4 sm:px-6';

/** A section with the standard rhythm and scroll reveal. */
export function Section({
  id,
  children,
  className = '',
  tight = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tight?: boolean;
}) {
  return (
    <section id={id} className={className}>
      <LandingReveal>
        <div className={`${WRAP} ${tight ? 'py-14 sm:py-20' : 'py-20 sm:py-32'}`}>{children}</div>
      </LandingReveal>
    </section>
  );
}

/** Kicker, title and lede: the head of a section. */
export function SectionHead({
  kicker,
  title,
  lede,
  as: Tag = 'h2',
}: {
  kicker?: string;
  title: ReactNode;
  lede?: ReactNode;
  as?: 'h1' | 'h2';
}) {
  return (
    <>
      {kicker ? (
        <p data-reveal className="l-kicker">
          {kicker}
        </p>
      ) : null}
      <Tag data-reveal className={`l-display l-section-title max-w-[900px] text-[var(--fg)] ${kicker ? 'mt-4' : ''}`}>
        {title}
      </Tag>
      {lede ? (
        <p data-reveal className="l-lede mt-6">
          {lede}
        </p>
      ) : null}
    </>
  );
}

/** The head of an inner page: sits under the floating nav. */
export function PageHead({ kicker, title, lede }: { kicker: string; title: ReactNode; lede: ReactNode }) {
  return (
    <section>
      <LandingReveal>
        <div className={`${WRAP} pb-10 pt-20 sm:pb-16 sm:pt-28`}>
          <p data-reveal className="l-kicker">
            {kicker}
          </p>
          <h1 data-reveal className="l-display l-hero-title mt-5 max-w-[16ch] text-[var(--fg)]">
            {title}
          </h1>
          <p data-reveal className="l-lede mt-8">
            {lede}
          </p>
        </div>
      </LandingReveal>
    </section>
  );
}
