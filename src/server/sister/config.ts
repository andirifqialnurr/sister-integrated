import { z } from "zod";

const optionalText = z.string().trim().min(1).optional();

const sisterEnvironmentSchema = z.object({
  SISTER_BASE_URL: optionalText,
  SISTER_ID_PENGGUNA: optionalText,
  SISTER_USERNAME: optionalText,
  SISTER_PASSWORD: optionalText,
  SISTER_CREDENTIAL_REF: optionalText,
});

export type SisterConfig = {
  fixture_mode: boolean;
  base_url: string | null;
  id_pengguna: string | null;
  username: string | null;
  password: string | null;
  credential_ref: string | null;
};

export function getSisterConfig(): SisterConfig {
  const environment = sisterEnvironmentSchema.parse(process.env);
  const fixtureMode =
    process.env.NODE_ENV !== "production" &&
    process.env.SISTER_FIXTURE_MODE !== "false";

  if (fixtureMode) {
    return {
      fixture_mode: true,
      base_url: environment.SISTER_BASE_URL ?? null,
      id_pengguna: environment.SISTER_ID_PENGGUNA ?? null,
      username: null,
      password: null,
      credential_ref: environment.SISTER_CREDENTIAL_REF ?? null,
    };
  }

  const baseUrl = environment.SISTER_BASE_URL;
  if (!baseUrl) {
    throw new Error("SISTER configuration is incomplete: base URL is required");
  }

  const parsedBaseUrl = new URL(baseUrl);
  if (parsedBaseUrl.protocol !== "https:") {
    throw new Error("SISTER configuration requires an HTTPS base URL");
  }

  if (!environment.SISTER_ID_PENGGUNA) {
    throw new Error("SISTER configuration is incomplete: id_pengguna is required");
  }

  if (!environment.SISTER_USERNAME || !environment.SISTER_PASSWORD) {
    throw new Error("SISTER credentials are not configured");
  }

  return {
    fixture_mode: false,
    base_url: parsedBaseUrl.toString(),
    id_pengguna: environment.SISTER_ID_PENGGUNA,
    username: environment.SISTER_USERNAME,
    password: environment.SISTER_PASSWORD,
    credential_ref: environment.SISTER_CREDENTIAL_REF ?? null,
  };
}
