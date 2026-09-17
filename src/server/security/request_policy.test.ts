import { afterEach, describe, expect, it } from "vitest";

import { clearRateLimitBuckets } from "./rate_limiter";
import { prepareTrpcRequest } from "./request_policy";

const environmentKeys = [
  "APP_ALLOWED_ORIGINS",
  "TRUST_PROXY",
  "TRPC_MAX_BODY_BYTES",
  "TRPC_MAX_URL_BYTES",
  "TRPC_RATE_LIMIT_MAX",
  "TRPC_RATE_LIMIT_WINDOW_MS",
] as const;

const originalEnvironment = Object.fromEntries(
  environmentKeys.map((key) => [key, process.env[key]]),
);

afterEach(() => {
  clearRateLimitBuckets();
  for (const key of environmentKeys) {
    const value = originalEnvironment[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

function makeRequest(init?: RequestInit) {
  return new Request("https://app.test/api/trpc/pegawai.search", init);
}

describe("tRPC request policy", () => {
  it("normalizes a request id and allows a same-origin GET", async () => {
    const prepared = await prepareTrpcRequest(
      makeRequest({ headers: { "x-request-id": "request-123" } }),
    );

    expect(prepared.rejection).toBeNull();
    expect(prepared.request_id).toBe("request-123");
    expect(prepared.request.headers.get("x-request-id")).toBe("request-123");
  });

  it("rejects cross-origin browser requests by default", async () => {
    const prepared = await prepareTrpcRequest(
      makeRequest({
        method: "POST",
        headers: {
          "content-type": "application/json",
          origin: "https://evil.test",
        },
        body: "{}",
      }),
    );

    expect(prepared.rejection).toMatchObject({
      status: 403,
      event_type: "csrf_origin_denied",
    });
  });

  it("rejects non-JSON POST requests before tRPC parses them", async () => {
    const prepared = await prepareTrpcRequest(
      makeRequest({
        method: "POST",
        headers: { "content-type": "text/plain" },
        body: "pegawai.search",
      }),
    );

    expect(prepared.rejection).toMatchObject({
      status: 415,
      event_type: "unsupported_media_type",
    });
  });

  it("enforces the actual POST body size when content-length is absent", async () => {
    process.env.TRPC_MAX_BODY_BYTES = "1024";

    const prepared = await prepareTrpcRequest(
      makeRequest({
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ value: "x".repeat(2_000) }),
      }),
    );

    expect(prepared.rejection).toMatchObject({
      status: 413,
      event_type: "request_body_too_large",
    });
  });

  it("blocks a client after the configured rate limit", async () => {
    process.env.TRPC_RATE_LIMIT_MAX = "1";
    process.env.TRPC_RATE_LIMIT_WINDOW_MS = "60000";

    const first = await prepareTrpcRequest(makeRequest());
    const second = await prepareTrpcRequest(makeRequest());

    expect(first.rejection).toBeNull();
    expect(second.rejection).toMatchObject({
      status: 429,
      event_type: "rate_limited",
    });
  });
});

