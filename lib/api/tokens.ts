/**
 * Signed links for actions that must work without a login, such as leaving
 * the newsletter from an email.
 *
 * The link carries the subscriber's row id and a signature over that id and
 * the address, made with a secret only the server holds. No address appears
 * in the URL, and a link cannot be forged or reused for another subscriber.
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import { SITE } from '@/lib/site';

function secret(): string | null {
  const s = (process.env.SITE_SECRET || process.env.RATE_LIMIT_SALT || '').trim();
  return s.length >= 16 ? s : null;
}

/** True when the server has a secret to sign with. Without one, no links are issued. */
export function canSign(): boolean {
  return secret() !== null;
}

export function unsubscribeToken(id: number, email: string): string | null {
  const key = secret();
  if (!key) return null;
  return createHmac('sha256', key).update(`unsubscribe:${id}:${email.toLowerCase()}`).digest('hex').slice(0, 40);
}

export function verifyUnsubscribe(id: number, email: string, token: string): boolean {
  const expected = unsubscribeToken(id, email);
  if (!expected || typeof token !== 'string' || token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

export function unsubscribeUrl(id: number, email: string, locale: string): string | null {
  const token = unsubscribeToken(id, email);
  if (!token) return null;
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return `${SITE.url}${prefix}/unsubscribe?s=${id}&t=${token}`;
}
