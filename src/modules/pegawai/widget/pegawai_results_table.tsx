import Link from "next/link";

import { ArrowUpRight, UserRound } from "lucide-react";

import { StatusBadge } from "@/component/ui/status_badge";
import { DataTable, type DataTableColumn } from "@/component/widget";
import type { PegawaiSearchResult } from "../api/pegawai_schemas";

type PegawaiResultsTableProps = {
  items: PegawaiSearchResult[];
};

export function PegawaiResultsTable({ items }: PegawaiResultsTableProps) {
  const columns: DataTableColumn<PegawaiSearchResult>[] = [
    {
      key: "pegawai",
      header: "Pegawai",
      render: (pegawai) => (
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
      ),
    },
    {
      key: "identifier",
      header: "Identifier",
      render: (pegawai) => (
        <div className="space-y-1 text-xs text-[hsl(var(--color-muted))]">
          {pegawai.nidn && <p>NIDN: {pegawai.nidn}</p>}
          {pegawai.nip && <p>NIP: {pegawai.nip}</p>}
          {pegawai.nuptk && <p>NUPTK: {pegawai.nuptk}</p>}
          {!pegawai.nidn && !pegawai.nip && !pegawai.nuptk && <p>-</p>}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (pegawai) => (
        <StatusBadge tone={pegawai.nama_status_aktif === "Aktif" ? "success" : "neutral"}>
          {pegawai.nama_status_aktif ?? "Tidak tersedia"}
        </StatusBadge>
      ),
    },
    {
      key: "jenis",
      header: "Jenis",
      render: (pegawai) => (
        <span className="text-xs text-[hsl(var(--color-muted))]">
          {pegawai.jenis_sdm ?? "Tidak tersedia"}
        </span>
      ),
    },
    {
      key: "action",
      header: "Aksi",
      className: "text-right",
      render: (pegawai) => (
        <Link
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--color-primary))] transition-colors hover:text-[hsl(var(--color-primary-strong))]"
          href={`/pegawai/${pegawai.id_sdm}`}
        >
          Lihat detail
          <ArrowUpRight aria-hidden size={14} />
        </Link>
      ),
    },
  ];

  return (
    <DataTable
      caption="Daftar pegawai"
      columns={columns}
      getRowKey={(pegawai) => pegawai.id_sdm}
      rows={items}
      tableClassName="min-w-[760px]"
    />
  );
}
