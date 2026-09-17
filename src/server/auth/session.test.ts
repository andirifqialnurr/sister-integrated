import { afterEach, describe, expect, it } from "vitest";

import { getCurrentUser } from "./session";

const originalNodeEnv = process.env.NODE_ENV;
const originalFixtureMode = process.env.SISTER_FIXTURE_MODE;
const mutableEnvironment = process.env as Record<string, string | undefined>;

afterEach(() => {
  mutableEnvironment.NODE_ENV = originalNodeEnv;
  if (originalFixtureMode === undefined) {
    delete process.env.SISTER_FIXTURE_MODE;
  } else {
    mutableEnvironment.SISTER_FIXTURE_MODE = originalFixtureMode;
  }
});

describe("development session seam", () => {
  it("provides only the synthetic operator outside production", () => {
    mutableEnvironment.NODE_ENV = "development";
    mutableEnvironment.SISTER_FIXTURE_MODE = "true";

    expect(getCurrentUser()).toMatchObject({
      email: "developer@fixture.local",
      role: "OPERATOR",
    });
  });

  it("never provides the fixture user in production", () => {
    mutableEnvironment.NODE_ENV = "production";
    mutableEnvironment.SISTER_FIXTURE_MODE = "true";

    expect(getCurrentUser()).toBeNull();
  });

  it("allows local fixture mode to be explicitly disabled", () => {
    mutableEnvironment.NODE_ENV = "development";
    mutableEnvironment.SISTER_FIXTURE_MODE = "false";

    expect(getCurrentUser()).toBeNull();
  });
});
