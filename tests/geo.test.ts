import { describe, expect, it } from 'vitest';
import { detectLocale, fromAcceptLanguage, isBot, localeInPath } from '@/lib/geo';

describe('language detection', () => {
  it('picks the language of the country', () => {
    expect(detectLocale({ country: 'MX' })).toBe('es');
    expect(detectLocale({ country: 'es' })).toBe('es');
    expect(detectLocale({ country: 'FR' })).toBe('fr');
    expect(detectLocale({ country: 'US' })).toBe('en');
  });

  it('lets the browser decide where the country does not', () => {
    expect(detectLocale({ country: 'CA', acceptLanguage: 'fr-CA,fr;q=0.9,en;q=0.8' })).toBe('fr');
    expect(detectLocale({ country: 'US', acceptLanguage: 'es-US,es;q=0.9,en;q=0.8' })).toBe('es');
    expect(detectLocale({ country: 'DE', acceptLanguage: 'de-DE,de;q=0.9' })).toBe('en');
    expect(detectLocale({})).toBe('en');
  });

  it('reads Accept-Language by weight, not by position', () => {
    expect(fromAcceptLanguage('en;q=0.3, fr;q=0.9')).toBe('fr');
    expect(fromAcceptLanguage('de, ja')).toBeNull();
    expect(fromAcceptLanguage('es;q=0, en')).toBe('en');
  });

  it('knows which language a path names', () => {
    expect(localeInPath('/es/vizzor')).toBe('es');
    expect(localeInPath('/fr')).toBe('fr');
    expect(localeInPath('/vizzor')).toBeNull();
    expect(localeInPath('/especial')).toBeNull();
  });

  it('never redirects crawlers or link previews', () => {
    expect(isBot('Mozilla/5.0 (compatible; Googlebot/2.1)')).toBe(true);
    expect(isBot('WhatsApp/2.23')).toBe(true);
    expect(isBot('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15')).toBe(false);
  });
});
