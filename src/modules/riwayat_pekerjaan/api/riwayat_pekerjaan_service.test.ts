import { afterEach, describe, expect, it } from "vitest";

import { FixtureRiwayatPekerjaanAdapter } from "./riwayat_pekerjaan_adapter";
import {
  getRiwayatPekerjaanDetail,
  getRiwayatPekerjaanList,
} from "./riwayat_pekerjaan_service";

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

describe("Riwayat pekerjaan service", () => {
  it("returns only documented list fields", async () => {
    process.env.SISTER_FIXTURE_MODE = "true";

    const result = await getRiwayatPekerjaanList(
      { id_sdm: idSdm },
      new FixtureRiwayatPekerjaanAdapter(),
    );

    expect(result.source).toBe("fixture");
    expect(result.items[0]).toEqual({
      id: idRiwayatPekerjaan,
      jenis_pekerjaan: "Dosen",
      nama_jabatan: "Dosen Tetap",
      instansi: "Perguruan Tinggi Fixture",
      divisi: "Fakultas Teknik",
      mulai_bekerja: "2010-01-01",
      selesai_bekerja: "",
      luar_negeri: false,
      bidang_usaha: "Pendidikan",
    });
  });

  it("keeps detail documents inside the documented detail DTO", async () => {
    process.env.SISTER_FIXTURE_MODE = "true";

    const result = await getRiwayatPekerjaanDetail(
      { id_riwayat_pekerjaan: idRiwayatPekerjaan },
      new FixtureRiwayatPekerjaanAdapter(),
    );

    expect(result.item).toMatchObject({
      id: idRiwayatPekerjaan,
      id_sdm: idSdm,
      id_bidang_usaha: 1,
      dokumen: [{ jenis_file: "application/pdf" }],
    });
    expect(result.item).not.toHaveProperty("source");
  });
});
