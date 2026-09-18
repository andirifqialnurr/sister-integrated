"use client";

import { useState } from "react";

import { PageShell } from "@/component/ui/page_shell";

import { BkdSdmPicker } from "../widget/bkd_sdm_picker";
import { BkdWorkspaceWidget } from "../widget/bkd_workspace_widget";

export function BkdPage() {
  const [sdmId, setSdmId] = useState("");

  return (
    <PageShell
      actions={<BkdSdmPicker onChange={setSdmId} value={sdmId} />}
      activeLabel="BKD"
      breadcrumb={[{ href: "/", label: "Ikhtisar" }, { label: "BKD" }]}
    >
      <BkdWorkspaceWidget sdmId={sdmId} />
    </PageShell>
  );
}
