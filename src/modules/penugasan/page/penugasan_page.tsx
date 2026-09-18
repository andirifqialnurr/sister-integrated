import { PageShell } from "@/component/ui/page_shell";

import { PenugasanWorkspaceWidget } from "../widget/penugasan_workspace_widget";

export function PenugasanPage() {
  return (
    <PageShell
      activeLabel="Penugasan"
      breadcrumb={[{ href: "/", label: "Ikhtisar" }, { label: "Penugasan" }]}
    >
      <PenugasanWorkspaceWidget />
    </PageShell>
  );
}
