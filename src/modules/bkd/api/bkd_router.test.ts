import { afterEach, describe, expect, it } from "vitest";

import { appRouter } from "@/server/trpc/router";

const idSdm = "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62";
const originalFixtureMode = process.env.SISTER_FIXTURE_MODE;

afterEach(() => {
  if (originalFixtureMode === undefined) {
    delete process.env.SISTER_FIXTURE_MODE;
  } else {
    process.env.SISTER_FIXTURE_MODE = originalFixtureMode;
  }
});

function makeCaller() {
  return appRouter.createCaller({
    requestId: "bkd-request-123",
    request: new Request("https://app.test/api/trpc/bkd.pendidikan"),
    user: {
      id: "00000000-0000-4000-8000-000000000001",
      email: "operator@example.test",
      name: "Operator",
      role: "OPERATOR",
    },
  });
}

describe("BKD procedures", () => {
  it("returns the report and activity capabilities through the protected router", async () => {
    process.env.SISTER_FIXTURE_MODE = "true";
    const caller = makeCaller();

    const [report, pendidikan, ajar, tunjang, pengmas, penelitian] = await Promise.all([
      caller.bkd.laporan_akhir({ id_sdm: idSdm }),
      caller.bkd.pendidikan({ id_sdm: idSdm, id_smt: "20251" }),
      caller.bkd.ajar({ id_sdm: idSdm, id_smt: "20251" }),
      caller.bkd.tunjang({ id_sdm: idSdm, id_smt: "20251" }),
      caller.bkd.pengmas({ id_sdm: idSdm, id_smt: "20251" }),
      caller.bkd.penelitian({ id_sdm: idSdm, id_smt: "20251" }),
    ]);

    expect(report.items[0]?.id_smt).toBe("20251");
    expect([pendidikan, ajar, tunjang, pengmas, penelitian].every((item) => item.source === "fixture")).toBe(true);
  });

  it("requires a session before reading BKD", async () => {
    const caller = appRouter.createCaller({
      requestId: "bkd-request-unauthenticated",
      request: new Request("https://app.test/api/trpc/bkd.laporan_akhir"),
      user: null,
    });

    await expect(caller.bkd.laporan_akhir({ id_sdm: idSdm })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});
