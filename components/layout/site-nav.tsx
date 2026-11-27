/**
 * SiteNav — a compact glass capsule centred at the top: the logo, the home
 * page's sections, the two preferences, and the way to reach us.
 */
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
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
      <nav aria-label={t('nav.label')} className="flex h-[56px] items-center gap-2 pl-4 pr-1.5">
        <Link href="/" aria-label={t('home')} className="mr-2 inline-flex shrink-0 items-center">
          <BrandMark className="h-6 w-auto" priority />
        </Link>

        <NavLinks />

        <div className="ml-auto flex shrink-0 items-center lg:ml-1">
          <div className="hidden items-center lg:flex">
            <LanguageSwitch />
            <ThemeToggle />
          </div>
          <Link href="/#contact" className="btn btn-ink ml-1 !min-h-11 !rounded-[12px] !px-4 !text-[14.5px]">
            {t('talk')}
          </Link>
          <MobileMenu />
        </div>
      </nav>
    </NavBar>
  );
}
