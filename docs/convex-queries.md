# Convex Query Patterns

## Quick Decision

| Scenario | Use |
|----------|-----|
| Client-only (Expo, SPA) | Convex `useQuery` |
| SSR/SSG (Next.js, TanStack Start) | TanStack Query + `convexQuery` |

## Feature Comparison

| Feature | Convex Native | TanStack Query |
|---------|---------------|----------------|
| Real-time updates | Yes | Yes (with setup) |
| SSR support | No | Yes |
| Automatic caching | Yes | Yes |
| Prefetching | No | Yes |
| Bundle size | Smaller | Larger |
| Setup complexity | Minimal | Moderate |

## Code Examples

### Convex Native (Client-only)

```tsx
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

function UserList() {
  const users = useQuery(api.users.list);

  if (users === undefined) return <Loading />;
  return <ul>{users.map(u => <li key={u._id}>{u.name}</li>)}</ul>;
}
```

### TanStack Query (SSR-compatible)

```tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";

function UserList() {
  const { data: users } = useSuspenseQuery(convexQuery(api.users.list, {}));

  return <ul>{users.map(u => <li key={u._id}>{u.name}</li>)}</ul>;
}
```

### Server Prefetching (TanStack Start/Next.js)

```tsx
// posts.tsx - Define query options factory for reuse
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "@acme/convex";

// Export query options for use in both loader and component
export const postsQueryOptions = () => convexQuery(api.posts.list, {});

export function PostList() {
  // Reuse the same query options - gets prefetched data, then real-time updates
  const { data: posts, isPending } = useQuery(postsQueryOptions());
  // ...
}
```

```tsx
// route.tsx - Prefetch in loader
import { createFileRoute } from "@tanstack/react-router";
import { PostList, postsQueryOptions } from "./-components/posts";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    // Use ensureQueryData to prefetch on the server
    await context.queryClient.ensureQueryData(postsQueryOptions());
  },
  component: HomePage,
});
```
