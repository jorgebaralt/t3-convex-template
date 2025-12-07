import Constants, { ExecutionEnvironment } from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { expoClient } from "@better-auth/expo/client";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

// Point to Next.js for auth (handles OAuth callbacks)
const baseURL = process.env.EXPO_PUBLIC_NEXTJS_URL ?? "http://localhost:3000";

const getScheme = (): string => {
  const configScheme = Constants.expoConfig?.scheme;
  if (typeof configScheme === "string") return configScheme;
  if (
    Array.isArray(configScheme) &&
    configScheme.length > 0 &&
    configScheme[0]
  ) {
    return configScheme[0];
  }
  return "servifai";
};

const scheme = getScheme();

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    headers: {
      Origin:
        Constants.executionEnvironment === ExecutionEnvironment.StoreClient
          ? "exp://"
          : `${scheme}://`,
    },
  },
  plugins: [
    expoClient({
      scheme: scheme,
      storagePrefix: scheme,
      storage: SecureStore,
    }),
    convexClient(),
  ],
});
