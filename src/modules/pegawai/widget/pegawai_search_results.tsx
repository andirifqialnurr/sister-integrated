"use client";

import type { TRPCClientErrorLike } from "@trpc/client";
import type { UseQueryResult } from "@tanstack/react-query";

import { Button } from "@/component/ui/button";
import { State } from "@/component/ui/state";
import type { AppRouter } from "@/server/trpc/router";

import { PegawaiResultsTable } from "./pegawai_results_table";
import type { PegawaiSearchResponse } from "../api/pegawai_schemas";

type PegawaiSearchResultsProps = {
  query: UseQueryResult<PegawaiSearchResponse, TRPCClientErrorLike<AppRouter>>;
};

export function PegawaiSearchResults({ query }: PegawaiSearchResultsProps) {
  return (
    <section className="space-y-4">
      {query.isPending && (
        <State
          description="Mohon tunggu sebentar."
          title="Memuat daftar pegawai..."
          tone="loading"
        />
      )}

      {query.isError && (
        <State
          action={
            <Button onClick={() => void query.refetch()} size="sm">
              Coba lagi
            </Button>
          }
          description="Coba lagi setelah konfigurasi session dan koneksi SISTER diperiksa."
          title="Daftar pegawai belum dapat dimuat"
          tone="error"
        />
      )}

      {query.data && (
        <>
          <p className="text-xs text-[hsl(var(--color-muted))]">
            Menampilkan {query.data.items.length} dari {query.data.total} pegawai
          </p>
          {query.data.items.length > 0 ? (
            <PegawaiResultsTable items={query.data.items} />
          ) : (
            <State
              description="Ubah kata kunci atau pilih jenis identifier lain."
              title="Pegawai tidak ditemukan"
            />
          )}
        </>
      )}
    </section>
  );
}
