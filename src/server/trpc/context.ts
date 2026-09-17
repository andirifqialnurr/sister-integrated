import { getCurrentUser, type AppSessionUser } from "@/server/auth/session";

export type TrpcContext = {
  requestId: string;
  request: Request;
  user: AppSessionUser | null;
};

function getSafeRequestId(request: Request) {
  const supplied = request.headers.get("x-request-id");

  if (supplied && /^[A-Za-z0-9._:-]{1,128}$/.test(supplied)) {
    return supplied;
  }

  return crypto.randomUUID();
}

export async function createTRPCContext({
  req,
}: {
  req: Request;
}): Promise<TrpcContext> {
  return {
    requestId: getSafeRequestId(req),
    request: req,
    user: getCurrentUser(),
  };
}
