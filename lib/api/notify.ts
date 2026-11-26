/**
 * Optional: email a copy of a contact message to the team through Resend.
 *
 * Off unless `RESEND_API_KEY` and `CONTACT_NOTIFY_TO` are both set. The
 * message is already stored when this runs, so a failed email never loses it
 * and never fails the visitor's request.
 */
import type { ContactInput } from '@/lib/db';

export async function notifyContact(c: ContactInput, id: number): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_TO;
  if (!key || !to) return;
  const from = process.env.CONTACT_FROM || 'site@7aylabs.com';

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from,
        to: to.split(',').map((s) => s.trim()).filter(Boolean),
        reply_to: c.email,
        subject: `[7aylabs.com] ${c.topic} · ${c.name}`,
        text: `Message #${id}\nFrom: ${c.name} <${c.email}>\nTopic: ${c.topic}\nLanguage: ${c.locale}\n\n${c.message}\n`,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error(`[contact] notify failed: HTTP ${res.status}`);
  } catch (err) {
    console.error('[contact] notify failed:', err instanceof Error ? err.message : 'unknown error');
  }
}
