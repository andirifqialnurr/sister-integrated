import { PageShell } from "@/component/ui/page_shell";

import { BkdWorkspaceWidget } from "../widget/bkd_workspace_widget";

export function BkdPage() {
  return (
    <PageShell
      activeLabel="BKD"
      breadcrumb={[{ href: "/", label: "Ikhtisar" }, { label: "BKD" }]}
    >
      <BkdWorkspaceWidget />
    </PageShell>
  );
}
