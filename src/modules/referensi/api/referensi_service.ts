import { getSisterConfig } from "@/server/sister/config";
import type { ProfilPt, Semester } from "@/server/sister/types";

import {
  referensiProfilPtResponseSchema,
  referensiSemesterResponseSchema,
  type ReferensiProfilPtResponse,
  type ReferensiSemesterResponse,
} from "../schema/referensi_schemas";
import {
  FixtureReferensiAdapter,
  SisterReferensiAdapter,
  type ReferensiDataSource,
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
