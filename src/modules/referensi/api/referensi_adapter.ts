import { sisterGet } from "@/server/sister/http_client";
import {
  profilPtListSchema,
  semesterListSchema,
  type ProfilPt,
  type Semester,
} from "@/server/sister/types";

export type ReferensiDataSource = {
  getProfilPt(): Promise<ProfilPt[]>;
  getSemester(): Promise<Semester[]>;
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

export class FixtureReferensiAdapter implements ReferensiDataSource {
  async getProfilPt() {
    return fixtureProfilPt;
  }

  async getSemester() {
    return fixtureSemester;
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
}
