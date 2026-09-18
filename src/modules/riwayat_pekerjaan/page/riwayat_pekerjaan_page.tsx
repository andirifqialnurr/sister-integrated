import { PageShell } from "@/component/ui/page_shell";

import { RiwayatPekerjaanWorkspaceWidget } from "../widget/riwayat_pekerjaan_workspace_widget";

export function RiwayatPekerjaanPage() {
  return (
    <PageShell
      activeLabel="Riwayat Pekerjaan"
      breadcrumb={[{ href: "/", label: "Ikhtisar" }, { label: "Riwayat Pekerjaan" }]}
    >
      <RiwayatPekerjaanWorkspaceWidget />
    </PageShell>
  );
}
