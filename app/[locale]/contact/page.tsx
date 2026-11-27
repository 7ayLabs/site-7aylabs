import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { ContactForm } from '@/components/forms/contact-form';
import { WRAP } from '@/components/site/layout';
import { JsonLd } from '@/components/site/json-ld';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';
import { SITE, VIZZOR } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contactPage.meta' });
  return pageMetadata({ path: '/contact', locale: locale as Locale, title: t('title'), description: t('description') });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contactPage');
  const chrome = await getTranslations('chrome');

  const elsewhere = [
    { label: t('elsewhere.vizzorHelp'), href: VIZZOR.docs },
    { label: chrome('footer.xLab'), href: SITE.x },
    { label: 'GitHub', href: SITE.github },
  ];

  const meta = await getTranslations('meta');
  const crumbs = breadcrumbJsonLd(locale as Locale, [
    { name: meta('home'), path: '/' },
    { name: t('meta.title'), path: '/contact' },
  ]);

  return (
    <>
      <JsonLd data={crumbs} />
    <section className={`${WRAP} grid gap-14 pb-24 pt-10 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20`}>
      <div>
        <h1 className="t-display t-hero type-settle sm:text-[clamp(2.8rem,5vw,5.5rem)] text-[var(--fg)]">{t('title')}</h1>
        <p className="t-lede mt-8">{t('lede')}</p>

        <h2 className="mt-12 text-[16.5px] font-semibold text-[var(--fg)]">{t('elsewhere.title')}</h2>
        <ul className="mt-3 border-b border-[var(--line)]">
          {elsewhere.map((e) => (
            <li key={e.href} className="border-t border-[var(--line)]">
              <a
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-14 items-center text-[1.15rem] text-[var(--fg)] transition-colors duration-200 hover:text-[var(--accent)]"
              >
                {e.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="glass self-start rounded-[24px] p-6 sm:p-9">
        <ContactForm />
      </div>
    </section>
    </>
  );
}
