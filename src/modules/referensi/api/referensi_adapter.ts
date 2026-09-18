import { sisterGet } from "@/server/sister/http_client";
import {
  perguruanTinggiListSchema,
  profilPtListSchema,
  semesterListSchema,
  unitKerjaListSchema,
  wilayahListSchema,
  type PerguruanTinggi,
  type ProfilPt,
  type Semester,
  type UnitKerja,
  type Wilayah,
} from "@/server/sister/types";

export type WilayahLevel = 0 | 1 | 2 | 3;

export type ReferensiDataSource = {
  getProfilPt(): Promise<ProfilPt[]>;
  getSemester(): Promise<Semester[]>;
  getWilayah(idLevelWilayah: WilayahLevel): Promise<Wilayah[]>;
  getPerguruanTinggi(): Promise<PerguruanTinggi[]>;
  getUnitKerja(idPerguruanTinggi: string): Promise<UnitKerja[]>;
};

const fixtureProfilPt: ProfilPt[] = [
  {
    id: "fixture-pt",
    kode_perguruan_tinggi: "FIXTURE-PT",
    nama_perguruan_tinggi: "Perguruan Tinggi Fixture",
    telepon: "Data sintetis",
    faximile: "Data sintetis",
    email: "fixture@example.test",
    website: "https://example.test",
    jalan: "Data sintetis",
    dusun: "Data sintetis",
    rt: 0,
    rw: 0,
    kelurahan: "Data sintetis",
    kode_pos: "00000",
    id_wilayah: "fixture",
  },
];

const fixtureSemester: Semester[] = [
  { id: 20251, nama: "Semester Fixture Ganjil" },
  { id: 20252, nama: "Semester Fixture Genap" },
];

const fixtureWilayah: Record<WilayahLevel, Wilayah[]> = {
  0: [{ id: "ID", nama: "Indonesia (Fixture)", id_induk_wilayah: "" }],
  1: [
    { id: "32", nama: "Jawa Barat (Fixture)", id_induk_wilayah: "ID" },
    { id: "35", nama: "Jawa Timur (Fixture)", id_induk_wilayah: "ID" },
  ],
  2: [
    { id: "3273", nama: "Kota Bandung (Fixture)", id_induk_wilayah: "32" },
    { id: "3275", nama: "Kota Bekasi (Fixture)", id_induk_wilayah: "32" },
  ],
  3: [{ id: "327301", nama: "Kecamatan Coblong (Fixture)", id_induk_wilayah: "3273" }],
};

const fixturePerguruanTinggiId = "11111111-1111-4111-8111-111111111111";

const fixturePerguruanTinggi: PerguruanTinggi[] = [
  { id: fixturePerguruanTinggiId, nama: "Perguruan Tinggi Fixture" },
];

const fixtureUnitKerja: Record<string, UnitKerja[]> = {
  [fixturePerguruanTinggiId]: [
    { id: "unit-1", nama: "Fakultas Ilmu Komputer (Fixture)", id_jenis_unit: 1 },
    { id: "unit-2", nama: "Program Studi Informatika (Fixture)", id_jenis_unit: 3 },
  ],
};

export class FixtureReferensiAdapter implements ReferensiDataSource {
  async getProfilPt() {
    return fixtureProfilPt;
  }

  async getSemester() {
    return fixtureSemester;
  }

  async getWilayah(idLevelWilayah: WilayahLevel) {
    return fixtureWilayah[idLevelWilayah];
  }

  async getPerguruanTinggi() {
    return fixturePerguruanTinggi;
  }

  async getUnitKerja(idPerguruanTinggi: string) {
    return fixtureUnitKerja[idPerguruanTinggi] ?? [];
  }
}

export class SisterReferensiAdapter implements ReferensiDataSource {
  async getProfilPt() {
    return sisterGet({
      path: "/referensi/profil_pt",
      schema: profilPtListSchema,
    });
  }

  async getSemester() {
    return sisterGet({
      path: "/referensi/semester",
      schema: semesterListSchema,
    });
  }

  async getWilayah(idLevelWilayah: WilayahLevel) {
    return sisterGet({
      path: "/referensi/wilayah",
      query: { id_level_wilayah: idLevelWilayah },
      schema: wilayahListSchema,
    });
  }

  async getPerguruanTinggi() {
    return sisterGet({
      path: "/referensi/perguruan_tinggi",
      schema: perguruanTinggiListSchema,
    });
  }

  async getUnitKerja(idPerguruanTinggi: string) {
    return sisterGet({
      path: "/referensi/unit_kerja",
      query: { id_perguruan_tinggi: idPerguruanTinggi },
      schema: unitKerjaListSchema,
    });
  }
}
