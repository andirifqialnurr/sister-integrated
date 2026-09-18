import { afterEach, describe, expect, it } from "vitest";

import { appRouter } from "@/server/trpc/router";

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
    requestId: "referensi-request-123",
    request: new Request("https://app.test/api/trpc/referensi.get_semester"),
    user: {
      id: "00000000-0000-4000-8000-000000000001",
      email: "operator@example.test",
      name: "Operator",
      role: "OPERATOR",
    },
  });
}

describe("referensi procedures", () => {
  it("returns both read-only references through the protected router", async () => {
    process.env.SISTER_FIXTURE_MODE = "true";

    const caller = makeCaller();
    const [profilPt, semester, wilayah] = await Promise.all([
      caller.referensi.get_profil_pt({}),
      caller.referensi.get_semester({}),
      caller.referensi.get_wilayah({ id_level_wilayah: 0 }),
    ]);

    expect(profilPt.source).toBe("fixture");
    expect(profilPt.items[0]?.nama_perguruan_tinggi).toBe("Perguruan Tinggi Fixture");
    expect(semester.source).toBe("fixture");
    expect(semester.items[0]).toEqual({ id: 20251, nama: "Semester Fixture Ganjil" });
    expect(wilayah.source).toBe("fixture");
    expect(wilayah.items[0]).toEqual({
      id: "ID",
      nama: "Indonesia (Fixture)",
      id_induk_wilayah: "",
    });
  });

  it("rejects id_level_wilayah outside the documented enum", async () => {
    process.env.SISTER_FIXTURE_MODE = "true";

    const caller = makeCaller();

    await expect(
      caller.referensi.get_wilayah({ id_level_wilayah: 4 as never }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("requires a session before reading references", async () => {
    const caller = appRouter.createCaller({
      requestId: "referensi-request-unauthenticated",
      request: new Request("https://app.test/api/trpc/referensi.get_semester"),
      user: null,
    });

    await expect(caller.referensi.get_semester({})).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });
});
