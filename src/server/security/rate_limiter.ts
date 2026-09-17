export type RateLimitConfig = {
  limit: number;
  window_ms: number;
};

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset_at: number;
};

type RateLimitBucket = {
  count: number;
  reset_at: number;
};

const buckets = new Map<string, RateLimitBucket>();

function removeExpiredBuckets(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.reset_at <= now) {
      buckets.delete(key);
    }
  }
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
  now = Date.now(),
): RateLimitResult {
  if (config.limit < 1 || config.window_ms < 1) {
    return {
      allowed: false,
      limit: config.limit,
      remaining: 0,
      reset_at: now + Math.max(config.window_ms, 1),
    };
  }

  removeExpiredBuckets(now);

  const current = buckets.get(key);
  if (!current || current.reset_at <= now) {
    const resetAt = now + config.window_ms;
    buckets.set(key, { count: 1, reset_at: resetAt });

    return {
      allowed: true,
      limit: config.limit,
      remaining: Math.max(config.limit - 1, 0),
      reset_at: resetAt,
    };
  }

  current.count += 1;
  const allowed = current.count <= config.limit;

  return {
    allowed,
    limit: config.limit,
    remaining: Math.max(config.limit - current.count, 0),
    reset_at: current.reset_at,
  };
}

export function clearRateLimitBuckets() {
  buckets.clear();
}

