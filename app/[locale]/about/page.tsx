import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { Block, Indexed, PageHead, Tiles } from '@/components/site/layout';
import { JsonLd } from '@/components/site/json-ld';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { SITE, VIZZOR } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'aboutPage.meta' });
  return pageMetadata({ path: '/about', locale: locale as Locale, title: t('title'), description: t('description') });
}

const METHOD = ['receipts', 'plain', 'privacy', 'ship'] as const;

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('aboutPage');
  const home = await getTranslations('home');

  const facts = [
    { k: t('facts.product.k'), v: VIZZOR.name, href: VIZZOR.site },
    { k: t('facts.role.k'), v: t('facts.role.v') },
    { k: t('facts.code.k'), v: 'github.com/7ayLabs', href: SITE.github },
    { k: t('facts.news.k'), v: SITE.xHandle, href: SITE.x },
  ];

  const meta = await getTranslations('meta');
  const crumbs = breadcrumbJsonLd(locale as Locale, [
    { name: meta('home'), path: '/' },
    { name: t('meta.title'), path: '/about' },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />
      <PageHead title={t('title')} lede={t('lede')} />

      <Indexed>
        <Block id="mission" title={t('mission.title')}>
          <div data-reveal className="glass grid max-w-[78ch] gap-5 rounded-[26px] p-7 text-[1.2rem] leading-[1.6] text-[var(--fg-2)] sm:p-10">
            <p>{t('mission.p1')}</p>
            <p>{t('mission.p2')}</p>
            <p className="text-[var(--fg)]">{t('mission.p3')}</p>
          </div>
        </Block>

        <Block id="method" title={home('method.title')} lede={home('method.lede')}>
          <Tiles items={METHOD.map((k) => ({ title: home(`method.items.${k}.title`), line: home(`method.items.${k}.line`) }))} />
        </Block>

        <Block id="facts" title={t('facts.title')}>
          <dl className="glass rounded-[26px] px-7">
            {facts.map((f) => (
              <div key={f.k} className="grid gap-x-10 gap-y-1 border-t border-[var(--glass-line)] py-5 first:border-t-0 sm:grid-cols-[220px_minmax(0,1fr)]">
                <dt className="text-[16.5px] font-semibold text-[var(--fg)]">{f.k}</dt>
                <dd className="text-[1.2rem] text-[var(--fg)]">
                  {f.href ? (
                    <a href={f.href} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center">
                      {f.v}
                    </a>
                  ) : (
                    <span className="inline-flex min-h-11 items-center">{f.v}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="btn btn-ink">
              {t('ctaContact')}
            </Link>
            <Link href="/vizzor" className="btn btn-line">
              {t('ctaVizzor')}
            </Link>
          </div>
        </Block>
      </Indexed>
    </>
  );
}
