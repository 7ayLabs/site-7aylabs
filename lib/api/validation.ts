const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const MAX_LENGTHS = {
  email: 254,
  name: 200,
  subject: 300,
  message: 5000,
  interest: 500,
} as const;

const DISPOSABLE_DOMAINS = [
  "tempmail.com",
  "throwaway.email",
  "guerrillamail.com",
  "mailinator.com",
  "yopmail.com",
  "sharklasers.com",
  "trashmail.com",
  "10minutemail.com",
  "guerrillamailblock.com",
  "dispostable.com",
  "maildrop.cc",
  "temp-mail.org",
  "fakeinbox.com",
  "getnada.com",
];

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  if (!EMAIL_REGEX.test(email.trim())) return false;
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  if (DISPOSABLE_DOMAINS.includes(domain)) return false;
  return true;
}

export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  // Strip HTML tags only — React auto-escapes on render, Prisma stores raw strings
  return input.replace(/<[^>]*>/g, "").trim();
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;
const MAX_MAP_SIZE = 10_000;
const CLEANUP_INTERVAL_MS = 5 * 60_000;

// Periodic cleanup to prevent unbounded memory growth
let lastCleanup = Date.now();

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS && rateLimitMap.size < MAX_MAP_SIZE) return;
  lastCleanup = now;
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  cleanupExpiredEntries();

  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) return false;

  entry.count++;
  return true;
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function validateFieldLength(
  value: string | undefined,
  field: keyof typeof MAX_LENGTHS,
): boolean {
  if (value === undefined) return true;
  return value.length <= MAX_LENGTHS[field];
}

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

// CORS is a browser-only protection. Non-browser clients (curl, scripts) never
// send an Origin header, so we allow missing Origin by design. The rate limiter
// and Nginx limit_req are the protection layers against automated abuse.
export function isAllowedOrigin(request: Request): boolean {
  if (ALLOWED_ORIGINS.length === 0) return true;
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return ALLOWED_ORIGINS.includes(origin);
}

export { MAX_LENGTHS };
