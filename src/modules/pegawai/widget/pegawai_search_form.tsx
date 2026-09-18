"use client";

import { Search } from "lucide-react";

import { Button } from "@/component/ui/button";
import { Select } from "@/component/ui/select";

import type { PegawaiSearchInput } from "../api/pegawai_schemas";

const searchOptions = [
  { label: "Nama pegawai", value: "nama" },
  { label: "NIDN", value: "nidn" },
  { label: "NIP", value: "nip" },
  { label: "NUPTK", value: "nuptk" },
] as const;

type PegawaiSearchFormProps = {
  searchBy: PegawaiSearchInput["search_by"];
  search: string;
  isFetching: boolean;
  onSearchByChange: (searchBy: PegawaiSearchInput["search_by"]) => void;
  onSearchChange: (search: string) => void;
  onSubmit: () => void;
};

export function PegawaiSearchForm({
  isFetching,
  onSearchByChange,
  onSearchChange,
  onSubmit,
  search,
  searchBy,
}: PegawaiSearchFormProps) {
  return (
    <form
      className="flex flex-col gap-3 md:flex-row md:items-center"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Select
        ariaLabel="Cari berdasarkan"
        onValueChange={(value) => onSearchByChange(value as PegawaiSearchInput["search_by"])}
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
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchBy === "nama" ? "Contoh: Aditya" : `Masukkan ${searchBy.toUpperCase()}`}
          value={search}
        />
      </label>
      <Button disabled={isFetching} type="submit">
        {isFetching ? "Memuat..." : "Cari pegawai"}
      </Button>
    </form>
  );
}
