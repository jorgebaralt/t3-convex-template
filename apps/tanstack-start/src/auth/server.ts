import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { authClient } from "./client";

// Server function to fetch user session with cookie forwarding
// This enables SSR for authentication state
export const fetchSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getRequest();

    const { data } = await authClient.getSession({
      fetchOptions: {
        headers: {
          cookie: request.headers.get("cookie") ?? "",
        },
      },
    });

    return data;
  },
);
