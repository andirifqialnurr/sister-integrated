import { PageShell } from "@/component/ui/page_shell";

import { PendidikanFormalWorkspaceWidget } from "../widget/pendidikan_formal_workspace_widget";

export function PendidikanFormalPage() {
  return (
    <PageShell
      activeLabel="Pendidikan Formal"
      breadcrumb={[{ href: "/", label: "Ikhtisar" }, { label: "Pendidikan Formal" }]}
    >
      <PendidikanFormalWorkspaceWidget />
    </PageShell>
  );
}
