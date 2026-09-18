import { getSisterConfig } from "@/server/sister/config";
import type { PerguruanTinggi, ProfilPt, Semester, UnitKerja, Wilayah } from "@/server/sister/types";

import {
  referensiPerguruanTinggiResponseSchema,
  referensiProfilPtResponseSchema,
  referensiSemesterResponseSchema,
  referensiUnitKerjaResponseSchema,
  referensiWilayahResponseSchema,
  type ReferensiPerguruanTinggiResponse,
  type ReferensiProfilPtResponse,
  type ReferensiSemesterResponse,
  type ReferensiUnitKerjaResponse,
  type ReferensiWilayahResponse,
} from "../schema/referensi_schemas";
import {
  FixtureReferensiAdapter,
  SisterReferensiAdapter,
  type ReferensiDataSource,
  type WilayahLevel,
} from "./referensi_adapter";

function createReferensiDataSource(): ReferensiDataSource {
  return getSisterConfig().fixture_mode
    ? new FixtureReferensiAdapter()
    : new SisterReferensiAdapter();
}

function toSafeProfilPt(profile: ProfilPt) {
  return {
    id: profile.id,
    kode_perguruan_tinggi: profile.kode_perguruan_tinggi,
    nama_perguruan_tinggi: profile.nama_perguruan_tinggi,
    telepon: profile.telepon,
    faximile: profile.faximile,
    email: profile.email,
    website: profile.website,
    jalan: profile.jalan,
    dusun: profile.dusun,
    rt: profile.rt,
    rw: profile.rw,
    kelurahan: profile.kelurahan,
    kode_pos: profile.kode_pos,
    id_wilayah: profile.id_wilayah,
  };
}

function toSafeSemester(semester: Semester) {
  return {
    id: semester.id,
    nama: semester.nama,
  };
}

function toSafeWilayah(wilayah: Wilayah) {
  return {
    id: wilayah.id,
    nama: wilayah.nama,
    id_induk_wilayah: wilayah.id_induk_wilayah,
  };
}

function toSafePerguruanTinggi(perguruanTinggi: PerguruanTinggi) {
  return {
    id: perguruanTinggi.id,
    nama: perguruanTinggi.nama,
  };
}

function toSafeUnitKerja(unitKerja: UnitKerja) {
  return {
    id: unitKerja.id,
    nama: unitKerja.nama,
    id_jenis_unit: unitKerja.id_jenis_unit,
  };
}

export async function getProfilPt(
  dataSource: ReferensiDataSource = createReferensiDataSource(),
): Promise<ReferensiProfilPtResponse> {
  const config = getSisterConfig();
  const items = await dataSource.getProfilPt();

  return referensiProfilPtResponseSchema.parse({
    items: items.map(toSafeProfilPt),
    source: config.fixture_mode ? "fixture" : "sister",
    fetched_at: new Date().toISOString(),
  });
}

export async function getSemester(
  dataSource: ReferensiDataSource = createReferensiDataSource(),
): Promise<ReferensiSemesterResponse> {
  const config = getSisterConfig();
  const items = await dataSource.getSemester();

  return referensiSemesterResponseSchema.parse({
    items: items.map(toSafeSemester),
    source: config.fixture_mode ? "fixture" : "sister",
    fetched_at: new Date().toISOString(),
  });
}

export async function getWilayah(
  idLevelWilayah: WilayahLevel,
  dataSource: ReferensiDataSource = createReferensiDataSource(),
): Promise<ReferensiWilayahResponse> {
  const config = getSisterConfig();
  const items = await dataSource.getWilayah(idLevelWilayah);

  return referensiWilayahResponseSchema.parse({
    items: items.map(toSafeWilayah),
    source: config.fixture_mode ? "fixture" : "sister",
    fetched_at: new Date().toISOString(),
  });
}

export async function getPerguruanTinggi(
  dataSource: ReferensiDataSource = createReferensiDataSource(),
): Promise<ReferensiPerguruanTinggiResponse> {
  const config = getSisterConfig();
  const items = await dataSource.getPerguruanTinggi();

  return referensiPerguruanTinggiResponseSchema.parse({
    items: items.map(toSafePerguruanTinggi),
    source: config.fixture_mode ? "fixture" : "sister",
    fetched_at: new Date().toISOString(),
  });
}

export async function getUnitKerja(
  idPerguruanTinggi: string,
  dataSource: ReferensiDataSource = createReferensiDataSource(),
): Promise<ReferensiUnitKerjaResponse> {
  const config = getSisterConfig();
  const items = await dataSource.getUnitKerja(idPerguruanTinggi);

  return referensiUnitKerjaResponseSchema.parse({
    items: items.map(toSafeUnitKerja),
    source: config.fixture_mode ? "fixture" : "sister",
    fetched_at: new Date().toISOString(),
  });
}
