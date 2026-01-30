import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";
import { env } from "~/env";

const auth = convexBetterAuthNextJs({
  convexUrl: env.NEXT_PUBLIC_CONVEX_URL,
  convexSiteUrl: env.NEXT_PUBLIC_CONVEX_SITE_URL ?? env.NEXT_PUBLIC_CONVEX_URL,
});

export const GET = auth.handler.GET;
export const POST = auth.handler.POST;
