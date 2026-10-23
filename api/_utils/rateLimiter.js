/**
 * In-memory sliding-window rate limiter per client IP.
 * 
 * Serverless note: In serverless environments (like Vercel), state is kept per
 * warm container instance. This provides effective protection against burst spam
 * and rapid hammering without adding external Redis/DB latency.
 */

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;      // max 10 requests per window

const ipHits = new Map();

// Periodic garbage collection to prevent memory leaks in long-running processes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipHits.entries()) {
      if (now - data.startTime > WINDOW_MS * 2) {
        ipHits.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

export function checkRateLimit(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const rawIp = (typeof forwarded === 'string' ? forwarded.split(',')[0] : null) ||
                req.headers['x-real-ip'] ||
                req.socket?.remoteAddress ||
                '127.0.0.1';
  const ip = String(rawIp).trim();

  const now = Date.now();
  let record = ipHits.get(ip);

  if (!record || now - record.startTime > WINDOW_MS) {
    record = { startTime: now, count: 1 };
    ipHits.set(ip, record);
    return { allowed: true, remaining: MAX_REQUESTS - 1, ip };
  }

  if (record.count >= MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil((record.startTime + WINDOW_MS - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
      ip
    };
  }

  record.count += 1;
  return { allowed: true, remaining: MAX_REQUESTS - record.count, ip };
}

export default checkRateLimit;
