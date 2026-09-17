import type { PrismaClient } from "@prisma/client";

import { prisma } from "@/server/db/prisma";
import type { SdmSummary } from "@/server/sister/types";

type SdmCacheDelegate = Pick<
  PrismaClient["sisterSdmIndexCache"],
  "findUnique" | "upsert"
>;

export type PegawaiCacheRepository = {
  findFreshById(
    integrationId: string,
    idSdm: string,
    maxAgeMs: number,
  ): Promise<SdmSummary | null>;
  upsertMany(integrationId: string, items: SdmSummary[]): Promise<void>;
};

export type PegawaiCacheClient = {
  sisterSdmIndexCache: SdmCacheDelegate;
};

function toSdmSummary(row: {
  idSdm: string;
  namaSdm: string;
  nidn: string | null;
  nip: string | null;
  nuptk: string | null;
  namaStatusAktif: string | null;
  namaStatusPegawai: string | null;
  jenisSdm: string | null;
}): SdmSummary {
  return {
    id_sdm: row.idSdm,
    nama_sdm: row.namaSdm,
    nidn: row.nidn,
    nip: row.nip,
    nuptk: row.nuptk,
    nama_status_aktif: row.namaStatusAktif,
    nama_status_pegawai: row.namaStatusPegawai,
    jenis_sdm: row.jenisSdm,
  };
}

export class PrismaPegawaiCacheRepository implements PegawaiCacheRepository {
  constructor(private readonly client: PegawaiCacheClient = prisma) {}

  async findFreshById(integrationId: string, idSdm: string, maxAgeMs: number) {
    const row = await this.client.sisterSdmIndexCache.findUnique({
      where: {
        integrationId_idSdm: {
          integrationId,
          idSdm,
        },
      },
    });

    if (!row || row.fetchedAt.getTime() < Date.now() - maxAgeMs) {
      return null;
    }

    return toSdmSummary(row);
  }

  async upsertMany(integrationId: string, items: SdmSummary[]) {
    await Promise.all(
      items.map((item) =>
        this.client.sisterSdmIndexCache.upsert({
          where: {
            integrationId_idSdm: {
              integrationId,
              idSdm: item.id_sdm,
            },
          },
          create: {
            integrationId,
            idSdm: item.id_sdm,
            namaSdm: item.nama_sdm,
            nidn: item.nidn,
            nip: item.nip,
            nuptk: item.nuptk,
            namaStatusAktif: item.nama_status_aktif,
            namaStatusPegawai: item.nama_status_pegawai,
            jenisSdm: item.jenis_sdm,
          },
          update: {
            namaSdm: item.nama_sdm,
            nidn: item.nidn,
            nip: item.nip,
            nuptk: item.nuptk,
            namaStatusAktif: item.nama_status_aktif,
            namaStatusPegawai: item.nama_status_pegawai,
            jenisSdm: item.jenis_sdm,
            fetchedAt: new Date(),
          },
        }),
      ),
    );
  }
}
