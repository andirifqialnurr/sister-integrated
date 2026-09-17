import { checkRateLimit, type RateLimitResult } from "./rate_limiter";

const defaultMaxBodyBytes = 32 * 1024;
const defaultMaxUrlBytes = 16 * 1024;
const defaultRateLimit = 120;
const defaultRateWindowMs = 60 * 1000;

const allowedMethods = new Set(["GET", "POST"]);

export type RequestPolicyRejection = {
  status: 400 | 403 | 405 | 413 | 415 | 429;
  event_type:
    | "request_rejected"
    | "request_url_too_long"
    | "csrf_origin_denied"
    | "request_body_too_large"
    | "rate_limited"
    | "unsupported_method"
    | "unsupported_media_type";
  message: string;
  retry_after_seconds?: number;
};

export type PreparedTrpcRequest = {
  request: Request;
  request_id: string;
  rejection: RequestPolicyRejection | null;
  rate_limit: RateLimitResult | null;
};

type RequestPolicyConfig = {
  max_body_bytes: number;
  max_url_bytes: number;
  rate_limit: {
    limit: number;
    window_ms: number;
  };
};

function parseBoundedInteger(
  value: string | undefined,
  fallback: number,
  minimum: number,
  maximum: number,
) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum
    ? parsed
    : fallback;
}

function getRequestPolicyConfig(): RequestPolicyConfig {
  return {
    max_body_bytes: parseBoundedInteger(
      process.env.TRPC_MAX_BODY_BYTES,
      defaultMaxBodyBytes,
      1024,
      1024 * 1024,
    ),
    max_url_bytes: parseBoundedInteger(
      process.env.TRPC_MAX_URL_BYTES,
      defaultMaxUrlBytes,
      2048,
      128 * 1024,
    ),
    rate_limit: {
      limit: parseBoundedInteger(
        process.env.TRPC_RATE_LIMIT_MAX,
        defaultRateLimit,
        1,
        10_000,
      ),
      window_ms: parseBoundedInteger(
        process.env.TRPC_RATE_LIMIT_WINDOW_MS,
        defaultRateWindowMs,
        1_000,
        24 * 60 * 60 * 1000,
      ),
    },
  };
}

function getAllowedOrigins(request: Request) {
  const configuredOrigins = process.env.APP_ALLOWED_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (configuredOrigins?.length) {
    return new Set(configuredOrigins);
  }

  return new Set([new URL(request.url).origin]);
}

function getClientKey(request: Request) {
  if (process.env.TRUST_PROXY === "true") {
    const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (forwardedFor && forwardedFor.length <= 128) {
      return `proxy:${forwardedFor}`;
    }

    const realIp = request.headers.get("x-real-ip")?.trim();
    if (realIp && realIp.length <= 128) {
      return `proxy:${realIp}`;
    }
  }

  // Without a verified proxy, do not trust spoofable client IP headers.
  return "direct";
}

export function getSafeRequestId(request: Request) {
  const supplied = request.headers.get("x-request-id");

  if (supplied && /^[A-Za-z0-9._:-]{1,128}$/.test(supplied)) {
    return supplied;
  }

  return crypto.randomUUID();
}

function getPolicyRejection(
  request: Request,
  config: RequestPolicyConfig,
): RequestPolicyRejection | null {
  if (!allowedMethods.has(request.method)) {
    return {
      status: 405,
      event_type: "unsupported_method",
      message: "Method tidak diizinkan",
    };
  }

  if (request.url.length > config.max_url_bytes) {
    return {
      status: 413,
      event_type: "request_url_too_long",
      message: "Permintaan terlalu besar",
    };
  }

  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url).origin;
  const allowedOrigins = getAllowedOrigins(request);
  const fetchSite = request.headers.get("sec-fetch-site");

  if (
    (origin && origin !== requestOrigin && !allowedOrigins.has(origin)) ||
    fetchSite === "cross-site"
  ) {
    return {
      status: 403,
      event_type: "csrf_origin_denied",
      message: "Origin permintaan tidak diizinkan",
    };
  }

  if (request.method === "POST") {
    const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
    if (!contentType.includes("application/json")) {
      return {
        status: 415,
        event_type: "unsupported_media_type",
        message: "Content-Type harus application/json",
      };
    }

    const contentLengthHeader = request.headers.get("content-length");
    if (contentLengthHeader) {
      const contentLength = Number(contentLengthHeader);
      if (!Number.isSafeInteger(contentLength) || contentLength < 0) {
        return {
          status: 400,
          event_type: "request_rejected",
          message: "Content-Length tidak valid",
        };
      }

      if (contentLength > config.max_body_bytes) {
        return {
          status: 413,
          event_type: "request_body_too_large",
          message: "Permintaan terlalu besar",
        };
      }
    }
  }

  return null;
}

function withRequestId(request: Request, requestId: string, body?: ArrayBuffer) {
  const headers = new Headers(request.headers);
  headers.set("x-request-id", requestId);

  return new Request(request.url, {
    method: request.method,
    body: body && body.byteLength > 0 ? body : undefined,
    headers,
  });
}

export async function prepareTrpcRequest(request: Request): Promise<PreparedTrpcRequest> {
  const requestId = getSafeRequestId(request);
  const policyConfig = getRequestPolicyConfig();
  const baseRejection = getPolicyRejection(request, policyConfig);

  if (baseRejection) {
    return {
      request: withRequestId(request, requestId),
      request_id: requestId,
      rejection: baseRejection,
      rate_limit: null,
    };
  }

  const rateLimit = checkRateLimit(getClientKey(request), policyConfig.rate_limit);
  if (!rateLimit.allowed) {
    return {
      request: withRequestId(request, requestId),
      request_id: requestId,
      rejection: {
        status: 429,
        event_type: "rate_limited",
        message: "Terlalu banyak permintaan",
        retry_after_seconds: Math.max(
          Math.ceil((rateLimit.reset_at - Date.now()) / 1000),
          1,
        ),
      },
      rate_limit: rateLimit,
    };
  }

  if (request.method === "POST") {
    const body = await request.clone().arrayBuffer();
    if (body.byteLength > policyConfig.max_body_bytes) {
      return {
        request: withRequestId(request, requestId),
        request_id: requestId,
        rejection: {
          status: 413,
          event_type: "request_body_too_large",
          message: "Permintaan terlalu besar",
        },
        rate_limit: rateLimit,
      };
    }

    return {
      request: withRequestId(request, requestId, body),
      request_id: requestId,
      rejection: null,
      rate_limit: rateLimit,
    };
  }

  return {
    request: withRequestId(request, requestId),
    request_id: requestId,
    rejection: null,
    rate_limit: rateLimit,
  };
}

export function makePolicyResponse(
  rejection: RequestPolicyRejection,
  requestId: string,
  rateLimit: RateLimitResult | null,
) {
  const headers = new Headers({
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8",
    "x-content-type-options": "nosniff",
    "x-request-id": requestId,
  });

  if (rateLimit) {
    headers.set("x-ratelimit-limit", String(rateLimit.limit));
    headers.set("x-ratelimit-remaining", String(rateLimit.remaining));
    headers.set("x-ratelimit-reset", String(Math.ceil(rateLimit.reset_at / 1000)));
  }

  if (rejection.retry_after_seconds) {
    headers.set("retry-after", String(rejection.retry_after_seconds));
  }

  if (rejection.status === 405) {
    headers.set("allow", "GET, POST");
  }

  return new Response(
    JSON.stringify({
      error: rejection.message,
      request_id: requestId,
    }),
    { status: rejection.status, headers },
  );
}
