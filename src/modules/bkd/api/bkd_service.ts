import { getSisterConfig } from "@/server/sister/config";
import type { BkdActivity, BkdLaporanAkhir } from "@/server/sister/types";

import {
  bkdActivityResponseSchema,
  bkdLaporanAkhirResponseSchema,
  type BkdActivityResponse,
  type BkdLaporanAkhirResponse,
  type BkdSemesterInput,
  type BkdSdmInput,
} from "./bkd_schemas";
import {
  FixtureBkdAdapter,
  SisterBkdAdapter,
  type BkdDataSource,
} from "./bkd_adapter";

function createBkdDataSource(): BkdDataSource {
  return getSisterConfig().fixture_mode ? new FixtureBkdAdapter() : new SisterBkdAdapter();
}

function toSafeLaporanAkhir(item: BkdLaporanAkhir) {
  return {
    id_reg_ptk: item.id_reg_ptk,
    id_smt: item.id_smt,
    sks_kinerja_ajar: item.sks_kinerja_ajar,
    sks_lebih_ajar: item.sks_lebih_ajar,
    sks_kinerja_didik: item.sks_kinerja_didik,
    sks_lebih_didik: item.sks_lebih_didik,
    sks_kinerja_lit: item.sks_kinerja_lit,
    sks_lebih_lit: item.sks_lebih_lit,
    sks_kinerja_pengmas: item.sks_kinerja_pengmas,
    sks_lebih_pengmas: item.sks_lebih_pengmas,
    sks_kinerja_penunjang: item.sks_kinerja_penunjang,
    sks_lebih_tunjang: item.sks_lebih_tunjang,
    sks_kinerja: item.sks_kinerja,
    sks_lebih: item.sks_lebih,
    stat_kewajiban: item.stat_kewajiban,
    stat_tugas: item.stat_tugas,
    stat_belajar: item.stat_belajar,
    id_jabfung: item.id_jabfung,
    simpulan_asesor: item.simpulan_asesor,
  };
}

function toSafeActivity(item: BkdActivity) {
  return {
    nm_sdm: item.nm_sdm,
    nidn: item.nidn,
    id_smt: item.id_smt,
    unsur: item.unsur,
    judul_keg: item.judul_keg,
    id_katgiat: item.id_katgiat,
    nm_kat: item.nm_kat,
    beban_sks: item.beban_sks,
    nilai: item.nilai,
  };
}

function getSource() {
  return getSisterConfig().fixture_mode ? "fixture" : "sister";
}

function getFetchedAt() {
  return new Date().toISOString();
}

export async function getBkdLaporanAkhir(
  input: BkdSdmInput,
  dataSource: BkdDataSource = createBkdDataSource(),
): Promise<BkdLaporanAkhirResponse> {
  const items = await dataSource.getLaporanAkhir(input);

  return bkdLaporanAkhirResponseSchema.parse({
    items: items.map(toSafeLaporanAkhir),
    source: getSource(),
    fetched_at: getFetchedAt(),
  });
}

async function getBkdActivity(
  input: BkdSemesterInput,
  getItems: (dataSource: BkdDataSource) => Promise<BkdActivity[]>,
  dataSource: BkdDataSource = createBkdDataSource(),
): Promise<BkdActivityResponse> {
  const items = await getItems(dataSource);

  return bkdActivityResponseSchema.parse({
    items: items.map(toSafeActivity),
    source: getSource(),
    fetched_at: getFetchedAt(),
  });
}

export function getBkdPendidikan(
  input: BkdSemesterInput,
  dataSource?: BkdDataSource,
) {
  return getBkdActivity(input, (source) => source.getPendidikan(input), dataSource);
}

export function getBkdAjar(input: BkdSemesterInput, dataSource?: BkdDataSource) {
  return getBkdActivity(input, (source) => source.getAjar(input), dataSource);
}

export function getBkdTunjang(input: BkdSemesterInput, dataSource?: BkdDataSource) {
  return getBkdActivity(input, (source) => source.getTunjang(input), dataSource);
}

export function getBkdPengmas(input: BkdSemesterInput, dataSource?: BkdDataSource) {
  return getBkdActivity(input, (source) => source.getPengmas(input), dataSource);
}

export function getBkdPenelitian(input: BkdSemesterInput, dataSource?: BkdDataSource) {
  return getBkdActivity(input, (source) => source.getPenelitian(input), dataSource);
}
