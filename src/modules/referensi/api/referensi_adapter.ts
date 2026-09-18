import { sisterGet } from "@/server/sister/http_client";
import {
  profilPtListSchema,
  semesterListSchema,
  wilayahListSchema,
  type ProfilPt,
  type Semester,
  type Wilayah,
} from "@/server/sister/types";

export type WilayahLevel = 0 | 1 | 2 | 3;

export type ReferensiDataSource = {
  getProfilPt(): Promise<ProfilPt[]>;
  getSemester(): Promise<Semester[]>;
  getWilayah(idLevelWilayah: WilayahLevel): Promise<Wilayah[]>;
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
}
