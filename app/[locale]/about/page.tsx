import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { Principles } from '@/components/home/principles';
import { PageHead, Section, SectionHead } from '@/components/ui/section';
import { pageMetadata } from '@/lib/seo';
import { SITE, VIZZOR } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'aboutPage.meta' });
  return pageMetadata({ path: '/about', locale: locale as Locale, title: t('title'), description: t('description') });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('aboutPage');

  const facts = [
    { k: t('facts.product.k'), v: VIZZOR.name, href: VIZZOR.site },
    { k: t('facts.role.k'), v: t('facts.role.v') },
    { k: t('facts.code.k'), v: 'github.com/7ayLabs', href: SITE.github },
    { k: t('facts.news.k'), v: SITE.xHandle, href: SITE.x },
  ];

  return (
    <>
      <PageHead kicker={t('kicker')} title={t('title')} lede={t('lede')} />

      <Section id="mission" tight>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <SectionHead kicker={t('mission.kicker')} title={t('mission.title')} />
          </div>
          <div data-reveal className="grid gap-5 text-[17px] leading-[1.7] text-[var(--fg-2)]">
            <p>{t('mission.p1')}</p>
            <p>{t('mission.p2')}</p>
            <p>{t('mission.p3')}</p>
          </div>
        </div>
      </Section>

      <Principles />

      <Section id="facts" tight>
        <SectionHead kicker={t('facts.kicker')} title={t('facts.title')} />
        <dl className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.k} data-reveal className="l-glass flex flex-col-reverse justify-end gap-3 rounded-[22px] p-6">
              <dd className="text-[17px] font-semibold text-[var(--fg)]">
                {f.href ? (
                  <a href={f.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 underline-offset-4 hover:underline">
                    {f.v}
                    <ArrowUpRight size={14} strokeWidth={2.25} aria-hidden className="text-[var(--fg-3)]" />
                  </a>
                ) : (
                  <span className="inline-flex min-h-11 items-center">{f.v}</span>
                )}
              </dd>
              <dt className="l-kicker">{f.k}</dt>
            </div>
          ))}
        </dl>

        <div data-reveal className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Link href="/contact" className="l-btn l-btn-primary">
            {t('ctaContact')}
          </Link>
          <Link href="/vizzor" className="l-btn l-btn-ghost">
            {t('ctaVizzor')}
          </Link>
        </div>
      </Section>
    </>
  );
}
