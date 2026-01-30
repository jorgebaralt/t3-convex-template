import { createFileRoute } from "@tanstack/react-router";
import { convexBetterAuthReactStart } from "@convex-dev/better-auth/react-start";
import { env } from "~/env";

const auth = convexBetterAuthReactStart({
  convexSiteUrl: env.VITE_CONVEX_SITE_URL,
  convexUrl: env.VITE_CONVEX_URL,
});

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }) => auth.handler(request),
      POST: async ({ request }) => auth.handler(request),
    },
  },
});
