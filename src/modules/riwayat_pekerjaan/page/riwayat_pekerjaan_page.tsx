"use client";

import { useState } from "react";

import { PageShell } from "@/component/ui/page_shell";

import { RiwayatPekerjaanSdmPicker } from "../widget/riwayat_pekerjaan_sdm_picker";
import { RiwayatPekerjaanWorkspaceWidget } from "../widget/riwayat_pekerjaan_workspace_widget";

export function RiwayatPekerjaanPage() {
  const [sdmId, setSdmId] = useState("");

  return (
    <PageShell
      actions={<RiwayatPekerjaanSdmPicker onChange={setSdmId} value={sdmId} />}
      activeLabel="Riwayat Pekerjaan"
      breadcrumb={[{ href: "/", label: "Ikhtisar" }, { label: "Riwayat Pekerjaan" }]}
    >
      <RiwayatPekerjaanWorkspaceWidget sdmId={sdmId} />
    </PageShell>
  );
}
