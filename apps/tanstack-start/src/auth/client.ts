import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { env } from "~/env";

function getBaseURL(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (env.DEV) {
    return "http://localhost:3001";
  }
  if (!env.SITE_URL) {
    throw new Error("SITE_URL environment variable is required in production");
  }
  return env.SITE_URL as string;
}

const baseURL = getBaseURL();

export const authClient = createAuthClient({
  baseURL,
  plugins: [convexClient()],
});

export const { signIn, signOut, signUp, useSession, getSession } = authClient;
