/**
 * Shared guards for the form endpoints: origin check, rate limit, input
 * cleaning. Small on purpose; the site takes two kinds of submission.
 */
import { createHash } from 'node:crypto';
import { routing } from '@/i18n/routing';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Throwaway inboxes: accepted silently by nobody, rejected up front. */
const DISPOSABLE = new Set([
  'mailinator.com',
  'guerrillamail.com',
  '10minutemail.com',
  'tempmail.com',
  'temp-mail.org',
  'throwawaymail.com',
  'yopmail.com',
  'trashmail.com',
  'sharklasers.com',
  'getnada.com',
  'dispostable.com',
  'maildrop.cc',
  'fakeinbox.com',
  'mintemail.com',
]);

export function normalizeEmail(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const email = input.trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) return null;
  const domain = email.slice(email.lastIndexOf('@') + 1);
  if (DISPOSABLE.has(domain)) return null;
  return email;
}

/** Trim, drop control characters and markup, cap the length. */
export function cleanText(input: unknown, max: number): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);
}

export function pickLocale(input: unknown): string {
  return typeof input === 'string' && (routing.locales as readonly string[]).includes(input) ? input : routing.defaultLocale;
}

/** The visitor's address as the proxy chain reports it. */
export function clientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get('cf-connecting-ip')?.trim() ||
    h.get('x-real-ip')?.trim() ||
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

/** A salted hash, so a stored row never holds the raw address. */
export function hashIp(ip: string): string | null {
  if (ip === 'unknown') return null;
  const salt = process.env.RATE_LIMIT_SALT ?? '';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32);
}

/**
 * Cross-site form posts are refused. A browser always sends `Origin` on a
 * cross-origin POST; when it is present it must be this site (the request's
 * own host) or one of `ALLOWED_ORIGINS`.
 */
export function originAllowed(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  if (host && originHost === host) return true;
  const allowed = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return allowed.some((a) => {
    try {
      return new URL(a).host === originHost;
    } catch {
      return a === originHost;
    }
  });
}

/* ── Rate limit ───────────────────────────────────────────────────────────
 * Fixed window, in memory, per key. One container serves the site, so one
 * process sees every request; nginx applies a second limit in front.
 */
const WINDOW_MS = 60_000;
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimited(key: string, limit: number, now = Date.now()): boolean {
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  b.count += 1;
  return b.count > limit;
}

export function resetRateLimits(): void {
  buckets.clear();
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

/** Parse a JSON body no larger than `maxBytes`; null when it is not usable. */
export async function readJson(req: Request, maxBytes = 16_384): Promise<Record<string, unknown> | null> {
  const type = req.headers.get('content-type') ?? '';
  if (!type.toLowerCase().includes('application/json')) return null;
  try {
    const raw = await req.text();
    if (raw.length > maxBytes) return null;
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}
