"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { PageShell } from "@/component/ui/page_shell";
import { useTRPC } from "@/lib/trpc";

import { PegawaiSearchForm } from "../widget/pegawai_search_form";
import { PegawaiSearchResults } from "../widget/pegawai_search_results";
import type { PegawaiSearchInput } from "../api/pegawai_schemas";

const defaultSearch: PegawaiSearchInput = {
  search_by: "nama",
  search: "",
  page: 1,
  per_page: 20,
};

export function PegawaiPage() {
  const trpc = useTRPC();
  const [searchBy, setSearchBy] = useState<PegawaiSearchInput["search_by"]>("nama");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState(defaultSearch);
  const pegawaiQuery = useQuery(trpc.pegawai.search.queryOptions(submittedSearch));

  return (
    <PageShell
      actions={
        <PegawaiSearchForm
          isFetching={pegawaiQuery.isFetching}
          onSearchByChange={setSearchBy}
          onSearchChange={setSearch}
          onSubmit={() =>
            setSubmittedSearch({
              search_by: searchBy,
              search: search.trim(),
              page: 1,
              per_page: 20,
            })
          }
          search={search}
          searchBy={searchBy}
        />
      }
      activeLabel="Pegawai"
      breadcrumb={[{ href: "/", label: "Ikhtisar" }, { label: "Pegawai" }]}
    >
      <PegawaiSearchResults query={pegawaiQuery} />
    </PageShell>
  );
}
