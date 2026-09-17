import { afterEach, describe, expect, it } from "vitest";

import { FixturePenugasanAdapter } from "./penugasan_adapter";
import { getPenugasanDetail, getPenugasanList } from "./penugasan_service";

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

describe("Penugasan service", () => {
  it("returns only the documented list fields", async () => {
    process.env.SISTER_FIXTURE_MODE = "true";

    const result = await getPenugasanList(
      { id_sdm: idSdm },
      new FixturePenugasanAdapter(),
    );

    expect(result.source).toBe("fixture");
    expect(result.items[0]).toEqual({
      id: idPenugasan,
      status_kepegawaian: "Aktif",
      ikatan_kerja: "Dosen Tetap",
      unit_kerja: "Unit Kerja Fixture",
      jenjang_pendidikan: "S1",
      perguruan_tinggi: "Perguruan Tinggi Fixture",
      tanggal_mulai: "2020-01-01",
      tanggal_keluar: "",
    });
  });

  it("returns detail fields separately from list metadata", async () => {
    process.env.SISTER_FIXTURE_MODE = "true";

    const result = await getPenugasanDetail(
      { id_penugasan: idPenugasan },
      new FixturePenugasanAdapter(),
    );

    expect(result.item).toMatchObject({
      id: idPenugasan,
      id_sdm: idSdm,
      surat_tugas: "ST/FIXTURE/001",
      id_status_kepegawaian: 1,
    });
    expect(result.item).not.toHaveProperty("source");
  });
});
