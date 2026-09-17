import { SisterNotFoundError } from "@/server/sister/errors";
import { sisterGet } from "@/server/sister/http_client";
import {
  penugasanDetailSchema,
  penugasanSummaryListSchema,
  type PenugasanDetail,
  type PenugasanSummary,
} from "@/server/sister/types";

import type { PenugasanIdInput, PenugasanSdmInput } from "./penugasan_schemas";

export type PenugasanDataSource = {
  getList(input: PenugasanSdmInput): Promise<PenugasanSummary[]>;
  getDetail(input: PenugasanIdInput): Promise<PenugasanDetail>;
};

const fixturePenugasan: Record<string, PenugasanDetail> = {
  "b1f00000-0000-4000-8000-000000000001": {
    id: "b1f00000-0000-4000-8000-000000000001",
    status_kepegawaian: "Aktif",
    ikatan_kerja: "Dosen Tetap",
    unit_kerja: "Unit Kerja Fixture",
    jenjang_pendidikan: "S1",
    perguruan_tinggi: "Perguruan Tinggi Fixture",
    tanggal_mulai: "2020-01-01",
    tanggal_keluar: "",
    id_sdm: "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62",
    surat_tugas: "ST/FIXTURE/001",
    tanggal_surat_tugas: "2020-01-01",
    jenis_keluar: "",
    id_jenis_keluar: "",
    id_status_kepegawaian: 1,
    id_ikatan_kerja: "fixture-dosen-tetap",
    id_perguruan_tinggi: "fixture-pt",
    id_unit_kerja: "fixture-unit-kerja",
  },
  "b1f00000-0000-4000-8000-000000000002": {
    id: "b1f00000-0000-4000-8000-000000000002",
    status_kepegawaian: "Aktif",
    ikatan_kerja: "Tenaga Kependidikan",
    unit_kerja: "Unit Kerja Fixture",
    jenjang_pendidikan: "S1",
    perguruan_tinggi: "Perguruan Tinggi Fixture",
    tanggal_mulai: "2021-07-01",
    tanggal_keluar: "",
    id_sdm: "4d1f0f7f-8f4f-4b12-9f40-73cc3ca6ed3b",
    surat_tugas: "ST/FIXTURE/002",
    tanggal_surat_tugas: "2021-07-01",
    jenis_keluar: "",
    id_jenis_keluar: "",
    id_status_kepegawaian: 1,
    id_ikatan_kerja: "fixture-tendik",
    id_perguruan_tinggi: "fixture-pt",
    id_unit_kerja: "fixture-unit-kerja",
  },
  "b1f00000-0000-4000-8000-000000000003": {
    id: "b1f00000-0000-4000-8000-000000000003",
    status_kepegawaian: "Aktif",
    ikatan_kerja: "Dosen Tetap",
    unit_kerja: "Unit Kerja Fixture",
    jenjang_pendidikan: "S2",
    perguruan_tinggi: "Perguruan Tinggi Fixture",
    tanggal_mulai: "2022-01-01",
    tanggal_keluar: "",
    id_sdm: "d2f2e4c7-0d62-4ef0-8e88-f0af9e6247c5",
    surat_tugas: "ST/FIXTURE/003",
    tanggal_surat_tugas: "2022-01-01",
    jenis_keluar: "",
    id_jenis_keluar: "",
    id_status_kepegawaian: 1,
    id_ikatan_kerja: "fixture-dosen-tetap",
    id_perguruan_tinggi: "fixture-pt",
    id_unit_kerja: "fixture-unit-kerja",
  },
};

const fixtureSdmIds = new Set(Object.values(fixturePenugasan).map((item) => item.id_sdm));

function toSummary(item: PenugasanDetail): PenugasanSummary {
  return {
    id: item.id,
    status_kepegawaian: item.status_kepegawaian,
    ikatan_kerja: item.ikatan_kerja,
    unit_kerja: item.unit_kerja,
    jenjang_pendidikan: item.jenjang_pendidikan,
    perguruan_tinggi: item.perguruan_tinggi,
    tanggal_mulai: item.tanggal_mulai,
    tanggal_keluar: item.tanggal_keluar,
  };
}

export class FixturePenugasanAdapter implements PenugasanDataSource {
  async getList(input: PenugasanSdmInput) {
    if (!fixtureSdmIds.has(input.id_sdm)) {
      throw new SisterNotFoundError();
    }

    return Object.values(fixturePenugasan)
      .filter((item) => item.id_sdm === input.id_sdm)
      .map(toSummary);
  }

  async getDetail(input: PenugasanIdInput) {
    const detail = fixturePenugasan[input.id_penugasan];
    if (!detail) {
      throw new SisterNotFoundError();
    }

    return detail;
  }
}

export class SisterPenugasanAdapter implements PenugasanDataSource {
  async getList(input: PenugasanSdmInput) {
    return sisterGet({
      path: "/penugasan",
      query: { id_sdm: input.id_sdm },
      schema: penugasanSummaryListSchema,
    });
  }

  async getDetail(input: PenugasanIdInput) {
    return sisterGet({
      path: `/penugasan/${encodeURIComponent(input.id_penugasan)}`,
      schema: penugasanDetailSchema,
    });
  }
}
