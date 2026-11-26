import { insertContact } from '@/lib/db';
import { notifyContact } from '@/lib/api/notify';
import { cleanText, clientIp, hashIp, json, normalizeEmail, originAllowed, pickLocale, rateLimited, readJson } from '@/lib/api/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TOPICS = new Set(['general', 'vizzor', 'partnership', 'press', 'security']);

export async function POST(req: Request): Promise<Response> {
  if (!originAllowed(req)) return json({ ok: false, error: 'forbidden' }, 403);

  const ip = clientIp(req);
  if (rateLimited(`contact:${ip}`, 5)) return json({ ok: false, error: 'rate_limited' }, 429);

  const body = await readJson(req);
  if (!body) return json({ ok: false, error: 'invalid' }, 400);

  // Honeypot: a filled hidden field means a script. Answer as if it worked.
  if (typeof body.company === 'string' && body.company.trim() !== '') return json({ ok: true });

  const email = normalizeEmail(body.email);
  const name = cleanText(body.name, 120);
  const message = cleanText(body.message, 4000);
  const topic = typeof body.topic === 'string' && TOPICS.has(body.topic) ? body.topic : 'general';
  if (!email || name.length < 2 || message.length < 10) return json({ ok: false, error: 'invalid' }, 400);

  const entry = { name, email, topic, message, locale: pickLocale(body.locale), ipHash: hashIp(ip) };
  try {
    const id = insertContact(entry);
    await notifyContact(entry, id);
    return json({ ok: true });
  } catch (err) {
    console.error('[contact] store failed:', err instanceof Error ? err.message : 'unknown error');
    return json({ ok: false, error: 'server' }, 500);
  }
}
