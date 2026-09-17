import Link from "next/link";

import { ArrowUpRight } from "lucide-react";

import type { PenugasanListResponse } from "../api/penugasan_schemas";

type PenugasanTableProps = {
  items: PenugasanListResponse["items"];
};

export function PenugasanTable({ items }: PenugasanTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[hsl(var(--color-border))] bg-white shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
      <table className="w-full min-w-[920px] text-left text-sm">
        <caption className="sr-only">Daftar penugasan dan penempatan SDM</caption>
        <thead className="border-b border-[hsl(var(--color-border))] bg-[hsl(var(--color-canvas))] text-xs text-[hsl(var(--color-muted))]">
          <tr>
            <th className="px-5 py-3 font-semibold" scope="col">
              Status / ikatan kerja
            </th>
            <th className="px-5 py-3 font-semibold" scope="col">
              Unit kerja
            </th>
            <th className="px-5 py-3 font-semibold" scope="col">
              Jenjang
            </th>
            <th className="px-5 py-3 font-semibold" scope="col">
              Perguruan tinggi
            </th>
            <th className="px-5 py-3 font-semibold" scope="col">
              Periode
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
                  {item.status_kepegawaian || "Tidak tersedia"}
                </p>
                <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
                  {item.ikatan_kerja || "Ikatan kerja tidak tersedia"}
                </p>
              </td>
              <td className="px-5 py-4 text-sm text-[hsl(var(--color-text))]">
                {item.unit_kerja || "Tidak tersedia"}
              </td>
              <td className="px-5 py-4 text-xs text-[hsl(var(--color-muted))]">
                {item.jenjang_pendidikan || "Tidak tersedia"}
              </td>
              <td className="px-5 py-4 text-xs text-[hsl(var(--color-muted))]">
                {item.perguruan_tinggi || "Tidak tersedia"}
              </td>
              <td className="px-5 py-4 text-xs text-[hsl(var(--color-muted))]">
                <p>Mulai: {item.tanggal_mulai || "Tidak tersedia"}</p>
                <p className="mt-1">
                  Keluar: {item.tanggal_keluar || "Belum keluar"}
                </p>
              </td>
              <td className="px-5 py-4 text-right">
                <Link
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--color-primary))] opacity-80 transition-opacity hover:opacity-100 group-hover:opacity-100"
                  href={`/penugasan/${item.id}`}
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
