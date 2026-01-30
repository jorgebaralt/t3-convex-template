import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";

import { authClient } from "./auth/client";
import { routeTree } from "./routeTree.gen";
import { env } from "./env";

export function createRouter() {
  const convexClient = new ConvexReactClient(env.VITE_CONVEX_URL, {
    unsavedChangesWarning: false,
    // Pause queries until the user's auth state is known
    // This ensures mutations have proper auth context
  });

  const convexQueryClient = new ConvexQueryClient(convexClient);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
        staleTime: 5 * 1000,
      },
    },
  });

  convexQueryClient.connect(queryClient);

  const router = routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { queryClient, convexClient },
      defaultPreload: "intent",
      scrollRestoration: true,
      Wrap: ({ children }) => (
        <ConvexBetterAuthProvider client={convexClient} authClient={authClient}>
          {children}
        </ConvexBetterAuthProvider>
      ),
    }),
    queryClient,
  );

  return router;
}

// TanStack Start expects getRouter for SSR
export function getRouter() {
  return createRouter();
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
