"use client";

import { useQuery } from "@tanstack/react-query";

import {
  IntegrationStatusCard,
  type IntegrationCardState,
} from "@/component/widget/integration_status_card";
import { useTRPC } from "@/lib/trpc";

export function OverviewStatusWidget() {
  const trpc = useTRPC();
  const statusQuery = useQuery(trpc.overview.status.queryOptions());

  let state: IntegrationCardState = "loading";
  if (statusQuery.isError) state = "error";
  if (statusQuery.data?.sister_mode === "fixture") state = "fixture";
  if (statusQuery.data?.sister_mode === "live") {
    state = statusQuery.data.sister_configuration === "ready" ? "ready" : "incomplete";
  }

  return (
    <IntegrationStatusCard
      databaseState={statusQuery.data?.database_state}
      onRefresh={() => void statusQuery.refetch()}
      state={state}
    />
  );
}

