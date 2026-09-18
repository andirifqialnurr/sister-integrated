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
    requestId: "pegawai-request-123",
    request: new Request("https://app.test/api/trpc/pegawai.search"),
    user: {
      id: "00000000-0000-4000-8000-000000000001",
      email: "operator@example.test",
      name: "Operator",
      role: "OPERATOR",
    },
  });
}

describe("pegawai procedures", () => {
  it("searches and reads a detail through the protected router", async () => {
    process.env.SISTER_FIXTURE_MODE = "true";
    const caller = makeCaller();

    const search = await caller.pegawai.search({
      search_by: "nama",
      search: "",
      page: 1,
      per_page: 20,
    });

    expect(search.source).toBe("fixture");
    expect(search.items.length).toBeGreaterThan(0);

    const detail = await caller.pegawai.get_detail({
      id_sdm: search.items[0]!.id_sdm,
    });

    expect(detail.source).toBe("fixture");
    expect(detail.summary.id_sdm).toBe(search.items[0]!.id_sdm);
    expect(detail.profile).toBeDefined();
    expect(detail.employment).toBeDefined();
  });

  it("maps an unknown id_sdm to NOT_FOUND instead of a raw error", async () => {
    process.env.SISTER_FIXTURE_MODE = "true";
    const caller = makeCaller();

    await expect(
      caller.pegawai.get_detail({ id_sdm: "00000000-0000-4000-8000-000000000000" }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("rejects a non-UUID id_sdm before it reaches the service layer", async () => {
    process.env.SISTER_FIXTURE_MODE = "true";
    const caller = makeCaller();

    await expect(caller.pegawai.get_detail({ id_sdm: "not-a-uuid" })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });

  it("requires a session before searching or reading a detail", async () => {
    const caller = appRouter.createCaller({
      requestId: "pegawai-request-unauthenticated",
      request: new Request("https://app.test/api/trpc/pegawai.search"),
      user: null,
    });

    await expect(
      caller.pegawai.search({ search_by: "nama", search: "", page: 1, per_page: 20 }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    await expect(
      caller.pegawai.get_detail({ id_sdm: "00000000-0000-4000-8000-000000000000" }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
