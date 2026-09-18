"use client";

import { useState } from "react";

import { PageShell } from "@/component/ui/page_shell";

import { PenugasanSdmPicker } from "../widget/penugasan_sdm_picker";
import { PenugasanWorkspaceWidget } from "../widget/penugasan_workspace_widget";

export function PenugasanPage() {
  const [sdmId, setSdmId] = useState("");

  return (
    <PageShell
      actions={<PenugasanSdmPicker onChange={setSdmId} value={sdmId} />}
      activeLabel="Penugasan"
      breadcrumb={[{ href: "/", label: "Ikhtisar" }, { label: "Penugasan" }]}
    >
      <PenugasanWorkspaceWidget sdmId={sdmId} />
    </PageShell>
  );
}
