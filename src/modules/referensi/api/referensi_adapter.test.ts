import { describe, expect, it, vi } from "vitest";

const sisterGetMock = vi.hoisted(() => vi.fn());

vi.mock("@/server/sister/http_client", () => ({
  sisterGet: sisterGetMock,
}));

import {
  perguruanTinggiListSchema,
  profilPtListSchema,
  semesterListSchema,
  unitKerjaListSchema,
  wilayahListSchema,
} from "@/server/sister/types";

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

  it("returns nested wilayah levels linked by id_induk_wilayah", async () => {
    const adapter = new FixtureReferensiAdapter();

    const negara = await adapter.getWilayah(0);
    const provinsi = await adapter.getWilayah(1);

    expect(negara).toEqual([{ id: "ID", nama: "Indonesia (Fixture)", id_induk_wilayah: "" }]);
    expect(provinsi.every((item) => item.id_induk_wilayah === negara[0]?.id)).toBe(true);
  });

  it("returns unit kerja scoped to the requested perguruan tinggi", async () => {
    const adapter = new FixtureReferensiAdapter();

    const perguruanTinggi = await adapter.getPerguruanTinggi();
    const unitKerja = await adapter.getUnitKerja(perguruanTinggi[0]!.id);
    const unknownPtUnitKerja = await adapter.getUnitKerja("00000000-0000-4000-8000-000000000000");

    expect(perguruanTinggi.length).toBeGreaterThan(0);
    expect(unitKerja.length).toBeGreaterThan(0);
    expect(unknownPtUnitKerja).toEqual([]);
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

  it("sends id_level_wilayah as the only documented query parameter", async () => {
    sisterGetMock.mockResolvedValueOnce([]);
    const adapter = new SisterReferensiAdapter();

    await adapter.getWilayah(2);

    expect(sisterGetMock).toHaveBeenCalledWith({
      path: "/referensi/wilayah",
      query: { id_level_wilayah: 2 },
      schema: wilayahListSchema,
    });
  });

  it("calls unit_kerja with only id_perguruan_tinggi and no invented parameters", async () => {
    sisterGetMock.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
    const adapter = new SisterReferensiAdapter();
    const callsBefore = sisterGetMock.mock.calls.length;

    await adapter.getPerguruanTinggi();
    await adapter.getUnitKerja("11111111-1111-4111-8111-111111111111");

    const [perguruanTinggiCall, unitKerjaCall] = sisterGetMock.mock.calls.slice(callsBefore);
    expect(perguruanTinggiCall?.[0]).toEqual({
      path: "/referensi/perguruan_tinggi",
      schema: perguruanTinggiListSchema,
    });
    expect(unitKerjaCall?.[0]).toEqual({
      path: "/referensi/unit_kerja",
      query: { id_perguruan_tinggi: "11111111-1111-4111-8111-111111111111" },
      schema: unitKerjaListSchema,
    });
  });
});
