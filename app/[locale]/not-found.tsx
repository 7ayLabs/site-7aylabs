import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { WRAP } from '@/components/site/layout';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <section className={`${WRAP} flex min-h-[70dvh] flex-col items-start justify-center py-20`}>
      <h1 className="t-display t-hero sm:text-[clamp(4rem,8vw,8.5rem)] max-w-[12ch] text-[var(--fg)]">{t('title')}</h1>
      <p className="t-lede mt-8">{t('lede')}</p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-ink">
          {t('home')}
        </Link>
        <Link href="/vizzor" className="btn btn-line">
          {t('vizzor')}
        </Link>
      </div>
    </section>
  );
}
