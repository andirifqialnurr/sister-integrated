import { afterEach, describe, expect, it } from "vitest";

import { appRouter } from "@/server/trpc/router";

const idSdm = "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62";
const idPendidikanFormal = "c2f00000-0000-4000-8000-000000000001";
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
    requestId: "pendidikan-formal-request-123",
    request: new Request("https://app.test/api/trpc/pendidikan_formal.list"),
    user: {
      id: "00000000-0000-4000-8000-000000000001",
      email: "operator@example.test",
      name: "Operator",
      role: "OPERATOR",
    },
  });
}

describe("Pendidikan formal procedures", () => {
  it("returns list and detail through the protected router", async () => {
    process.env.SISTER_FIXTURE_MODE = "true";
    const caller = makeCaller();

    const [list, detail] = await Promise.all([
      caller.pendidikan_formal.list({ id_sdm: idSdm }),
      caller.pendidikan_formal.get_detail({
        id_pendidikan_formal: idPendidikanFormal,
      }),
    ]);

    expect(list.items[0]?.id).toBe(idPendidikanFormal);
    expect(detail.item.id_sdm).toBe(idSdm);
  });

  it("requires a session before reading education data", async () => {
    const caller = appRouter.createCaller({
      requestId: "pendidikan-formal-request-unauthenticated",
      request: new Request("https://app.test/api/trpc/pendidikan_formal.list"),
      user: null,
    });

    await expect(caller.pendidikan_formal.list({ id_sdm: idSdm })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});
