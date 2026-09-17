import { SisterNotFoundError } from "@/server/sister/errors";
import { sisterGet } from "@/server/sister/http_client";
import {
  riwayatPekerjaanDetailSchema,
  riwayatPekerjaanSummaryListSchema,
  type RiwayatPekerjaanDetail,
  type RiwayatPekerjaanSummary,
} from "@/server/sister/types";

import type {
  RiwayatPekerjaanIdInput,
  RiwayatPekerjaanSdmInput,
} from "./riwayat_pekerjaan_schemas";

export type RiwayatPekerjaanDataSource = {
  getList(input: RiwayatPekerjaanSdmInput): Promise<RiwayatPekerjaanSummary[]>;
  getDetail(input: RiwayatPekerjaanIdInput): Promise<RiwayatPekerjaanDetail>;
};

const fixtureSdmIds = new Set([
  "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62",
  "4d1f0f7f-8f4f-4b12-9f40-73cc3ca6ed3b",
  "d2f2e4c7-0d62-4ef0-8e88-f0af9e6247c5",
]);

const fixtureSummaries: Record<string, RiwayatPekerjaanSummary[]> = {
  "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62": [
    {
      id: "c3f00000-0000-4000-8000-000000000001",
      jenis_pekerjaan: "Dosen",
      nama_jabatan: "Dosen Tetap",
      instansi: "Perguruan Tinggi Fixture",
      divisi: "Fakultas Teknik",
      mulai_bekerja: "2010-01-01",
      selesai_bekerja: "",
      luar_negeri: false,
      bidang_usaha: "Pendidikan",
    },
  ],
  "4d1f0f7f-8f4f-4b12-9f40-73cc3ca6ed3b": [
    {
      id: "c3f00000-0000-4000-8000-000000000002",
      jenis_pekerjaan: "Tenaga Kependidikan",
      nama_jabatan: "Analis Akademik",
      instansi: "Perguruan Tinggi Fixture",
      divisi: "Biro Akademik",
      mulai_bekerja: "2012-07-01",
      selesai_bekerja: "",
      luar_negeri: false,
      bidang_usaha: "Pendidikan",
    },
  ],
  "d2f2e4c7-0d62-4ef0-8e88-f0af9e6247c5": [],
};

const fixtureDetails: Record<string, RiwayatPekerjaanDetail> = {
  "c3f00000-0000-4000-8000-000000000001": {
    id: "c3f00000-0000-4000-8000-000000000001",
    jenis_pekerjaan: "Dosen",
    nama_jabatan: "Dosen Tetap",
    instansi: "Perguruan Tinggi Fixture",
    divisi: "Fakultas Teknik",
    mulai_bekerja: "2010-01-01",
    selesai_bekerja: "",
    luar_negeri: false,
    bidang_usaha: "Pendidikan",
    id_sdm: "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62",
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
  },
  "c3f00000-0000-4000-8000-000000000002": {
    id: "c3f00000-0000-4000-8000-000000000002",
    jenis_pekerjaan: "Tenaga Kependidikan",
    nama_jabatan: "Analis Akademik",
    instansi: "Perguruan Tinggi Fixture",
    divisi: "Biro Akademik",
    mulai_bekerja: "2012-07-01",
    selesai_bekerja: "",
    luar_negeri: false,
    bidang_usaha: "Pendidikan",
    id_sdm: "4d1f0f7f-8f4f-4b12-9f40-73cc3ca6ed3b",
    id_bidang_usaha: 1,
    id_jenis_pekerjaan: 2,
    deskripsi_kerja: "Mengelola administrasi akademik.",
    dokumen: [],
  },
};

export class FixtureRiwayatPekerjaanAdapter implements RiwayatPekerjaanDataSource {
  async getList(input: RiwayatPekerjaanSdmInput) {
    if (!fixtureSdmIds.has(input.id_sdm)) {
      throw new SisterNotFoundError();
    }

    return fixtureSummaries[input.id_sdm] ?? [];
  }

  async getDetail(input: RiwayatPekerjaanIdInput) {
    const detail = fixtureDetails[input.id_riwayat_pekerjaan];
    if (!detail) {
      throw new SisterNotFoundError();
    }

    return detail;
  }
}

export class SisterRiwayatPekerjaanAdapter implements RiwayatPekerjaanDataSource {
  async getList(input: RiwayatPekerjaanSdmInput) {
    return sisterGet({
      path: "/riwayat_pekerjaan",
      query: { id_sdm: input.id_sdm },
      schema: riwayatPekerjaanSummaryListSchema,
    });
  }

  async getDetail(input: RiwayatPekerjaanIdInput) {
    return sisterGet({
      path: `/riwayat_pekerjaan/${encodeURIComponent(input.id_riwayat_pekerjaan)}`,
      schema: riwayatPekerjaanDetailSchema,
    });
  }
}
