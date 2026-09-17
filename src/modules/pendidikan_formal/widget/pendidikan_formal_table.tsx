import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import type { PendidikanFormalListResponse } from "../api/pendidikan_formal_schemas";

type PendidikanFormalTableProps = {
  items: PendidikanFormalListResponse["items"];
};

export function PendidikanFormalTable({ items }: PendidikanFormalTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[hsl(var(--color-border))] bg-white shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
      <table className="w-full min-w-[980px] text-left text-sm">
        <caption className="sr-only">Daftar pendidikan formal SDM</caption>
        <thead className="border-b border-[hsl(var(--color-border))] bg-[hsl(var(--color-canvas))] text-xs text-[hsl(var(--color-muted))]">
          <tr>
            <th className="px-5 py-3 font-semibold" scope="col">
              Jenjang / gelar
            </th>
            <th className="px-5 py-3 font-semibold" scope="col">
              Bidang studi
            </th>
            <th className="px-5 py-3 font-semibold" scope="col">
              Perguruan tinggi
            </th>
            <th className="px-5 py-3 font-semibold" scope="col">
              Tahun lulus
            </th>
            <th className="px-5 py-3 font-semibold" scope="col">
              ID jenis ajuan
            </th>
            <th className="px-5 py-3 text-right font-semibold" scope="col">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[hsl(var(--color-border))]">
          {items.map((item) => (
            <tr className="group" key={item.id}>
              <td className="px-5 py-4">
                <p className="font-semibold text-[hsl(var(--color-text))]">
                  {item.jenjang_pendidikan || "Tidak tersedia"}
                </p>
                <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
                  {item.gelar_akademik || "Gelar akademik tidak tersedia"}
                </p>
              </td>
              <td className="px-5 py-4 text-sm text-[hsl(var(--color-text))]">
                {item.bidang_studi || "Tidak tersedia"}
              </td>
              <td className="px-5 py-4 text-xs text-[hsl(var(--color-muted))]">
                {item.nama_perguruan_tinggi || "Tidak tersedia"}
              </td>
              <td className="px-5 py-4 text-sm text-[hsl(var(--color-text))]">
                {item.tahun_lulus}
              </td>
              <td className="px-5 py-4 text-xs text-[hsl(var(--color-muted))]">
                {item.jenis_ajuan}
              </td>
              <td className="px-5 py-4 text-right">
                <Link
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--color-primary))] opacity-80 transition-opacity hover:opacity-100 group-hover:opacity-100"
                  href={`/pendidikan_formal/${item.id}`}
                >
                  Lihat detail
                  <ArrowUpRight aria-hidden size={14} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
