/**
 * SiteNav — a plain bar across the top: the logo, the pages, the two
 * preferences, and the way into the product. It sticks, and gains a rule
 * under it once the page has moved (NavBar).
 */
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { VIZZOR } from '@/lib/site';
import { BrandMark } from './brand-mark';
import { LanguageSwitch } from './language-switch';
import { MobileMenu } from './mobile-menu';
import { NavBar } from './nav-bar';
import { NavLinks } from './nav-links';
import { ThemeToggle } from './theme-toggle';

export async function SiteNav() {
  const t = await getTranslations('chrome');

  return (
    <NavBar>
      <nav aria-label={t('nav.label')} className="mx-auto flex h-[68px] max-w-[1400px] items-center gap-6 px-5 sm:px-8">
        <Link href="/" aria-label={t('home')} className="inline-flex shrink-0 items-center">
          <BrandMark className="h-7 w-auto" priority />
        </Link>

        <NavLinks />

        <div className="ml-auto flex shrink-0 items-center gap-1 md:ml-0">
          <div className="hidden items-center md:flex">
            <LanguageSwitch />
            <ThemeToggle />
          </div>
          <a
            href={VIZZOR.app}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t('openVizzor')} (${t('newTab')})`}
            className="btn btn-ink ml-2 !min-h-11 !px-4 !text-[14.5px]"
          >
            {t('openVizzor')}
          </a>
          <MobileMenu />
        </div>
      </nav>
    </NavBar>
  );
}
