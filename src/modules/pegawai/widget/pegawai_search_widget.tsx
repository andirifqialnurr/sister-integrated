"use client";

import { useState, type FormEvent } from "react";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { Button } from "@/component/ui/button";
import { Select } from "@/component/ui/select";
import { StatusBadge } from "@/component/ui/status_badge";
import { useTRPC } from "@/lib/trpc";

import { PegawaiResultsTable } from "./pegawai_results_table";
import type { PegawaiSearchInput } from "../api/pegawai_schemas";

const defaultSearch: PegawaiSearchInput = {
  search_by: "nama",
  search: "",
  page: 1,
  per_page: 20,
};

const searchOptions = [
  { label: "Nama pegawai", value: "nama" },
  { label: "NIDN", value: "nidn" },
  { label: "NIP", value: "nip" },
  { label: "NUPTK", value: "nuptk" },
] as const;

export function PegawaiSearchWidget() {
  const trpc = useTRPC();
  const [searchBy, setSearchBy] = useState<PegawaiSearchInput["search_by"]>("nama");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState(defaultSearch);
  const pegawaiQuery = useQuery(trpc.pegawai.search.queryOptions(submittedSearch));

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedSearch({
      search_by: searchBy,
      search: search.trim(),
      page: 1,
      per_page: 20,
    });
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-end">
        <StatusBadge tone={pegawaiQuery.data?.source === "sister" ? "success" : "warning"}>
          {pegawaiQuery.data?.source === "sister" ? "SISTER" : "Fixture mode"}
        </StatusBadge>
        <form className="flex flex-col gap-3 md:flex-row md:justify-end" onSubmit={submitSearch}>
          <Select
            ariaLabel="Cari berdasarkan"
            onValueChange={(value) => setSearchBy(value as PegawaiSearchInput["search_by"])}
            options={[...searchOptions]}
            value={searchBy}
          />
          <label className="relative block min-w-0 md:w-[280px]" htmlFor="pegawai-search">
            <Search
              aria-hidden
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--color-muted))]"
              size={16}
            />
            <input
              className="h-10 w-full rounded-lg border border-[hsl(var(--color-border))] bg-white pl-9 pr-3 text-sm text-[hsl(var(--color-text))] outline-none transition-colors placeholder:text-[hsl(var(--color-muted))] focus:border-[hsl(var(--color-primary))] focus:ring-2 focus:ring-[hsl(var(--color-primary-soft))]"
              id="pegawai-search"
              onChange={(event) => setSearch(event.target.value)}
              placeholder={searchBy === "nama" ? "Contoh: Aditya" : `Masukkan ${searchBy.toUpperCase()}`}
              value={search}
            />
          </label>
          <Button disabled={pegawaiQuery.isFetching} type="submit">
            {pegawaiQuery.isFetching ? "Memuat..." : "Cari pegawai"}
          </Button>
        </form>
      </div>

      {pegawaiQuery.isPending && (
        <div className="rounded-xl border border-[hsl(var(--color-border))] bg-white p-10 text-center text-sm text-[hsl(var(--color-muted))]">
          Memuat daftar pegawai...
        </div>
      )}

      {pegawaiQuery.isError && (
        <div className="rounded-xl border border-[hsl(var(--color-danger))]/30 bg-[hsl(var(--color-danger-soft))] p-5 text-sm text-[hsl(var(--color-danger-strong))]">
          Daftar pegawai belum dapat dimuat. Coba lagi setelah konfigurasi
          session dan koneksi SISTER diperiksa.
        </div>
      )}

      {pegawaiQuery.data && (
        <>
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-[hsl(var(--color-muted))]">
              Menampilkan {pegawaiQuery.data.items.length} dari {pegawaiQuery.data.total} pegawai
            </p>
            <p className="text-[11px] text-[hsl(var(--color-muted))]">
              Data: {pegawaiQuery.data.source === "fixture" ? "synthetic fixture" : "SISTER"}
            </p>
          </div>
          {pegawaiQuery.data.items.length > 0 ? (
            <PegawaiResultsTable items={pegawaiQuery.data.items} />
          ) : (
            <div className="rounded-xl border border-dashed border-[hsl(var(--color-border))] bg-white p-10 text-center">
              <p className="text-sm font-semibold text-[hsl(var(--color-text))]">
                Pegawai tidak ditemukan
              </p>
              <p className="mt-1 text-xs text-[hsl(var(--color-muted))]">
                Ubah kata kunci atau pilih jenis identifier lain.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
