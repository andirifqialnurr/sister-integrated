import { getSisterConfig } from "@/server/sister/config";
import type { PenugasanDetail, PenugasanSummary } from "@/server/sister/types";

import {
  penugasanDetailResponseSchema,
  penugasanListResponseSchema,
  type PenugasanDetailResponse,
  type PenugasanIdInput,
  type PenugasanListResponse,
  type PenugasanSdmInput,
} from "./penugasan_schemas";
import {
  FixturePenugasanAdapter,
  SisterPenugasanAdapter,
  type PenugasanDataSource,
} from "./penugasan_adapter";

function createPenugasanDataSource(): PenugasanDataSource {
  return getSisterConfig().fixture_mode
    ? new FixturePenugasanAdapter()
    : new SisterPenugasanAdapter();
}

function toSafeSummary(item: PenugasanSummary) {
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

function toSafeDetail(item: PenugasanDetail) {
  return {
    id: item.id,
    status_kepegawaian: item.status_kepegawaian,
    ikatan_kerja: item.ikatan_kerja,
    unit_kerja: item.unit_kerja,
    jenjang_pendidikan: item.jenjang_pendidikan,
    perguruan_tinggi: item.perguruan_tinggi,
    tanggal_mulai: item.tanggal_mulai,
    tanggal_keluar: item.tanggal_keluar,
    id_sdm: item.id_sdm,
    surat_tugas: item.surat_tugas,
    tanggal_surat_tugas: item.tanggal_surat_tugas,
    jenis_keluar: item.jenis_keluar,
    id_jenis_keluar: item.id_jenis_keluar,
    id_status_kepegawaian: item.id_status_kepegawaian,
    id_ikatan_kerja: item.id_ikatan_kerja,
    id_perguruan_tinggi: item.id_perguruan_tinggi,
    id_unit_kerja: item.id_unit_kerja,
  };
}

function getSource() {
  return getSisterConfig().fixture_mode ? "fixture" : "sister";
}

export async function getPenugasanList(
  input: PenugasanSdmInput,
  dataSource: PenugasanDataSource = createPenugasanDataSource(),
): Promise<PenugasanListResponse> {
  const items = await dataSource.getList(input);

  return penugasanListResponseSchema.parse({
    items: items.map(toSafeSummary),
    source: getSource(),
    fetched_at: new Date().toISOString(),
  });
}

export async function getPenugasanDetail(
  input: PenugasanIdInput,
  dataSource: PenugasanDataSource = createPenugasanDataSource(),
): Promise<PenugasanDetailResponse> {
  const item = await dataSource.getDetail(input);

  return penugasanDetailResponseSchema.parse({
    item: toSafeDetail(item),
    source: getSource(),
    fetched_at: new Date().toISOString(),
  });
}
