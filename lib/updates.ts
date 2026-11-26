/**
 * Update posts, read from `content/updates`.
 *
 * One file per post and language: `<slug>.<locale>.mdx`. A post missing in
 * a language falls back to English, so a new post never 404s for Spanish or
 * French readers while its translation is pending.
 *
 * Front matter: title, summary, date (YYYY-MM-DD), tag (`product` | `company`).
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { routing, type Locale } from '@/i18n/routing';

const DIR = path.join(process.cwd(), 'content', 'updates');
const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,80}$/;
const TAGS = ['product', 'company'] as const;

export type UpdateTag = (typeof TAGS)[number];

export interface UpdateMeta {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tag: UpdateTag;
  /** The language the body is actually written in. */
  lang: Locale;
}

export interface Update extends UpdateMeta {
  body: string;
}

function fileFor(slug: string, locale: Locale): { file: string; lang: Locale } | null {
  for (const lang of [locale, routing.defaultLocale] as const) {
    const file = path.join(DIR, `${slug}.${lang}.mdx`);
    if (fs.existsSync(file)) return { file, lang };
  }
  return null;
}

function parse(slug: string, locale: Locale): Update | null {
  if (!SLUG_RE.test(slug)) return null;
  const hit = fileFor(slug, locale);
  if (!hit) return null;
  const { data, content } = matter(fs.readFileSync(hit.file, 'utf8'));
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? '');
  if (!data.title || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const tag = TAGS.includes(data.tag) ? (data.tag as UpdateTag) : 'company';
  return {
    slug,
    title: String(data.title),
    summary: String(data.summary ?? ''),
    date,
    tag,
    lang: hit.lang,
    body: content,
  };
}

export function listSlugs(): string[] {
  if (!fs.existsSync(DIR)) return [];
  const slugs = new Set<string>();
  for (const f of fs.readdirSync(DIR)) {
    const m = /^(.+)\.([a-z]{2})\.mdx$/.exec(f);
    if (m?.[1] && SLUG_RE.test(m[1])) slugs.add(m[1]);
  }
  return [...slugs];
}

/** Newest first. */
export function listUpdates(locale: Locale): UpdateMeta[] {
  return listSlugs()
    .map((s) => parse(s, locale))
    .filter((p): p is Update => p !== null)
    .map(({ body: _body, ...meta }) => meta)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
}

export function getUpdate(slug: string, locale: Locale): Update | null {
  return parse(slug, locale);
}

export function formatDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${date}T00:00:00Z`),
  );
}
