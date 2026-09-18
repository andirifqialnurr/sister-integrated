"use client";

import { useQuery } from "@tanstack/react-query";

import { Select } from "@/component/ui/select";
import { useTRPC } from "@/lib/trpc";

type BkdSemesterPickerProps = {
  value: string;
  onChange: (semesterId: string) => void;
};

export function BkdSemesterPicker({ onChange, value }: BkdSemesterPickerProps) {
  const trpc = useTRPC();
  const semesterQuery = useQuery(trpc.referensi.get_semester.queryOptions({}));

  return (
    <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
      <Select
        ariaLabel="Pilih semester"
        disabled={semesterQuery.isPending || semesterQuery.isError}
        onValueChange={onChange}
        options={[
          { label: "Pilih semester", value: "" },
          ...(semesterQuery.data?.items.map((item) => ({
            label: `${item.nama} (${item.id})`,
            value: String(item.id),
          })) ?? []),
        ]}
        value={value}
      />
      {semesterQuery.isError && (
        <p className="text-xs text-[hsl(var(--color-danger-strong))]">
          Semester belum dapat dimuat.
        </p>
      )}
    </div>
  );
}
