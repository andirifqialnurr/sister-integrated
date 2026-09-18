import { afterEach, describe, expect, it } from "vitest";

import { FixtureReferensiAdapter } from "./referensi_adapter";
import {
  getPerguruanTinggi,
  getProfilPt,
  getSemester,
  getUnitKerja,
  getWilayah,
} from "./referensi_service";

const originalFixtureMode = process.env.SISTER_FIXTURE_MODE;

afterEach(() => {
  if (originalFixtureMode === undefined) {
    delete process.env.SISTER_FIXTURE_MODE;
  } else {
    process.env.SISTER_FIXTURE_MODE = originalFixtureMode;
  }
});

describe("referensi service", () => {
  it("returns the documented PT fields with a source marker", async () => {
    process.env.SISTER_FIXTURE_MODE = "true";

    const result = await getProfilPt(new FixtureReferensiAdapter());

    expect(result.source).toBe("fixture");
    expect(result.items[0]).toEqual({
      id: "fixture-pt",
      kode_perguruan_tinggi: "FIXTURE-PT",
      nama_perguruan_tinggi: "Perguruan Tinggi Fixture",
      telepon: "Data sintetis",
      faximile: "Data sintetis",
      email: "fixture@example.test",
      website: "https://example.test",
      jalan: "Data sintetis",
      dusun: "Data sintetis",
      rt: 0,
      rw: 0,
      kelurahan: "Data sintetis",
      kode_pos: "00000",
      id_wilayah: "fixture",
    });
  });

  it("returns semester IDs and names without adding local metadata to items", async () => {
    process.env.SISTER_FIXTURE_MODE = "true";

    const result = await getSemester(new FixtureReferensiAdapter());

    expect(result.items).toEqual([
      { id: 20251, nama: "Semester Fixture Ganjil" },
      { id: 20252, nama: "Semester Fixture Genap" },
    ]);
    expect(result.items[0]).not.toHaveProperty("source");
    expect(result.items[0]).not.toHaveProperty("fetched_at");
  });

  it("returns wilayah items scoped to the requested level with a source marker", async () => {
    process.env.SISTER_FIXTURE_MODE = "true";

    const result = await getWilayah(1, new FixtureReferensiAdapter());

    expect(result.source).toBe("fixture");
    expect(result.items).toEqual([
      { id: "32", nama: "Jawa Barat (Fixture)", id_induk_wilayah: "ID" },
      { id: "35", nama: "Jawa Timur (Fixture)", id_induk_wilayah: "ID" },
    ]);
  });

  it("returns unit kerja scoped to the requested perguruan tinggi with a source marker", async () => {
    process.env.SISTER_FIXTURE_MODE = "true";
    const adapter = new FixtureReferensiAdapter();

    const perguruanTinggi = await getPerguruanTinggi(adapter);
    const unitKerja = await getUnitKerja(perguruanTinggi.items[0]!.id, adapter);

    expect(perguruanTinggi.source).toBe("fixture");
    expect(unitKerja.source).toBe("fixture");
    expect(unitKerja.items.length).toBeGreaterThan(0);
    expect(unitKerja.items[0]).toEqual({
      id: expect.any(String),
      nama: expect.any(String),
      id_jenis_unit: expect.any(Number),
    });
  });
});
