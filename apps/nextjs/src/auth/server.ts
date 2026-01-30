import "server-only";

import { cache } from "react";
import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";
import { api } from "@acme/convex";
import { env } from "~/env";

const auth = convexBetterAuthNextJs({
  convexUrl: env.NEXT_PUBLIC_CONVEX_URL,
  convexSiteUrl: env.NEXT_PUBLIC_CONVEX_SITE_URL ?? env.NEXT_PUBLIC_CONVEX_URL,
});

export const getToken = () => {
  return auth.getToken();
};

export const getCurrentUser = cache(async () => {
  return auth.fetchAuthQuery(api.auth.safeGetCurrentUser);
});

// Server action helper to sign out
export async function signOut() {
  return auth.fetchAuthAction(api.auth.signOut);
}
