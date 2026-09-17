import { afterEach, describe, expect, it } from "vitest";

import { appRouter } from "@/server/trpc/router";

const idSdm = "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62";
const idRiwayatPekerjaan = "c3f00000-0000-4000-8000-000000000001";
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
    requestId: "riwayat-pekerjaan-request-123",
    request: new Request("https://app.test/api/trpc/riwayat_pekerjaan.list"),
    user: {
      id: "00000000-0000-4000-8000-000000000001",
      email: "operator@example.test",
      name: "Operator",
      role: "OPERATOR",
    },
  });
}

describe("Riwayat pekerjaan procedures", () => {
  it("returns list and detail through the protected router", async () => {
    process.env.SISTER_FIXTURE_MODE = "true";
    const caller = makeCaller();

    const [list, detail] = await Promise.all([
      caller.riwayat_pekerjaan.list({ id_sdm: idSdm }),
      caller.riwayat_pekerjaan.get_detail({
        id_riwayat_pekerjaan: idRiwayatPekerjaan,
      }),
    ]);

    expect(list.items[0]?.id).toBe(idRiwayatPekerjaan);
    expect(detail.item.id_sdm).toBe(idSdm);
  });

  it("requires a session before reading work history data", async () => {
    const caller = appRouter.createCaller({
      requestId: "riwayat-pekerjaan-request-unauthenticated",
      request: new Request("https://app.test/api/trpc/riwayat_pekerjaan.list"),
      user: null,
    });

    await expect(caller.riwayat_pekerjaan.list({ id_sdm: idSdm })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});
