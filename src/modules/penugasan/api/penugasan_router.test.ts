import { afterEach, describe, expect, it } from "vitest";

import { appRouter } from "@/server/trpc/router";

const idSdm = "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62";
const idPenugasan = "b1f00000-0000-4000-8000-000000000001";
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
    requestId: "penugasan-request-123",
    request: new Request("https://app.test/api/trpc/penugasan.list"),
    user: {
      id: "00000000-0000-4000-8000-000000000001",
      email: "operator@example.test",
      name: "Operator",
      role: "OPERATOR",
    },
  });
}

describe("Penugasan procedures", () => {
  it("returns list and detail through the protected router", async () => {
    process.env.SISTER_FIXTURE_MODE = "true";
    const caller = makeCaller();

    const [list, detail] = await Promise.all([
      caller.penugasan.list({ id_sdm: idSdm }),
      caller.penugasan.get_detail({ id_penugasan: idPenugasan }),
    ]);

    expect(list.items[0]?.id).toBe(idPenugasan);
    expect(detail.item.id_sdm).toBe(idSdm);
  });

  it("requires a session before reading penugasan", async () => {
    const caller = appRouter.createCaller({
      requestId: "penugasan-request-unauthenticated",
      request: new Request("https://app.test/api/trpc/penugasan.list"),
      user: null,
    });

    await expect(caller.penugasan.list({ id_sdm: idSdm })).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});
