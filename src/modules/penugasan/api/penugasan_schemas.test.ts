import { describe, expect, it } from "vitest";

import {
  penugasanDetailResponseSchema,
  penugasanIdInputSchema,
  penugasanListResponseSchema,
  penugasanSdmInputSchema,
} from "./penugasan_schemas";

const idSdm = "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62";
const idPenugasan = "b1f00000-0000-4000-8000-000000000001";
const fetchedAt = "2026-09-17T00:00:00.000Z";

const summary = {
  id: idPenugasan,
  status_kepegawaian: "Aktif",
  ikatan_kerja: "Dosen Tetap",
  unit_kerja: "Unit Kerja Fixture",
  jenjang_pendidikan: "S1",
  perguruan_tinggi: "Perguruan Tinggi Fixture",
  tanggal_mulai: "2020-01-01",
  tanggal_keluar: "",
};

describe("Penugasan schemas", () => {
  it("validates SDM and assignment identifiers", () => {
    expect(penugasanSdmInputSchema.parse({ id_sdm: idSdm })).toEqual({ id_sdm: idSdm });
    expect(penugasanIdInputSchema.parse({ id_penugasan: idPenugasan })).toEqual({
      id_penugasan: idPenugasan,
    });
    expect(penugasanIdInputSchema.safeParse({ id_penugasan: "not-a-uuid" }).success).toBe(false);
  });

  it("accepts the documented list response", () => {
    expect(
      penugasanListResponseSchema.parse({
        items: [summary],
        source: "fixture",
        fetched_at: fetchedAt,
      }),
    ).toMatchObject({ items: [summary], source: "fixture" });
  });

  it("rejects undocumented detail fields in the DTO", () => {
    const result = penugasanDetailResponseSchema.safeParse({
      item: {
        ...summary,
        id_sdm: idSdm,
        surat_tugas: "ST/FIXTURE/001",
        tanggal_surat_tugas: "2020-01-01",
        jenis_keluar: "",
        id_jenis_keluar: "",
        id_status_kepegawaian: 1,
        id_ikatan_kerja: "fixture-dosen-tetap",
        id_perguruan_tinggi: "fixture-pt",
        id_unit_kerja: "fixture-unit-kerja",
        undocumented: "must not pass",
      },
      source: "fixture",
      fetched_at: fetchedAt,
    });

    expect(result.success).toBe(false);
  });
});
