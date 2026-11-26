import { describe, expect, it } from 'vitest';
import { POST as contact } from '@/app/api/contact/route';
import { POST as newsletter } from '@/app/api/newsletter/route';
import { GET as health } from '@/app/api/health/route';
import { getDb } from '@/lib/db';

function post(url: string, body: unknown, headers: Record<string, string> = {}): Request {
  return new Request(`https://7aylabs.com${url}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', host: '7aylabs.com', 'x-real-ip': '203.0.113.9', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

const count = (table: string) => (getDb().prepare(`SELECT COUNT(*) AS n FROM ${table}`).get() as { n: number }).n;

describe('/api/newsletter', () => {
  it('stores a new address and treats a repeat the same way', async () => {
    const before = count('newsletter_subscribers');
    expect((await newsletter(post('/api/newsletter', { email: 'Ada@Example.org', locale: 'es' }))).status).toBe(200);
    expect((await newsletter(post('/api/newsletter', { email: 'ada@example.org' }))).status).toBe(200);
    expect(count('newsletter_subscribers')).toBe(before + 1);
    const row = getDb().prepare('SELECT email, locale FROM newsletter_subscribers WHERE email = ?').get('ada@example.org') as {
      email: string;
      locale: string;
    };
    expect(row.email).toBe('ada@example.org');
  });

  it('rejects a bad or disposable address', async () => {
    expect((await newsletter(post('/api/newsletter', { email: 'nope' }))).status).toBe(400);
    expect((await newsletter(post('/api/newsletter', { email: 'x@mailinator.com' }))).status).toBe(400);
    expect((await newsletter(post('/api/newsletter', 'not json'))).status).toBe(400);
  });

  it('refuses a cross-site post', async () => {
    const res = await newsletter(post('/api/newsletter', { email: 'b@example.org' }, { origin: 'https://evil.example' }));
    expect(res.status).toBe(403);
  });

  it('accepts a same-site post and an allow-listed origin', async () => {
    expect((await newsletter(post('/api/newsletter', { email: 'c@example.org' }, { origin: 'https://7aylabs.com' }))).status).toBe(200);
    process.env.ALLOWED_ORIGINS = 'https://www.7aylabs.com';
    expect((await newsletter(post('/api/newsletter', { email: 'd@example.org' }, { origin: 'https://www.7aylabs.com' }))).status).toBe(200);
    delete process.env.ALLOWED_ORIGINS;
  });

  it('swallows a filled honeypot without storing anything', async () => {
    const before = count('newsletter_subscribers');
    const res = await newsletter(post('/api/newsletter', { email: 'bot@example.org', company: 'ACME' }));
    expect(res.status).toBe(200);
    expect(count('newsletter_subscribers')).toBe(before);
  });

  it('rate limits one address', async () => {
    let last = 200;
    for (let i = 0; i < 12; i++) {
      last = (await newsletter(post('/api/newsletter', { email: `r${i}@example.org` }, { 'x-real-ip': '198.51.100.7' }))).status;
    }
    expect(last).toBe(429);
  });
});

describe('/api/contact', () => {
  const good = { name: 'Ada Lovelace', email: 'ada@example.org', topic: 'press', message: 'Hello, I would like to talk about Vizzor.' };

  it('stores a valid message with a hashed address, never the raw one', async () => {
    const res = await contact(post('/api/contact', good));
    expect(res.status).toBe(200);
    const row = getDb().prepare('SELECT * FROM contact_messages ORDER BY id DESC LIMIT 1').get() as Record<string, string>;
    expect(row.topic).toBe('press');
    expect(row.ip_hash).toMatch(/^[0-9a-f]{32}$/);
    expect(JSON.stringify(row)).not.toContain('203.0.113.9');
  });

  it('strips markup and falls back to a known topic', async () => {
    await contact(post('/api/contact', { ...good, name: '<b>Ada</b>', topic: 'whatever', message: 'A message with <script>alert(1)</script> inside it.' }));
    const row = getDb().prepare('SELECT name, topic, message FROM contact_messages ORDER BY id DESC LIMIT 1').get() as Record<string, string>;
    expect(row.name).toBe('Ada');
    expect(row.topic).toBe('general');
    expect(row.message).not.toContain('<');
  });

  it('rejects missing or too-short fields', async () => {
    expect((await contact(post('/api/contact', { ...good, message: 'short' }))).status).toBe(400);
    expect((await contact(post('/api/contact', { ...good, email: 'bad' }))).status).toBe(400);
    expect((await contact(post('/api/contact', { ...good, name: '' }))).status).toBe(400);
  });

  it('rate limits after five messages a minute', async () => {
    let last = 200;
    for (let i = 0; i < 7; i++) last = (await contact(post('/api/contact', good, { 'x-real-ip': '198.51.100.20' }))).status;
    expect(last).toBe(429);
  });
});

describe('/api/health', () => {
  it('reports healthy with the build sha', async () => {
    process.env.GIT_SHA = 'abc123';
    const res = health();
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ status: 'healthy', sha: 'abc123', subsystems: { sqlite: { ok: true } } });
  });
});
