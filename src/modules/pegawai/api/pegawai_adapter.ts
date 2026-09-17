import { SisterNotFoundError } from "@/server/sister/errors";
import { sisterGet } from "@/server/sister/http_client";
import {
  sdmEmploymentSchema,
  sdmProfileSchema,
  sdmSummaryListSchema,
  type SdmEmployment,
  type SdmProfile,
  type SdmSummary,
} from "@/server/sister/types";

import type { PegawaiSearchInput } from "./pegawai_schemas";

export type PegawaiDataSource = {
  search(input: PegawaiSearchInput): Promise<SdmSummary[]>;
  getProfile(idSdm: string): Promise<SdmProfile>;
  getEmployment(idSdm: string): Promise<SdmEmployment>;
};

const fixtureSdm: SdmSummary[] = [
  {
    id_sdm: "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62",
    nama_sdm: "Aditya Pratama",
    nidn: "032999923",
    nip: "198501012010011001",
    nuptk: "4723786869032232",
    nama_status_aktif: "Aktif",
    nama_status_pegawai: "Dosen Tetap",
    jenis_sdm: "Dosen",
  },
  {
    id_sdm: "4d1f0f7f-8f4f-4b12-9f40-73cc3ca6ed3b",
    nama_sdm: "Siti Rahmawati",
    nidn: "0412058501",
    nip: null,
    nuptk: "1234567890123456",
    nama_status_aktif: "Aktif",
    nama_status_pegawai: "Tenaga Kependidikan",
    jenis_sdm: "Tenaga Kependidikan",
  },
  {
    id_sdm: "d2f2e4c7-0d62-4ef0-8e88-f0af9e6247c5",
    nama_sdm: "Bima Kurniawan",
    nidn: "0317019002",
    nip: "199001172016011002",
    nuptk: null,
    nama_status_aktif: "Aktif",
    nama_status_pegawai: "Dosen Tetap",
    jenis_sdm: "Dosen",
  },
];

const fixtureProfile: Record<string, SdmProfile> = {
  "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62": {
    nama: "Aditya Pratama",
    jenis_kelamin: "L",
    tempat_lahir: "Bandung",
    tanggal_lahir: "1985-01-01",
  },
  "4d1f0f7f-8f4f-4b12-9f40-73cc3ca6ed3b": {
    nama: "Siti Rahmawati",
    jenis_kelamin: "P",
    tempat_lahir: "Semarang",
    tanggal_lahir: "1988-06-12",
  },
  "d2f2e4c7-0d62-4ef0-8e88-f0af9e6247c5": {
    nama: "Bima Kurniawan",
    jenis_kelamin: "L",
    tempat_lahir: "Yogyakarta",
    tanggal_lahir: "1990-01-17",
  },
};

const fixtureEmployment: Record<string, SdmEmployment> = {
  "8fe6735c-6e28-43e7-9eb3-3ae092bbcd62": {
    nip: "198501012010011001",
    sk_cpns: "SK-CPNS/2010/001",
    tanggal_sk_cpns: "2010-01-01",
    sk_tmmd: null,
    tmmd: "2010-01-01",
    id_sumber_gaji: 1,
    sumber_gaji: "Yayasan",
    nidn: "032999923",
    nuptk: "4723786869032232",
  },
  "4d1f0f7f-8f4f-4b12-9f40-73cc3ca6ed3b": {
    nip: null,
    sk_cpns: null,
    tanggal_sk_cpns: null,
    sk_tmmd: null,
    tmmd: "2012-07-01",
    id_sumber_gaji: 2,
    sumber_gaji: "Perguruan Tinggi",
    nidn: "0412058501",
    nuptk: "1234567890123456",
  },
  "d2f2e4c7-0d62-4ef0-8e88-f0af9e6247c5": {
    nip: "199001172016011002",
    sk_cpns: "SK-CPNS/2016/002",
    tanggal_sk_cpns: "2016-01-01",
    sk_tmmd: null,
    tmmd: "2016-01-01",
    id_sumber_gaji: 2,
    sumber_gaji: "Perguruan Tinggi",
    nidn: "0317019002",
    nuptk: null,
  },
};

function includesQuery(value: string | null | undefined, query: string) {
  return value?.toLocaleLowerCase("id-ID").includes(query.toLocaleLowerCase("id-ID")) ?? false;
}

function getSearchableValue(pegawai: SdmSummary, searchBy: PegawaiSearchInput["search_by"]) {
  switch (searchBy) {
    case "nama":
      return pegawai.nama_sdm;
    case "nidn":
      return pegawai.nidn;
    case "nip":
      return pegawai.nip;
    case "nuptk":
      return pegawai.nuptk;
  }
}

export class FixturePegawaiAdapter implements PegawaiDataSource {
  async search(input: PegawaiSearchInput) {
    const query = input.search.trim();
    const filtered = fixtureSdm.filter((pegawai) => {
      if (!query) return true;
      return includesQuery(getSearchableValue(pegawai, input.search_by), query);
    });

    const offset = (input.page - 1) * input.per_page;
    return filtered.slice(offset, offset + input.per_page);
  }

  async getProfile(idSdm: string) {
    const profile = fixtureProfile[idSdm];
    if (!profile) throw new SisterNotFoundError();
    return profile;
  }

  async getEmployment(idSdm: string) {
    const employment = fixtureEmployment[idSdm];
    if (!employment) throw new SisterNotFoundError();
    return employment;
  }
}

export class SisterPegawaiAdapter implements PegawaiDataSource {
  async search(input: PegawaiSearchInput) {
    return sisterGet({
      path: "/referensi/sdm",
      query: {
        id_sp: input.id_sp,
        [input.search_by]: input.search || undefined,
      },
      schema: sdmSummaryListSchema,
    });
  }

  async getProfile(idSdm: string) {
    return sisterGet({
      path: `/data_pribadi/profil/${encodeURIComponent(idSdm)}`,
      schema: sdmProfileSchema,
    });
  }

  async getEmployment(idSdm: string) {
    return sisterGet({
      path: `/data_pribadi/kepegawaian/${encodeURIComponent(idSdm)}`,
      schema: sdmEmploymentSchema,
    });
  }
}
