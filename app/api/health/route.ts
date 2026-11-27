import { dbHealthy } from '@/lib/db';
import { json } from '@/lib/api/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Liveness for the container healthcheck and the deploy smoke test.
 * `sha` is the commit the image was built from: the deploy compares it with
 * the commit it just shipped, which catches a server that silently kept
 * running the previous image.
 */
export function GET(): Response {
  const sqlite = dbHealthy();
  return json(
    {
      status: sqlite ? 'healthy' : 'degraded',
      sha: process.env.GIT_SHA || 'dev',
      builtAt: process.env.BUILD_TIME || null,
      subsystems: { sqlite: { ok: sqlite } },
    },
    sqlite ? 200 : 503,
  );
}
