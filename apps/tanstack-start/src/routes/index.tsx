import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@acme/ui/button";
import { signIn, signOut, useSession } from "~/auth/client";
import { fetchSession } from "~/auth/server";
import {
  CreatePostForm,
  PostCardSkeleton,
  PostList,
  postsQueryOptions,
} from "./-components/posts";

export const Route = createFileRoute("/")({
  // Prefetch posts and session on the server for SSR
  loader: async ({ context }) => {
    const [session] = await Promise.all([
      fetchSession(),
      context.queryClient.ensureQueryData(postsQueryOptions()),
    ]);
    return { session };
  },
  // Show skeletons while loading
  pendingComponent: () => (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center py-16">
      <h1 className="text-5xl font-extrabold tracking-tight">
        TanStack <span className="text-primary">Start</span>
      </h1>
      <p className="text-muted-foreground mt-4 text-lg">
        With Convex + Better Auth
      </p>
      <div className="mt-8 w-full max-w-2xl">
        <PostCardSkeleton />
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    </main>
  ),
  component: HomePage,
});

function HomePage() {
  // Get SSR-prefetched session from loader
  const loaderData = Route.useLoaderData();

  // useSession for real-time updates after hydration
  const { data: clientSession, isPending: isSessionPending } = useSession();

  // Use client session if available (after hydration), otherwise use prefetched
  // prefetchedSession is null if unauthenticated, or session object if authenticated
  const session = clientSession ?? loaderData.session;

  // Only show loading if useSession is pending AND we don't have loader data
  // Since loader always runs for this route, this effectively means never show loading
  const showLoading = isSessionPending && !("session" in loaderData);

  const handleSignIn = async () => {
    await signIn.social({
      provider: "discord",
      callbackURL: window.location.origin,
    });
  };

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center py-16">
      <h1 className="text-5xl font-extrabold tracking-tight">
        TanStack <span className="text-primary">Start</span>
      </h1>
      <p className="text-muted-foreground mt-4 text-lg">
        With Convex + Better Auth
      </p>

      <div className="mt-8">
        {showLoading ? (
          <p>Loading...</p>
        ) : session ? (
          <div className="flex flex-col items-center gap-4">
            <p>Welcome, {session.user.email}</p>
            <Button onClick={() => signOut().then(() => window.location.reload())}>
              Sign Out
            </Button>
          </div>
        ) : (
          <Button onClick={handleSignIn}>Sign in with Discord</Button>
        )}
      </div>

      {/* Post Form - only works when authenticated */}
      <div className="mt-8 w-full max-w-2xl">
        <CreatePostForm />
      </div>

      {/* Post List - SSR prefetched, then real-time updates */}
      <div className="mt-8 w-full max-w-2xl overflow-y-auto">
        <PostList />
      </div>
    </main>
  );
}
