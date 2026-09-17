import { afterEach, describe, expect, it } from "vitest";

import { getSisterConfigurationStatus } from "./config";

const environmentKeys = [
  "SISTER_FIXTURE_MODE",
  "SISTER_BASE_URL",
  "SISTER_ID_PENGGUNA",
  "SISTER_USERNAME",
  "SISTER_PASSWORD",
  "SISTER_INTEGRATION_ID",
] as const;

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

describe("SISTER configuration status", () => {
  it("reports fixture mode without exposing configuration values", () => {
    process.env.SISTER_FIXTURE_MODE = "true";
    process.env.SISTER_PASSWORD = "should-not-be-returned";

    expect(getSisterConfigurationStatus()).toEqual({
      mode: "fixture",
      configuration: "ready",
    });
  });

  it("reports incomplete live configuration without throwing to the status UI", () => {
    process.env.SISTER_FIXTURE_MODE = "false";
    delete process.env.SISTER_BASE_URL;
    delete process.env.SISTER_ID_PENGGUNA;
    delete process.env.SISTER_USERNAME;
    delete process.env.SISTER_PASSWORD;

    expect(getSisterConfigurationStatus()).toEqual({
      mode: "live",
      configuration: "incomplete",
    });
  });

  it("reports live configuration ready when the required values are present", () => {
    process.env.SISTER_FIXTURE_MODE = "false";
    process.env.SISTER_BASE_URL = "https://sister.example.test/";
    process.env.SISTER_ID_PENGGUNA = "pt-user-uat";
    process.env.SISTER_USERNAME = "uat-user";
    process.env.SISTER_PASSWORD = "uat-password";

    expect(getSisterConfigurationStatus()).toEqual({
      mode: "live",
      configuration: "ready",
    });
  });
});

