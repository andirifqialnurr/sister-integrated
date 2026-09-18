import { PageShell } from "@/component/ui/page_shell";

import { PegawaiSearchWidget } from "../widget/pegawai_search_widget";

export function PegawaiPage() {
  return (
    <PageShell
      activeLabel="Pegawai"
      breadcrumb={[{ href: "/", label: "Ikhtisar" }, { label: "Pegawai" }]}
    >
      <PegawaiSearchWidget />
    </PageShell>
  );
}
