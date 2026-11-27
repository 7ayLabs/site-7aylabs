/**
 * Outgoing email, through Resend.
 *
 * Email is optional: with no `RESEND_API_KEY` nothing is sent and every
 * function here returns quietly. What the visitor did is already stored
 * when these run, so a failed email never loses data and never fails their
 * request.
 */
import { createTranslator } from 'next-intl';
import type { ContactInput } from '@/lib/db';
import { unsubscribeUrl } from './tokens';

async function messagesFor(locale: string) {
  const safe = ['en', 'es', 'fr'].includes(locale) ? locale : 'en';
  return { locale: safe, messages: (await import(`../../messages/${safe}.json`)).default };
}

interface Mail {
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
  headers?: Record<string, string>;
}

export function emailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

async function send(mail: Mail): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || '7ayLabs <site@7aylabs.com>',
        to: Array.isArray(mail.to) ? mail.to : [mail.to],
        subject: mail.subject,
        text: mail.text,
        ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
        ...(mail.headers ? { headers: mail.headers } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error(`[email] send failed: HTTP ${res.status}`);
    return res.ok;
  } catch (err) {
    console.error('[email] send failed:', err instanceof Error ? err.message : 'unknown error');
    return false;
  }
}

/** A copy of a contact message for the team, and a receipt for the sender. */
export async function notifyContact(c: ContactInput, ref: string): Promise<void> {
  if (!emailEnabled()) return;
  const team = process.env.CONTACT_NOTIFY_TO;
  const { locale, messages } = await messagesFor(c.locale);
  const t = createTranslator({ locale, messages, namespace: 'emails' });
  await Promise.all([
    team
      ? send({
          to: team.split(',').map((s) => s.trim()).filter(Boolean),
          replyTo: c.email,
          subject: `[7aylabs.com] ${c.topic} · ${c.name} (${ref})`,
          text: `Reference: ${ref}\nFrom: ${c.name} <${c.email}>\nTopic: ${c.topic}\nLanguage: ${c.locale}\n\n${c.message}\n`,
        })
      : Promise.resolve(false),
    send({ to: c.email, subject: t('contactSubject', { ref }), text: `${t('contactBody', { ref })}\n\n7ayLabs\nhttps://7aylabs.com\n` }),
  ]);
}

/** The welcome email for a new subscriber, with a working way out. */
export async function sendWelcome(sub: { id: number; email: string; locale: string }): Promise<void> {
  if (!emailEnabled()) return;
  const { locale, messages } = await messagesFor(sub.locale);
  const t = createTranslator({ locale, messages, namespace: 'emails' });
  const url = unsubscribeUrl(sub.id, sub.email, locale);
  await send({
    to: sub.email,
    subject: t('welcomeSubject'),
    text: `${t('welcomeBody')}\n\n${url ? `${t('unsubLine', { url })}\n\n` : ''}7ayLabs\nhttps://7aylabs.com\n`,
    ...(url ? { headers: { 'List-Unsubscribe': `<${url}>` } } : {}),
  });
}
