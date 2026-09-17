import { getSisterConfig } from "@/server/sister/config";
import type {
  PendidikanFormalDetail,
  PendidikanFormalSummary,
} from "@/server/sister/types";

import {
  pendidikanFormalDetailResponseSchema,
  pendidikanFormalListResponseSchema,
  type PendidikanFormalDetailResponse,
  type PendidikanFormalIdInput,
  type PendidikanFormalListResponse,
  type PendidikanFormalSdmInput,
} from "./pendidikan_formal_schemas";
import {
  FixturePendidikanFormalAdapter,
  SisterPendidikanFormalAdapter,
  type PendidikanFormalDataSource,
} from "./pendidikan_formal_adapter";

function createPendidikanFormalDataSource(): PendidikanFormalDataSource {
  return getSisterConfig().fixture_mode
    ? new FixturePendidikanFormalAdapter()
    : new SisterPendidikanFormalAdapter();
}

function toSafeSummary(item: PendidikanFormalSummary) {
  return {
    id: item.id,
    jenjang_pendidikan: item.jenjang_pendidikan,
    gelar_akademik: item.gelar_akademik,
    bidang_studi: item.bidang_studi,
    nama_perguruan_tinggi: item.nama_perguruan_tinggi,
    tahun_lulus: item.tahun_lulus,
    jenis_ajuan: item.jenis_ajuan,
  };
}

function toSafeDetail(item: PendidikanFormalDetail) {
  return {
    id: item.id,
    jenjang_pendidikan: item.jenjang_pendidikan,
    gelar_akademik: item.gelar_akademik,
    bidang_studi: item.bidang_studi,
    nama_perguruan_tinggi: item.nama_perguruan_tinggi,
    tahun_lulus: item.tahun_lulus,
    jenis_ajuan: item.jenis_ajuan,
    kategori_kegiatan: item.kategori_kegiatan,
    id_sdm: item.id_sdm,
    id_program_studi: item.id_program_studi,
    nama_program_studi: item.nama_program_studi,
    id_jenjang_pendidikan: item.id_jenjang_pendidikan,
    id_gelar_akademik: item.id_gelar_akademik,
    id_bidang_studi: item.id_bidang_studi,
    tahun_masuk: item.tahun_masuk,
    tanggal_lulus: item.tanggal_lulus,
    nomor_induk: item.nomor_induk,
    jumlah_semester: item.jumlah_semester,
    jumlah_sks: item.jumlah_sks,
    ipk: item.ipk,
    sk_penyetaraan: item.sk_penyetaraan,
    tanggal_sk_penyetaraan: item.tanggal_sk_penyetaraan,
    nomor_ijazah: item.nomor_ijazah,
    judul_tugas_akhir: item.judul_tugas_akhir,
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

export async function getPendidikanFormalList(
  input: PendidikanFormalSdmInput,
  dataSource: PendidikanFormalDataSource = createPendidikanFormalDataSource(),
): Promise<PendidikanFormalListResponse> {
  const items = await dataSource.getList(input);

  return pendidikanFormalListResponseSchema.parse({
    items: items.map(toSafeSummary),
    source: getSource(),
    fetched_at: new Date().toISOString(),
  });
}

export async function getPendidikanFormalDetail(
  input: PendidikanFormalIdInput,
  dataSource: PendidikanFormalDataSource = createPendidikanFormalDataSource(),
): Promise<PendidikanFormalDetailResponse> {
  const item = await dataSource.getDetail(input);

  return pendidikanFormalDetailResponseSchema.parse({
    item: toSafeDetail(item),
    source: getSource(),
    fetched_at: new Date().toISOString(),
  });
}
