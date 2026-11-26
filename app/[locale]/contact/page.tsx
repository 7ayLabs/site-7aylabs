import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/i18n/routing';
import { ContactForm } from '@/components/forms/contact-form';
import { LandingReveal } from '@/components/landing/landing-reveal';
import { WRAP } from '@/components/ui/section';
import { pageMetadata } from '@/lib/seo';
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

  const elsewhere = [
    { label: t('elsewhere.vizzorHelp'), href: VIZZOR.docs },
    { label: 'X · 7ayLabs', href: SITE.x },
    { label: 'GitHub', href: SITE.github },
  ];

  return (
    <section>
      <LandingReveal>
        <div className={`${WRAP} grid gap-12 pb-20 pt-20 sm:pb-32 sm:pt-28 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16`}>
          <div>
            <p data-reveal className="l-kicker">
              {t('kicker')}
            </p>
            <h1 data-reveal className="l-display l-hero-title mt-5 text-[var(--fg)]">
              {t('title')}
            </h1>
            <p data-reveal className="l-lede mt-8">
              {t('lede')}
            </p>

            <div data-reveal className="mt-12">
              <h2 className="l-kicker">{t('elsewhere.title')}</h2>
              <ul className="mt-3">
                {elsewhere.map((e) => (
                  <li key={e.href} className="border-b border-[var(--l-hairline)]">
                    <a
                      href={e.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex min-h-14 items-center justify-between text-[16px] font-semibold text-[var(--fg)]"
                    >
                      {e.label}
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
            </div>
          </div>

          <div data-reveal className="l-glass self-start rounded-[32px] p-6 sm:p-10">
            <ContactForm />
          </div>
        </div>
      </LandingReveal>
    </section>
  );
}
