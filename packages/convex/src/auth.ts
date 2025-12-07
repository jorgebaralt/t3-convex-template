import type { GenericCtx } from "@convex-dev/better-auth";
import { expo } from "@better-auth/expo";
import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";

import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { action, query } from "./_generated/server";

const siteUrl = process.env.SITE_URL!;
const discordClientId = process.env.AUTH_DISCORD_ID!;
const discordClientSecret = process.env.AUTH_DISCORD_SECRET!;
const authSecret = process.env.AUTH_SECRET!;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false },
): ReturnType<typeof betterAuth> => {
  return betterAuth({
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    logger: {
      disabled: optionsOnly,
    },
    baseURL: siteUrl,
    trustedOrigins: [
      "servifai://",
      siteUrl,
      ...(process.env.NODE_ENV === "development"
        ? [
            "exp://", // Expo Go origin header
            "exp://*/*", // Trust all Expo development URLs
            "exp://10.0.0.*:*/*", // Trust 10.0.0.x IP range
            "exp://192.168.*.*:*/*", // Trust 192.168.x.x IP range
            "exp://172.*.*.*:*/*", // Trust 172.x.x.x IP range
            "exp://localhost:*/*", // Trust localhost
          ]
        : []),
    ],
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    secret: authSecret,
    socialProviders: {
      discord: {
        clientId: discordClientId,
        clientSecret: discordClientSecret,
        redirectURI: `${siteUrl}/api/auth/callback/discord`,
      },
    },
    plugins: [
      // The Expo and Convex plugins are required for Convex compatibility
      expo(),
      convex(),
    ],

    onAPIError: {
      onError(error, ctx) {
        console.error("BETTER AUTH API ERROR", error, ctx);
      },
    },
  });
};

// Get the current authenticated user (throws if not authenticated)
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});

// Get the current authenticated user (returns null if not authenticated)
export const safeGetCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.safeGetAuthUser(ctx);
  },
});

// Sign out action
export const signOut = action({
  args: {},
  handler: async (ctx) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
    await auth.api.signOut({
      headers,
    });
  },
});
