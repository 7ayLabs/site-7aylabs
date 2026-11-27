import { subscribe } from '@/lib/db';
import { sendWelcome } from '@/lib/api/notify';
import { clientIp, json, normalizeEmail, originAllowed, pickLocale, rateLimited, readJson } from '@/lib/api/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request): Promise<Response> {
  if (!originAllowed(req)) return json({ ok: false, error: 'forbidden' }, 403);
  if (rateLimited(`newsletter:${clientIp(req)}`, 10)) return json({ ok: false, error: 'rate_limited' }, 429);

  const body = await readJson(req, 2048);
  if (!body) return json({ ok: false, error: 'invalid' }, 400);
  if (typeof body.company === 'string' && body.company.trim() !== '') return json({ ok: true });

  const email = normalizeEmail(body.email);
  if (!email) return json({ ok: false, error: 'invalid' }, 400);

  try {
    // An address that is already subscribed gets the same answer as a new
    // one, so the endpoint cannot be used to test who is on the list.
    const locale = pickLocale(body.locale);
    const { id, isNew } = subscribe(email, locale);
    if (isNew) await sendWelcome({ id, email, locale });
    return json({ ok: true });
  } catch (err) {
    console.error('[newsletter] store failed:', err instanceof Error ? err.message : 'unknown error');
    return json({ ok: false, error: 'server' }, 500);
  }
}
