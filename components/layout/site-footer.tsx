/**
 * SiteFooter — where a reader goes next: into the product, onto the list, or
 * to another page. Three plain columns under one closing line.
 */
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { NewsletterForm } from '@/components/forms/newsletter-form';
import { SITE, VIZZOR } from '@/lib/site';
import { BrandMark } from './brand-mark';
import { NAV_ITEMS } from './nav-config';

const item = 'inline-flex min-h-11 items-center text-[15.5px] text-[var(--fg-2)] transition-colors duration-200 hover:text-[var(--accent)]';

function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={item}>
      {children}
    </a>
  );
}

export async function SiteFooter() {
  const t = await getTranslations('chrome');
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-[var(--line-strong)]">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid gap-10 py-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20 lg:py-20">
          <div>
            <p className="t-display t-title max-w-[12ch] text-[var(--fg)]">{t('footer.line')}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={VIZZOR.app} target="_blank" rel="noopener noreferrer" className="btn btn-ink">
                {t('openVizzor')}
              </a>
              <Link href="/contact" className="btn btn-line">
                {t('footer.talk')}
              </Link>
            </div>
          </div>
          <div className="lg:pt-3">
            <NewsletterForm />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 border-t border-[var(--line)] py-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <BrandMark className="h-8 w-auto" />
            <p className="t-note mt-4 max-w-[28ch]">{t('footer.tagline')}</p>
          </div>

          <nav aria-label={t('footer.company')}>
            <h2 className="text-[15.5px] font-semibold text-[var(--fg)]">{t('footer.company')}</h2>
            <ul className="mt-1">
              {NAV_ITEMS.filter((i) => i.key !== 'vizzor').map((n) => (
                <li key={n.key}>
                  <Link href={n.href} className={item}>
                    {t(`nav.${n.key}`)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/legal/privacy" className={item}>
                  {t('footer.privacy')}
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label={t('footer.product')}>
            <h2 className="text-[15.5px] font-semibold text-[var(--fg)]">{t('footer.product')}</h2>
            <ul className="mt-1">
              <li>
                <Link href="/vizzor" className={item}>
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
            <h2 className="text-[15.5px] font-semibold text-[var(--fg)]">{t('footer.follow')}</h2>
            <ul className="mt-1">
              <li>
                <Ext href={SITE.x}>{t('footer.xLab')}</Ext>
              </li>
              <li>
                <Ext href={VIZZOR.x}>{t('footer.xVizzor')}</Ext>
              </li>
              <li>
                <Ext href={SITE.github}>GitHub</Ext>
              </li>
            </ul>
          </nav>
        </div>

        <p className="t-note border-t border-[var(--line)] py-6">{t('footer.rights', { year })}</p>
      </div>
    </footer>
  );
}
