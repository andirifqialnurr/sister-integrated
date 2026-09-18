import { z, type ZodType } from "zod";

import { getSisterConfig } from "./config";
import { SisterApiError, SisterContractError } from "./errors";
import { getSisterToken } from "./token_provider";

type RequestOptions<T> = {
  path: string;
  query?: Record<string, string | number | undefined>;
  schema: ZodType<T>;
};

const maxFetchAttempts = 3;
const retryDelayMs = 200;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// GET is safe to retry; this only retries when fetch itself throws (network
// failure, DNS error, timeout abort), never after a response is received —
// an HTTP error status is a completed, non-retriable answer from SISTER.
async function fetchWithBoundedRetry(url: URL, init: RequestInit): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxFetchAttempts; attempt += 1) {
    try {
      return await fetch(url, init);
    } catch (error) {
      lastError = error;
      if (attempt < maxFetchAttempts) {
        await wait(retryDelayMs * attempt);
      }
    }
  }

  throw lastError;
}

function buildSisterUrl(baseUrl: string, path: string, query?: RequestOptions<unknown>["query"]) {
  if (!path.startsWith("/")) {
    throw new Error("SISTER adapter paths must be absolute API paths");
  }

  const base = new URL(baseUrl);
  const url = new URL(path, base);
  if (url.origin !== base.origin || url.protocol !== "https:") {
    throw new Error("SISTER adapter rejected an unsafe URL");
  }

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

export async function sisterGet<T>({ path, query, schema }: RequestOptions<T>): Promise<T> {
  const config = getSisterConfig();
  if (config.fixture_mode || !config.base_url) {
    throw new Error("SISTER live HTTP is not enabled");
  }

  const token = await getSisterToken();
  const response = await fetchWithBoundedRetry(buildSisterUrl(config.base_url, path, query), {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token.token}`,
    },
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
    cache: "no-store",
  });

  if (response.status === 204) {
    throw new SisterContractError("SISTER returned 204 for a JSON read operation");
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new SisterContractError("SISTER read response is not JSON");
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new SisterContractError("SISTER read response could not be parsed");
  }

  if (!response.ok) {
    const errorPayload = z
      .object({ message: z.string().optional(), detail: z.string().optional() })
      .safeParse(payload);
    throw new SisterApiError(
      response.status,
      `SISTER_HTTP_${response.status}`,
      errorPayload.success && errorPayload.data.message
        ? errorPayload.data.message
        : "SISTER request failed",
    );
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new SisterContractError("SISTER read response does not match the documented schema");
  }

  return parsed.data;
}
