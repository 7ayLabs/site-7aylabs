import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { LandingReveal } from '@/components/landing/landing-reveal';
import { WRAP } from '@/components/ui/section';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

/** Bump when the text of the policy changes. */
const UPDATED = '2026-11-26';

const SECTIONS = ['scope', 'collect', 'use', 'keep', 'share', 'rights', 'changes'] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacyPage.meta' });
  return pageMetadata({ path: '/legal/privacy', locale: locale as Locale, title: t('title'), description: t('description') });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('privacyPage');
  const date = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${UPDATED}T00:00:00Z`),
  );

  return (
    <section>
      <LandingReveal>
        <div className={`${WRAP} pb-20 pt-20 sm:pb-32 sm:pt-28`}>
          <div className="mx-auto max-w-[760px]">
            <p data-reveal className="l-kicker">
              {t('kicker')}
            </p>
            <h1 data-reveal className="l-display l-section-title mt-5 text-[var(--fg)]">
              {t('title')}
            </h1>
            <p data-reveal className="mt-5 text-[14.5px] text-[var(--fg-3)]">
              {t('updated', { date })}
            </p>
            <div data-reveal className="l-prose mt-10 border-t border-[var(--l-hairline)] pt-10">
              <p>{t('intro')}</p>
              {SECTIONS.map((s) => (
                <div key={s}>
                  <h2>{t(`sections.${s}.title`)}</h2>
                  <p>{t(`sections.${s}.body`)}</p>
                </div>
              ))}
              <p>
                {t('contact')}{' '}
                <Link href="/contact">{t('contactLink')}</Link>.
              </p>
            </div>
          </div>
        </div>
      </LandingReveal>
    </section>
  );
}
