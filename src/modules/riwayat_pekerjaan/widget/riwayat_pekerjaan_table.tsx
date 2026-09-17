import Link from "next/link";

import { ExternalLink } from "lucide-react";

import type { RiwayatPekerjaanListResponse } from "../api/riwayat_pekerjaan_schemas";

type RiwayatPekerjaanTableProps = {
  items: RiwayatPekerjaanListResponse["items"];
};

export function RiwayatPekerjaanTable({ items }: RiwayatPekerjaanTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[hsl(var(--color-border))] bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-[980px] w-full text-left text-sm">
          <thead className="bg-[hsl(var(--color-canvas))] text-xs uppercase tracking-[0.08em] text-[hsl(var(--color-muted))]">
            <tr>
              <th className="px-4 py-3 font-semibold">Jabatan</th>
              <th className="px-4 py-3 font-semibold">Jenis pekerjaan</th>
              <th className="px-4 py-3 font-semibold">Instansi</th>
              <th className="px-4 py-3 font-semibold">Divisi</th>
              <th className="px-4 py-3 font-semibold">Mulai</th>
              <th className="px-4 py-3 font-semibold">Selesai</th>
              <th className="px-4 py-3 font-semibold">Luar negeri</th>
              <th className="px-4 py-3 font-semibold">Bidang usaha</th>
              <th className="px-4 py-3 text-right font-semibold">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--color-border))]">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 font-medium text-[hsl(var(--color-text))]">
                  {item.nama_jabatan}
                </td>
                <td className="px-4 py-3 text-[hsl(var(--color-muted))]">
                  {item.jenis_pekerjaan}
                </td>
                <td className="px-4 py-3 text-[hsl(var(--color-muted))]">{item.instansi}</td>
                <td className="px-4 py-3 text-[hsl(var(--color-muted))]">{item.divisi || "-"}</td>
                <td className="px-4 py-3 text-[hsl(var(--color-muted))]">
                  {item.mulai_bekerja || "-"}
                </td>
                <td className="px-4 py-3 text-[hsl(var(--color-muted))]">
                  {item.selesai_bekerja || "-"}
                </td>
                <td className="px-4 py-3 text-[hsl(var(--color-muted))]">
                  {item.luar_negeri ? "Ya" : "Tidak"}
                </td>
                <td className="px-4 py-3 text-[hsl(var(--color-muted))]">
                  {item.bidang_usaha}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    aria-label={`Buka detail riwayat pekerjaan ${item.nama_jabatan}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--color-primary))] transition-colors hover:text-[hsl(var(--color-primary-strong))]"
                    href={`/riwayat_pekerjaan/${item.id}`}
                  >
                    Detail
                    <ExternalLink aria-hidden size={13} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
