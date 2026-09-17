import { describe, expect, it } from "vitest";

import { pegawaiSearchInputSchema } from "./pegawai_schemas";

describe("pegawaiSearchInputSchema", () => {
  it("applies safe defaults for an unfiltered search", () => {
    expect(pegawaiSearchInputSchema.parse({})).toEqual({
      search_by: "nama",
      search: "",
      page: 1,
      per_page: 20,
    });
  });

  it("rejects a short name when id_sp is supplied", () => {
    const result = pegawaiSearchInputSchema.safeParse({
      id_sp: "1782f838-f5dd-485c-b29e-00339227c4d0",
      search_by: "nama",
      search: "ad",
    });

    expect(result.success).toBe(false);
  });

  it("accepts an identifier search without the id_sp name rule", () => {
    const result = pegawaiSearchInputSchema.safeParse({
      id_sp: "1782f838-f5dd-485c-b29e-00339227c4d0",
      search_by: "nidn",
      search: "032999923",
    });

    expect(result.success).toBe(true);
  });
});
