import { afterEach, describe, expect, it } from "vitest";

import { appRouter } from "@/server/trpc/router";

const environmentKeys = ["SISTER_FIXTURE_MODE", "DATABASE_URL"] as const;
const originalEnvironment = Object.fromEntries(
  environmentKeys.map((key) => [key, process.env[key]]),
);

afterEach(() => {
  for (const key of environmentKeys) {
    const value = originalEnvironment[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

function makeCaller() {
  return appRouter.createCaller({
    requestId: "request-123",
    request: new Request("https://app.test/api/trpc/overview.status"),
    user: {
      id: "00000000-0000-4000-8000-000000000001",
      email: "operator@example.test",
      name: "Operator",
      role: "OPERATOR",
    },
  });
}

describe("overview status procedure", () => {
  it("returns only safe fixture and local configuration state", async () => {
    process.env.SISTER_FIXTURE_MODE = "true";
    delete process.env.DATABASE_URL;

    await expect(makeCaller().overview.status()).resolves.toMatchObject({
      request_id: "request-123",
      environment: "development",
      auth_mode: "development_fixture",
      session_state: "present",
      database_state: "not_configured",
      sister_mode: "fixture",
      sister_configuration: "ready",
    });
  });

  it("shows incomplete live configuration without returning secret details", async () => {
    process.env.SISTER_FIXTURE_MODE = "false";
    delete process.env.SISTER_BASE_URL;
    delete process.env.SISTER_ID_PENGGUNA;
    delete process.env.SISTER_USERNAME;
    delete process.env.SISTER_PASSWORD;

    await expect(makeCaller().overview.status()).resolves.toMatchObject({
      sister_mode: "live",
      sister_configuration: "incomplete",
    });
  });
});

describe("overview session procedure", () => {
  it("returns only the caller's role, nothing else from the session", async () => {
    await expect(makeCaller().overview.session()).resolves.toEqual({ role: "OPERATOR" });
  });

  it("requires a session", async () => {
    const caller = appRouter.createCaller({
      requestId: "request-unauthenticated",
      request: new Request("https://app.test/api/trpc/overview.session"),
      user: null,
    });

    await expect(caller.overview.session()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});

