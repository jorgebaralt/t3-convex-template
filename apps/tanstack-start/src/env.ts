import { z } from "zod";

const envSchema = z.object({
  VITE_CONVEX_URL: z.string().url(),
  VITE_CONVEX_SITE_URL: z.string().url(),
  SITE_URL: z.string().url().optional(),
  DEV: z.boolean(),
});

export const env = envSchema.parse({
  VITE_CONVEX_URL: import.meta.env.VITE_CONVEX_URL,
  VITE_CONVEX_SITE_URL: import.meta.env.VITE_CONVEX_SITE_URL,
  SITE_URL: import.meta.env.SITE_URL,
  DEV: import.meta.env.DEV,
});
