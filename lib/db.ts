/**
 * The site's database: one SQLite file.
 *
 * It holds two things, newsletter sign-ups and contact messages. The file
 * lives in `SITE_DATA_DIR` (a Docker volume in production, `./.data` in
 * development) and is created with its tables on first use, so a fresh server
 * needs no migration step.
 *
 * Server-only. Opened lazily so `next build` never touches the disk.
 */
import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

let db: Database.Database | null = null;

export function dataDir(): string {
  return process.env.SITE_DATA_DIR?.trim() || path.join(process.cwd(), '.data');
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  locale TEXT NOT NULL DEFAULT 'en',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  topic TEXT NOT NULL DEFAULT 'general',
  message TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  ip_hash TEXT,
  handled INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS contact_messages_created ON contact_messages (created_at);
`;

export function getDb(): Database.Database {
  if (db) return db;
  const dir = dataDir();
  fs.mkdirSync(dir, { recursive: true });
  const handle = new Database(path.join(dir, 'site.db'));
  handle.pragma('journal_mode = WAL');
  handle.pragma('busy_timeout = 5000');
  handle.pragma('foreign_keys = ON');
  handle.exec(SCHEMA);
  db = handle;
  return handle;
}

/** For tests: drop the handle so the next call opens `SITE_DATA_DIR` afresh. */
export function closeDb(): void {
  db?.close();
  db = null;
}

/** True when the database answers a trivial query. Used by /api/health. */
export function dbHealthy(): boolean {
  try {
    return getDb().prepare('SELECT 1 AS ok').get() !== undefined;
  } catch {
    return false;
  }
}

export function upsertSubscriber(email: string, locale: string): void {
  getDb()
    .prepare(
      `INSERT INTO newsletter_subscribers (email, locale) VALUES (?, ?)
       ON CONFLICT(email) DO UPDATE SET active = 1, locale = excluded.locale,
         updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now')`,
    )
    .run(email, locale);
}

export interface ContactInput {
  name: string;
  email: string;
  topic: string;
  message: string;
  locale: string;
  ipHash: string | null;
}

export function insertContact(c: ContactInput): number {
  const res = getDb()
    .prepare(
      `INSERT INTO contact_messages (name, email, topic, message, locale, ip_hash)
       VALUES (@name, @email, @topic, @message, @locale, @ipHash)`,
    )
    .run(c);
  return Number(res.lastInsertRowid);
}
