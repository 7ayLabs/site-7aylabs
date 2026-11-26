import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = '7ayLabs';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** The share card: the name, the line, nothing else. Monochrome like the site. */
export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#070708',
          color: '#f5f5f7',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>7ayLabs</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 92, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>{t('og')}</div>
          <div style={{ display: 'flex', marginTop: 28, fontSize: 30, color: '#a1a1aa', maxWidth: 900, lineHeight: 1.35 }}>
            {t('description')}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#85858f' }}>
          <span>7aylabs.com</span>
          <span>vizzor.ai</span>
        </div>
      </div>
    ),
    size,
  );
}
