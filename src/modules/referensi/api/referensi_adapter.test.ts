import { describe, expect, it, vi } from "vitest";

const sisterGetMock = vi.hoisted(() => vi.fn());

vi.mock("@/server/sister/http_client", () => ({
  sisterGet: sisterGetMock,
}));

import { profilPtListSchema, semesterListSchema } from "@/server/sister/types";

import { FixtureReferensiAdapter, SisterReferensiAdapter } from "./referensi_adapter";

describe("FixtureReferensiAdapter", () => {
  it("returns synthetic PT and semester references", async () => {
    const adapter = new FixtureReferensiAdapter();

    await expect(adapter.getProfilPt()).resolves.toMatchObject([
      {
        id: "fixture-pt",
        kode_perguruan_tinggi: "FIXTURE-PT",
        nama_perguruan_tinggi: "Perguruan Tinggi Fixture",
      },
    ]);
    await expect(adapter.getSemester()).resolves.toEqual([
      { id: 20251, nama: "Semester Fixture Ganjil" },
      { id: 20252, nama: "Semester Fixture Genap" },
    ]);
  });
});

describe("SisterReferensiAdapter", () => {
  it("calls only the documented paths without invented query parameters", async () => {
    sisterGetMock.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
    const adapter = new SisterReferensiAdapter();

    await adapter.getProfilPt();
    await adapter.getSemester();

    expect(sisterGetMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        path: "/referensi/profil_pt",
        schema: profilPtListSchema,
      }),
    );
    expect(sisterGetMock.mock.calls[0]?.[0]).not.toHaveProperty("query");
    expect(sisterGetMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        path: "/referensi/semester",
        schema: semesterListSchema,
      }),
    );
    expect(sisterGetMock.mock.calls[1]?.[0]).not.toHaveProperty("query");
  });
});
