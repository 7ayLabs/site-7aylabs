import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { WRAP } from '@/components/site/layout';
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
    <section className={`${WRAP} pb-24 pt-10 sm:pt-16`}>
      <div className="max-w-[760px]">
        <h1 className="t-display t-hero sm:text-[clamp(4rem,8vw,8.5rem)] text-[var(--fg)]">{t('title')}</h1>
        <p className="t-note mt-6">{t('updated', { date })}</p>
        <div className="prose mt-10 border-t border-[var(--line-strong)] pt-10">
          <p>{t('intro')}</p>
          {SECTIONS.map((s) => (
            <div key={s}>
              <h2>{t(`sections.${s}.title`)}</h2>
              <p>{t(`sections.${s}.body`)}</p>
            </div>
          ))}
          <p>
            {t('contact')} <Link href="/contact">{t('contactLink')}</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
