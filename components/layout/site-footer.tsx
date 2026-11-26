/**
 * SiteFooter — sign-up, the site's links, and the name at page width.
 */
import { getTranslations } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { NewsletterForm } from '@/components/forms/newsletter-form';
import { SITE, VIZZOR } from '@/lib/site';
import { BrandMark } from './brand-mark';
import { NAV_ITEMS } from './nav-config';

const linkCls =
  'inline-flex min-h-11 items-center gap-1 text-[15px] text-[var(--fg-2)] transition-colors duration-300 hover:text-[var(--fg)]';

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>
      {children}
      <ArrowUpRight size={13} strokeWidth={2} aria-hidden className="text-[var(--fg-3)]" />
    </a>
  );
}

export async function SiteFooter() {
  const t = await getTranslations('chrome');
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-[var(--l-hairline)]">
      <div className="mx-auto max-w-[1320px] px-4 pt-16 sm:px-6 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div>
            <BrandMark className="h-8 w-auto" />
            <p className="mt-5 max-w-[42ch] text-[16px] leading-relaxed text-[var(--fg-2)]">{t('footer.tagline')}</p>
            <div className="mt-8">
              <NewsletterForm />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <nav aria-label={t('footer.company')}>
              <h2 className="l-kicker">{t('footer.company')}</h2>
              <ul className="mt-3">
                {NAV_ITEMS.filter((i) => i.key !== 'vizzor').map((item) => (
                  <li key={item.key}>
                    <Link href={item.href} className={linkCls}>
                      {t(`nav.${item.key}`)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/legal/privacy" className={linkCls}>
                    {t('footer.privacy')}
                  </Link>
                </li>
              </ul>
            </nav>

            <nav aria-label={t('footer.product')}>
              <h2 className="l-kicker">{t('footer.product')}</h2>
              <ul className="mt-3">
                <li>
                  <Link href="/vizzor" className={linkCls}>
                    {t('footer.aboutVizzor')}
                  </Link>
                </li>
                <li>
                  <Ext href={VIZZOR.app}>{t('footer.app')}</Ext>
                </li>
                <li>
                  <Ext href={VIZZOR.docs}>{t('footer.docs')}</Ext>
                </li>
                <li>
                  <Ext href={VIZZOR.pricing}>{t('footer.pricing')}</Ext>
                </li>
              </ul>
            </nav>

            <nav aria-label={t('footer.follow')}>
              <h2 className="l-kicker">{t('footer.follow')}</h2>
              <ul className="mt-3">
                <li>
                  <Ext href={SITE.x}>X · 7ayLabs</Ext>
                </li>
                <li>
                  <Ext href={VIZZOR.x}>X · Vizzor</Ext>
                </li>
                <li>
                  <Ext href={SITE.github}>GitHub</Ext>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-[var(--l-hairline)] py-6 text-[13.5px] text-[var(--fg-3)] sm:flex-row sm:items-center sm:justify-between">
          <p>{t('footer.rights', { year })}</p>
          <p>{t('footer.made')}</p>
        </div>
      </div>

      {/* The name at page width, sunk into the page. Decorative. */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="l-display l-wordmark -mb-[0.16em] text-center whitespace-nowrap text-[clamp(3rem,14.5vw,15rem)] leading-none">7ayLabs</p>
      </div>
    </footer>
  );
}
