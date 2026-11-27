import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { LEGACY_REDIRECTS } from '@/lib/redirects';
import { localeUrl, pageAlternates } from '@/lib/seo';
import { getUpdate, listSlugs, listUpdates } from '@/lib/updates';
import { CHAINS, CHAIN_COUNT, INTEL_SAMPLE, MAJOR_CHAINS } from '@/lib/vizzor/chains';
import { normalizeEmail, cleanText } from '@/lib/api/validation';

const PAGES = new Set(['/', '/products', '/vizzor', '/about', '/updates', '/contact']);

describe('legacy redirects', () => {
  it('every old address lands on a page that exists', () => {
    for (const r of LEGACY_REDIRECTS) {
      const dest = r.destination.replace(/^\/(es|fr)(?=\/|$)/, '') || '/';
      if (dest === '/:path*') continue;
      expect(PAGES.has(dest), `${r.source} → ${r.destination}`).toBe(true);
    }
  });

  it('never redirects a current page and has no duplicate sources', () => {
    const sources = LEGACY_REDIRECTS.map((r) => r.source);
    expect(new Set(sources).size).toBe(sources.length);
    for (const s of sources) expect(PAGES.has(s)).toBe(false);
  });

  it('keeps the language where it still exists', () => {
    expect(LEGACY_REDIRECTS.find((r) => r.source === '/es/technology')?.destination).toBe('/es/vizzor');
    expect(LEGACY_REDIRECTS.find((r) => r.source === '/de/technology')?.destination).toBe('/vizzor');
    expect(LEGACY_REDIRECTS.find((r) => r.source === '/fr/devnet')?.destination).toBe('/fr');
  });
});

describe('seo', () => {
  it('builds per-locale canonicals', () => {
    expect(localeUrl('/', 'en')).toMatch(/^https?:\/\/[^/]+$/);
    expect(localeUrl('/vizzor', 'es')).toMatch(/\/es\/vizzor$/);
    const alt = pageAlternates('/about', 'fr');
    expect(alt?.canonical).toMatch(/\/fr\/about$/);
    expect(Object.keys(alt?.languages ?? {}).sort()).toEqual(['en', 'es', 'fr', 'x-default']);
  });
});

describe('updates', () => {
  it('reads every post in every language, newest first', () => {
    expect(listSlugs().length).toBeGreaterThan(0);
    for (const locale of ['en', 'es', 'fr'] as const) {
      const posts = listUpdates(locale);
      expect(posts.length).toBe(listSlugs().length);
      expect([...posts].sort((a, b) => b.date.localeCompare(a.date)).map((p) => p.slug)).toEqual(posts.map((p) => p.slug));
      for (const p of posts) expect(p.title.length).toBeGreaterThan(0);
    }
  });

  it('refuses a slug that could leave the folder', () => {
    expect(getUpdate('../../package', 'en')).toBeNull();
    expect(getUpdate('nope', 'en')).toBeNull();
  });
});

describe('chains', () => {
  it('lists each chain once and samples only known chains', () => {
    const ids = CHAINS.map((c) => c.id);
    expect(new Set(ids).size).toBe(CHAIN_COUNT);
    for (const id of [...MAJOR_CHAINS, ...INTEL_SAMPLE]) expect(ids).toContain(id);
  });
});

describe('validation helpers', () => {
  it('normalises and rejects emails', () => {
    expect(normalizeEmail('  A@B.io ')).toBe('a@b.io');
    expect(normalizeEmail('a@b')).toBeNull();
    expect(normalizeEmail(42)).toBeNull();
  });
  it('cleans text', () => {
    expect(cleanText('  <i>hi</i>\u0000 ', 10)).toBe('hi');
    expect(cleanText('abcdef', 3)).toBe('abc');
  });
});

/** WCAG contrast of the text tokens against the page ground, both themes. */
describe('colour contrast', () => {
  const css = fs.readFileSync(path.join(process.cwd(), 'app/globals.css'), 'utf8');
  const block = (re: RegExp) => re.exec(css)?.[1] ?? '';
  const light = block(/:root\s*\{([^}]*)\}/);
  const dark = block(/\[data-theme='dark'\]\s*\{([^}]*)\}/);
  const token = (src: string, name: string) => new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`).exec(src)?.[1] ?? '';
  const lum = (hex: string) => {
    const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!;
  };
  const ratio = (a: string, b: string) => {
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x) as [number, number];
    return (hi + 0.05) / (lo + 0.05);
  };

  it.each([
    ['light', light],
    ['dark', dark],
  ])('%s theme text passes AA on the page ground', (_n, src) => {
    const bg = token(src, 'bg');
    expect(bg).not.toBe('');
    for (const name of ['fg', 'fg-2', 'fg-3']) expect(ratio(token(src, name), bg), name).toBeGreaterThanOrEqual(4.5);
  });
});
