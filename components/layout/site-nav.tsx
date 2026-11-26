/**
 * SiteNav — the floating glass capsule at the top of every page.
 *
 * Logo left, page links centre, language + theme + the way into Vizzor right.
 * Below `md` the links move into a full-screen menu.
 */
import { getTranslations } from 'next-intl/server';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { VIZZOR } from '@/lib/site';
import { BrandMark } from './brand-mark';
import { LanguageSwitch } from './language-switch';
import { MobileMenu } from './mobile-menu';
import { NavFx } from './nav-fx';
import { NavLinks } from './nav-links';
import { ThemeToggle } from './theme-toggle';

export async function SiteNav() {
  const t = await getTranslations('chrome');

  return (
    <NavFx>
      <nav aria-label={t('nav.label')} className="flex h-14 items-center justify-between gap-3 pl-5 pr-2 sm:pl-6">
        <Link href="/" aria-label={t('home')} className="inline-flex shrink-0 items-center rounded-sm">
          <BrandMark className="h-6 w-auto" priority />
        </Link>

        <NavLinks />

        <div className="flex shrink-0 items-center gap-0.5">
          <div className="hidden items-center md:flex">
            <LanguageSwitch />
            <ThemeToggle />
          </div>
          <a
            href={VIZZOR.app}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t('openVizzor')} (${t('newTab')})`}
            className="l-btn l-btn-primary ml-1 !h-10 !px-5 !text-[13.5px]"
          >
            <span>{t('openVizzor')}</span>
            <ArrowUpRight size={15} strokeWidth={2.25} aria-hidden />
          </a>
          <MobileMenu />
        </div>
      </nav>
    </NavFx>
  );
}
