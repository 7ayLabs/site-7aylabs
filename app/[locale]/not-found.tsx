import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { WRAP } from '@/components/ui/section';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <section className={`${WRAP} flex min-h-[70dvh] flex-col items-start justify-center py-24`}>
      <p className="mono text-[14px] font-semibold text-[var(--fg-3)]">404</p>
      <h1 className="l-display l-hero-title mt-5 max-w-[14ch] text-[var(--fg)]">{t('title')}</h1>
      <p className="l-lede mt-8">{t('lede')}</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="l-btn l-btn-primary">
          {t('home')}
        </Link>
        <Link href="/vizzor" className="l-btn l-btn-ghost">
          {t('vizzor')}
        </Link>
      </div>
    </section>
  );
}
