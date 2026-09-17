import { afterEach, describe, expect, it } from "vitest";

import type { AppSessionUser } from "@/server/auth/session";
import { appRouter } from "@/server/trpc/router";

const originalDatabaseUrl = process.env.DATABASE_URL;

afterEach(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

function makeContext(user: AppSessionUser | null) {
  return {
    requestId: "request-123",
    request: new Request("https://app.test/api/trpc/security.audit_list"),
    user,
  };
}

describe("security audit router", () => {
  it("denies an authenticated non-admin user", async () => {
    const caller = appRouter.createCaller(
      makeContext({
        id: "00000000-0000-4000-8000-000000000001",
        email: "operator@example.test",
        name: "Operator",
        role: "OPERATOR",
      }),
    );

    await expect(caller.security.audit_list({ page: 1, per_page: 20 })).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("returns an explicit unavailable state for an admin without a database", async () => {
    delete process.env.DATABASE_URL;
    const caller = appRouter.createCaller(
      makeContext({
        id: "00000000-0000-4000-8000-000000000002",
        email: "admin@example.test",
        name: "Admin",
        role: "ADMIN",
      }),
    );

    await expect(caller.security.audit_list({ page: 1, per_page: 20 })).resolves.toMatchObject({
      source: "unavailable",
      items: [],
    });
  });
});
