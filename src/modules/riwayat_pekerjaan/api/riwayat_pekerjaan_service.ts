import { getSisterConfig } from "@/server/sister/config";
import type {
  RiwayatPekerjaanDetail,
  RiwayatPekerjaanSummary,
} from "@/server/sister/types";

import {
  FixtureRiwayatPekerjaanAdapter,
  SisterRiwayatPekerjaanAdapter,
  type RiwayatPekerjaanDataSource,
} from "./riwayat_pekerjaan_adapter";
import {
  riwayatPekerjaanDetailResponseSchema,
  riwayatPekerjaanListResponseSchema,
  type RiwayatPekerjaanDetailResponse,
  type RiwayatPekerjaanIdInput,
  type RiwayatPekerjaanListResponse,
  type RiwayatPekerjaanSdmInput,
} from "./riwayat_pekerjaan_schemas";

function createRiwayatPekerjaanDataSource(): RiwayatPekerjaanDataSource {
  return getSisterConfig().fixture_mode
    ? new FixtureRiwayatPekerjaanAdapter()
    : new SisterRiwayatPekerjaanAdapter();
}

function toSafeSummary(item: RiwayatPekerjaanSummary) {
  return {
    id: item.id,
    jenis_pekerjaan: item.jenis_pekerjaan,
    nama_jabatan: item.nama_jabatan,
    instansi: item.instansi,
    divisi: item.divisi,
    mulai_bekerja: item.mulai_bekerja,
    selesai_bekerja: item.selesai_bekerja,
    luar_negeri: item.luar_negeri,
    bidang_usaha: item.bidang_usaha,
  };
}

function toSafeDetail(item: RiwayatPekerjaanDetail) {
  return {
    ...toSafeSummary(item),
    id_sdm: item.id_sdm,
    id_bidang_usaha: item.id_bidang_usaha,
    id_jenis_pekerjaan: item.id_jenis_pekerjaan,
    deskripsi_kerja: item.deskripsi_kerja,
    dokumen: item.dokumen.map((document) => ({
      id: document.id,
      nama: document.nama,
      jenis_dokumen: document.jenis_dokumen,
      nama_file: document.nama_file,
      jenis_file: document.jenis_file,
      tanggal_upload: document.tanggal_upload,
      tautan: document.tautan,
      keterangan: document.keterangan,
    })),
  };
}

function getSource() {
  return getSisterConfig().fixture_mode ? "fixture" : "sister";
}

export async function getRiwayatPekerjaanList(
  input: RiwayatPekerjaanSdmInput,
  dataSource: RiwayatPekerjaanDataSource = createRiwayatPekerjaanDataSource(),
): Promise<RiwayatPekerjaanListResponse> {
  const items = await dataSource.getList(input);

  return riwayatPekerjaanListResponseSchema.parse({
    items: items.map(toSafeSummary),
    source: getSource(),
    fetched_at: new Date().toISOString(),
  });
}

export async function getRiwayatPekerjaanDetail(
  input: RiwayatPekerjaanIdInput,
  dataSource: RiwayatPekerjaanDataSource = createRiwayatPekerjaanDataSource(),
): Promise<RiwayatPekerjaanDetailResponse> {
  const item = await dataSource.getDetail(input);

  return riwayatPekerjaanDetailResponseSchema.parse({
    item: toSafeDetail(item),
    source: getSource(),
    fetched_at: new Date().toISOString(),
  });
}
