"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { ClipboardList, SlidersHorizontal } from "lucide-react";

import { StatusBadge } from "@/component/ui/status_badge";
import { useTRPC } from "@/lib/trpc";

import { PenugasanTable } from "./penugasan_table";

const emptySdmId = "00000000-0000-0000-0000-000000000000";

export function PenugasanWorkspaceWidget() {
  const trpc = useTRPC();
  const [selectedSdmId, setSelectedSdmId] = useState("");

  const pegawaiQuery = useQuery(
    trpc.pegawai.search.queryOptions({
      search_by: "nama",
      search: "",
      page: 1,
      per_page: 50,
    }),
  );
  const penugasanQuery = useQuery({
    ...trpc.penugasan.list.queryOptions({ id_sdm: selectedSdmId || emptySdmId }),
    enabled: Boolean(selectedSdmId),
  });
  const selectedPegawai = pegawaiQuery.data?.items.find(
    (item) => item.id_sdm === selectedSdmId,
  );

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-5 shadow-[0_1px_2px_hsl(145_20%_20%/0.04)]">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[hsl(var(--color-text))]">
                Pilih pegawai
              </h2>
              {pegawaiQuery.data?.source && <SourceBadge source={pegawaiQuery.data.source} />}
            </div>
            <p className="mt-1 text-xs leading-5 text-[hsl(var(--color-muted))]">
              Daftar penugasan diambil berdasarkan SDM dari referensi SISTER.
              Tidak ada input ID arbitrary.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--color-muted))]">
            <SlidersHorizontal aria-hidden size={14} />
            Read-only
          </div>
        </div>

        <label className="mt-5 block max-w-xl text-xs font-semibold text-[hsl(var(--color-text))]" htmlFor="penugasan-sdm">
          Pegawai / SDM
          <select
            className="mt-2 h-10 w-full rounded-lg border border-[hsl(var(--color-border))] bg-white px-3 text-sm font-normal text-[hsl(var(--color-text))] outline-none transition-colors focus:border-[hsl(var(--color-primary))] focus:ring-2 focus:ring-[hsl(var(--color-primary-soft))] disabled:cursor-not-allowed disabled:bg-[hsl(var(--color-canvas))]"
            disabled={pegawaiQuery.isPending || pegawaiQuery.isError}
            id="penugasan-sdm"
            onChange={(event) => setSelectedSdmId(event.target.value)}
            value={selectedSdmId}
          >
            <option value="">Pilih pegawai</option>
            {pegawaiQuery.data?.items.map((item) => (
              <option key={item.id_sdm} value={item.id_sdm}>
                {item.nama_sdm} {item.nidn ? `· ${item.nidn}` : ""}
              </option>
            ))}
          </select>
        </label>

        {pegawaiQuery.isPending && (
          <p className="mt-4 text-xs text-[hsl(var(--color-muted))]">Memuat daftar pegawai...</p>
        )}
        {pegawaiQuery.isError && (
          <div className="mt-4 rounded-lg border border-[hsl(var(--color-danger))]/30 bg-[hsl(var(--color-danger-soft))] p-4 text-sm text-[hsl(var(--color-danger-strong))]">
            Daftar pegawai belum dapat dimuat. Periksa session dan koneksi SISTER.
          </div>
        )}
        {selectedPegawai && (
          <p className="mt-4 text-xs text-[hsl(var(--color-muted))]">
            Konteks aktif: <span className="font-semibold text-[hsl(var(--color-text))]">{selectedPegawai.nama_sdm}</span>
          </p>
        )}
      </div>

      {!selectedSdmId && <SelectionState />}
      {selectedSdmId && penugasanQuery.isPending && <LoadingState />}
      {selectedSdmId && penugasanQuery.isError && (
        <ErrorState label="Daftar penugasan belum dapat dimuat." />
      )}
      {selectedSdmId && penugasanQuery.data?.items.length === 0 && (
        <EmptyState label="Belum ada penugasan untuk pegawai ini." />
      )}
      {penugasanQuery.data && penugasanQuery.data.items.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-[hsl(var(--color-text))]">
                Penugasan dan penempatan
              </h2>
              <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
                {penugasanQuery.data.items.length} data ditemukan
              </p>
            </div>
            <SourceBadge source={penugasanQuery.data.source} />
          </div>
          <PenugasanTable items={penugasanQuery.data.items} />
        </section>
      )}
    </section>
  );
}

function SourceBadge({ source }: { source: "fixture" | "sister" }) {
  return (
    <StatusBadge tone={source === "sister" ? "success" : "warning"}>
      {source === "sister" ? "SISTER" : "Fixture mode"}
    </StatusBadge>
  );
}

function SelectionState() {
  return (
    <div className="rounded-xl border border-dashed border-[hsl(var(--color-border))] bg-white p-10 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--color-primary-soft))] text-[hsl(var(--color-primary))]">
        <ClipboardList aria-hidden size={18} />
      </div>
      <p className="mt-3 text-sm font-semibold text-[hsl(var(--color-text))]">
        Pilih pegawai terlebih dahulu
      </p>
      <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
        Data penugasan akan dimuat setelah SDM dipilih.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-10 text-center text-sm text-[hsl(var(--color-muted))]">
      Memuat penugasan...
    </div>
  );
}

function ErrorState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-[hsl(var(--color-danger))]/30 bg-[hsl(var(--color-danger-soft))] p-5 text-sm text-[hsl(var(--color-danger-strong))]">
      {label}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[hsl(var(--color-border))] bg-white p-10 text-center text-sm text-[hsl(var(--color-muted))]">
      {label}
    </div>
  );
}
