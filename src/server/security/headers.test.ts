import { describe, expect, it } from "vitest";

import { getSecurityHeaders } from "./headers";

describe("security headers", () => {
  it("returns a restrictive same-origin policy", () => {
    const headers = getSecurityHeaders(false);
    const values = new Map(headers.map((header) => [header.key, header.value]));

    expect(values.get("Content-Security-Policy")).toContain("default-src 'self'");
    expect(values.get("Content-Security-Policy")).toContain("frame-ancestors 'none'");
    expect(values.get("Content-Security-Policy")).toContain("connect-src 'self'");
    expect(values.get("X-Frame-Options")).toBe("DENY");
    expect(values.has("Strict-Transport-Security")).toBe(false);
  });

  it("adds HSTS only for production responses", () => {
    const headers = getSecurityHeaders(true);
    const hsts = headers.find((header) => header.key === "Strict-Transport-Security");

    expect(hsts?.value).toBe("max-age=31536000; includeSubDomains");
  });
});
