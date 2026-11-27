import { getSubscriber, unsubscribe } from '@/lib/db';
import { verifyUnsubscribe } from '@/lib/api/tokens';
import { clientIp, json, originAllowed, rateLimited, readJson } from '@/lib/api/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Leave the newsletter. Takes the subscriber id and the signature from the
 * link in an email. It is a POST made by the button on the unsubscribe page,
 * never a GET: mail scanners open links, and opening a link must not change
 * anything.
 */
export async function POST(req: Request): Promise<Response> {
  if (!originAllowed(req)) return json({ ok: false, error: 'forbidden' }, 403);
  if (rateLimited(`unsubscribe:${clientIp(req)}`, 10)) return json({ ok: false, error: 'rate_limited' }, 429);

  const body = await readJson(req, 1024);
  const id = Number(body?.s);
  const token = typeof body?.t === 'string' ? body.t : '';
  if (!Number.isInteger(id) || id <= 0 || !token) return json({ ok: false, error: 'invalid' }, 400);

  try {
    const sub = getSubscriber(id);
    // The same answer for "no such subscriber" and "bad signature".
    if (!sub || !verifyUnsubscribe(id, sub.email, token)) return json({ ok: false, error: 'invalid' }, 400);
    unsubscribe(id);
    return json({ ok: true });
  } catch (err) {
    console.error('[unsubscribe] failed:', err instanceof Error ? err.message : 'unknown error');
    return json({ ok: false, error: 'server' }, 500);
  }
}
