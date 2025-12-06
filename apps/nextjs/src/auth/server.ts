import "server-only";

import { cache } from "react";
import { fetchAction, fetchQuery } from "convex/nextjs";
import { api } from "@acme/convex";
import { createAuth } from "@acme/convex/auth";
import { getToken as getTokenNextjs } from "@convex-dev/better-auth/nextjs";

export const getToken = () => {
  return getTokenNextjs(createAuth);
};

export const getCurrentUser = cache(async () => {
  const token = await getToken();
  return await fetchQuery(api.auth.safeGetCurrentUser, {}, { token });
});

// Server action helper to sign out
export async function signOut() {
  const token = await getToken();
  await fetchAction(api.auth.signOut, {}, { token });
}
