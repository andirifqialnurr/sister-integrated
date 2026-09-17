export type AppRole = "ADMIN" | "OPERATOR" | "REVIEWER" | "VIEWER";

export type AppSessionUser = {
  id: string;
  email: string;
  name: string;
  role: AppRole;
};

const developmentFixtureUser: AppSessionUser = {
  id: "00000000-0000-4000-8000-000000000001",
  email: "developer@fixture.local",
  name: "Developer Fixture",
  role: "OPERATOR",
};

/**
 * This is deliberately only a development seam. A real session provider must
 * replace it before any deployment that can expose SISTER or PII data.
 */
export function getCurrentUser(): AppSessionUser | null {
  const fixtureEnabled = process.env.SISTER_FIXTURE_MODE !== "false";

  if (process.env.NODE_ENV !== "production" && fixtureEnabled) {
    return developmentFixtureUser;
  }

  return null;
}
