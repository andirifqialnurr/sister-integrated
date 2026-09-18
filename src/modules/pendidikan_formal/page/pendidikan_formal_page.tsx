"use client";

import { useState } from "react";

import { PageShell } from "@/component/ui/page_shell";

import { PendidikanFormalSdmPicker } from "../widget/pendidikan_formal_sdm_picker";
import { PendidikanFormalWorkspaceWidget } from "../widget/pendidikan_formal_workspace_widget";

export function PendidikanFormalPage() {
  const [sdmId, setSdmId] = useState("");

  return (
    <PageShell
      actions={<PendidikanFormalSdmPicker onChange={setSdmId} value={sdmId} />}
      activeLabel="Pendidikan Formal"
      breadcrumb={[{ href: "/", label: "Ikhtisar" }, { label: "Pendidikan Formal" }]}
    >
      <PendidikanFormalWorkspaceWidget sdmId={sdmId} />
    </PageShell>
  );
}
