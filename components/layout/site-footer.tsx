/** SiteFooter — one quiet row: the mark, the site's pages, and the year. */
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { SITE, VIZZOR } from '@/lib/site';
import { BrandMark } from './brand-mark';
import { NAV_ITEMS } from './nav-config';

const item = 'inline-flex min-h-11 items-center text-[14.5px] text-[var(--fg-2)] transition-colors duration-200 hover:text-[var(--fg)]';

export async function SiteFooter() {
  const t = await getTranslations('chrome');
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-[var(--line)]">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-5 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <BrandMark className="h-6 w-auto" />
          <p className="t-note">{t('footer.tagline')}</p>
        </div>
        <nav aria-label={t('footer.links')}>
          <ul className="flex flex-wrap gap-x-6">
            {NAV_ITEMS.map((n) => (
              <li key={n.key}>
                <Link href={n.href} className={item}>
                  {t(`nav.${n.key}`)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/vizzor" className={item}>
                {VIZZOR.name}
              </Link>
            </li>
            <li>
              <Link href="/legal/privacy" className={item}>
                {t('footer.privacy')}
              </Link>
            </li>
            <li>
              <a href={SITE.x} target="_blank" rel="noopener noreferrer" className={item}>
                X
              </a>
            </li>
            <li>
              <a href={SITE.github} target="_blank" rel="noopener noreferrer" className={item}>
                GitHub
              </a>
            </li>
          </ul>
        </nav>
        <p className="t-note">{t('footer.rights', { year })}</p>
      </div>
    </footer>
  );
}
