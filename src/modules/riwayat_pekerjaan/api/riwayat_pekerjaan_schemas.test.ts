import { describe, expect, it } from "vitest";

import {
  riwayatPekerjaanDetailResponseSchema,
  riwayatPekerjaanIdInputSchema,
  riwayatPekerjaanListResponseSchema,
  riwayatPekerjaanSdmInputSchema,
} from "./riwayat_pekerjaan_schemas";

const idSdm = "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62";
const idRiwayatPekerjaan = "c3f00000-0000-4000-8000-000000000001";
const fetchedAt = "2026-09-17T00:00:00.000Z";

const summary = {
  id: idRiwayatPekerjaan,
  jenis_pekerjaan: "Dosen",
  nama_jabatan: "Dosen Tetap",
  instansi: "Perguruan Tinggi Fixture",
  divisi: "Fakultas Teknik",
  mulai_bekerja: "2010-01-01",
  selesai_bekerja: "",
  luar_negeri: false,
  bidang_usaha: "Pendidikan",
};

const detail = {
  ...summary,
  id_sdm: idSdm,
  id_bidang_usaha: 1,
  id_jenis_pekerjaan: 1,
  deskripsi_kerja: "Mengampu pembelajaran dan kegiatan akademik.",
  dokumen: [
    {
      id: "d3f00000-0000-4000-8000-000000000001",
      nama: "Surat keterangan kerja",
      jenis_dokumen: "Riwayat pekerjaan",
      nama_file: "riwayat-pekerjaan-fixture.pdf",
      jenis_file: "application/pdf",
      tanggal_upload: "2026-09-17T00:00:00.000Z",
      tautan: "",
      keterangan: "Dokumen fixture untuk development",
    },
  ],
};

describe("Riwayat pekerjaan schemas", () => {
  it("validates documented SDM and work history identifiers", () => {
    expect(riwayatPekerjaanSdmInputSchema.parse({ id_sdm: idSdm })).toEqual({
      id_sdm: idSdm,
    });
    expect(
      riwayatPekerjaanIdInputSchema.parse({
        id_riwayat_pekerjaan: idRiwayatPekerjaan,
      }),
    ).toEqual({ id_riwayat_pekerjaan: idRiwayatPekerjaan });
    expect(
      riwayatPekerjaanIdInputSchema.safeParse({
        id_riwayat_pekerjaan: "not-a-uuid",
      }).success,
    ).toBe(false);
  });

  it("keeps list and detail response types aligned with the PDF", () => {
    expect(
      riwayatPekerjaanListResponseSchema.parse({
        items: [summary],
        source: "fixture",
        fetched_at: fetchedAt,
      }),
    ).toMatchObject({ items: [summary], source: "fixture" });

    expect(
      riwayatPekerjaanDetailResponseSchema.parse({
        item: detail,
        source: "fixture",
        fetched_at: fetchedAt,
      }),
    ).toMatchObject({ item: { id: idRiwayatPekerjaan, dokumen: detail.dokumen } });
  });

  it("accepts nullable document link and description metadata", () => {
    const result = riwayatPekerjaanDetailResponseSchema.parse({
      item: {
        ...detail,
        dokumen: detail.dokumen.map((document) => ({
          ...document,
          tautan: null,
          keterangan: null,
        })),
      },
      source: "sister",
      fetched_at: fetchedAt,
    });

    expect(result.item.dokumen[0]).toMatchObject({
      tautan: null,
      keterangan: null,
    });
  });

  it("rejects undocumented fields from the UI DTO", () => {
    const result = riwayatPekerjaanDetailResponseSchema.safeParse({
      item: { ...detail, internal_note: "must not pass" },
      source: "fixture",
      fetched_at: fetchedAt,
    });

    expect(result.success).toBe(false);
  });
});
