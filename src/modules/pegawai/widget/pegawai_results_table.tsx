import Link from "next/link";

import { ArrowUpRight, UserRound } from "lucide-react";

import { StatusBadge } from "@/component/ui/status_badge";
import type { PegawaiSearchResult } from "../api/pegawai_schemas";

type PegawaiResultsTableProps = {
  items: PegawaiSearchResult[];
};

export function PegawaiResultsTable({ items }: PegawaiResultsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[hsl(var(--color-border))] bg-white shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="border-b border-[hsl(var(--color-border))] bg-[hsl(var(--color-canvas))]">
            <tr className="text-[11px] font-bold uppercase tracking-[0.08em] text-[hsl(var(--color-muted))]">
              <th className="px-5 py-3 font-bold">Pegawai</th>
              <th className="px-5 py-3 font-bold">Identifier</th>
              <th className="px-5 py-3 font-bold">Status</th>
              <th className="px-5 py-3 font-bold">Jenis</th>
              <th className="px-5 py-3 text-right font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--color-border))]">
            {items.map((pegawai) => (
              <tr className="group" key={pegawai.id_sdm}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary))]">
                      <UserRound aria-hidden size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[hsl(var(--color-text))]">
                        {pegawai.nama_sdm}
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-[hsl(var(--color-muted))]">
                        {pegawai.id_sdm}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-xs text-[hsl(var(--color-muted))]">
                  <div className="space-y-1">
                    {pegawai.nidn && <p>NIDN: {pegawai.nidn}</p>}
                    {pegawai.nip && <p>NIP: {pegawai.nip}</p>}
                    {pegawai.nuptk && <p>NUPTK: {pegawai.nuptk}</p>}
                    {!pegawai.nidn && !pegawai.nip && !pegawai.nuptk && <p>—</p>}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge tone={pegawai.nama_status_aktif === "Aktif" ? "success" : "neutral"}>
                    {pegawai.nama_status_aktif ?? "Tidak tersedia"}
                  </StatusBadge>
                </td>
                <td className="px-5 py-4 text-xs text-[hsl(var(--color-muted))]">
                  {pegawai.jenis_sdm ?? "Tidak tersedia"}
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--color-primary))] opacity-80 transition-opacity hover:opacity-100 group-hover:opacity-100"
                    href={`/pegawai/${pegawai.id_sdm}`}
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
    </div>
  );
}
