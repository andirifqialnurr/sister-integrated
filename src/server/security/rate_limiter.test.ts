import { describe, expect, it } from "vitest";

import { checkRateLimit, clearRateLimitBuckets } from "./rate_limiter";

describe("rate limiter", () => {
  it("allows the configured number of requests and blocks the next one", () => {
    clearRateLimitBuckets();
    const config = { limit: 2, window_ms: 60_000 };

    expect(checkRateLimit("client-a", config, 1_000)).toMatchObject({
      allowed: true,
      remaining: 1,
    });
    expect(checkRateLimit("client-a", config, 1_001)).toMatchObject({
      allowed: true,
      remaining: 0,
    });
    expect(checkRateLimit("client-a", config, 1_002)).toMatchObject({
      allowed: false,
      remaining: 0,
    });
  });

  it("starts a new window after the current bucket expires", () => {
    clearRateLimitBuckets();
    const config = { limit: 1, window_ms: 100 };

    expect(checkRateLimit("client-b", config, 2_000).allowed).toBe(true);
    expect(checkRateLimit("client-b", config, 2_099).allowed).toBe(false);
    expect(checkRateLimit("client-b", config, 2_100)).toMatchObject({
      allowed: true,
      remaining: 0,
    });
  });
});

