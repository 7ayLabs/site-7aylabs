import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeEach } from 'vitest';

// Every test file gets its own throwaway database directory.
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'site-7aylabs-test-'));
process.env.SITE_DATA_DIR = dir;
process.env.RATE_LIMIT_SALT = 'test-salt-long-enough-to-sign-with';
delete process.env.RESEND_API_KEY;
delete process.env.ALLOWED_ORIGINS;

beforeEach(async () => {
  const { resetRateLimits } = await import('@/lib/api/validation');
  resetRateLimits();
});

afterAll(async () => {
  const { closeDb } = await import('@/lib/db');
  closeDb();
  fs.rmSync(dir, { recursive: true, force: true });
});
