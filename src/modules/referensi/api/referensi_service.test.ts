import { afterEach, describe, expect, it } from "vitest";

import { FixtureReferensiAdapter } from "./referensi_adapter";
import { getProfilPt, getSemester } from "./referensi_service";

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
});
