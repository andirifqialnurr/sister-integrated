import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const modulesRoot = join(__dirname, "..", "..", "modules");

const forbiddenSubstrings = [
  "bearer",
  "credential_ref",
  "password",
  "SISTER_PASSWORD",
] as const;

function collectFiles(dir: string, predicate: (path: string) => boolean, acc: string[] = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      collectFiles(fullPath, predicate, acc);
    } else if (predicate(fullPath)) {
      acc.push(fullPath);
    }
  }
  return acc;
}

function isRouterOrService(path: string) {
  return (
    (path.endsWith("_router.ts") || path.endsWith("_service.ts")) &&
    !path.endsWith(".test.ts")
  );
}

describe("tRPC router/service output safety", () => {
  it("never references credential, password, or bearer-token fields", () => {
    const files = collectFiles(modulesRoot, isRouterOrService);
    expect(files.length).toBeGreaterThan(0);

    const offenders = files.flatMap((file) => {
      const content = readFileSync(file, "utf8").toLowerCase();
      const hits = forbiddenSubstrings.filter((needle) => content.includes(needle.toLowerCase()));
      return hits.length > 0 ? [{ file, hits }] : [];
    });

    expect(offenders).toEqual([]);
  });

  it("never imports the Prisma client directly (only repository/* may)", () => {
    const files = collectFiles(modulesRoot, isRouterOrService);

    const offenders = files.filter((file) => {
      const content = readFileSync(file, "utf8");
      return content.includes("@prisma/client") || content.includes("server/db/prisma");
    });

    expect(offenders).toEqual([]);
  });
});
