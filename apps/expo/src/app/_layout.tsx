import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import type { ToastConfig } from "react-native-toast-message";
import Toast, { BaseToast } from "react-native-toast-message";
import { authClient } from "~/utils/auth";
import { colors } from "~/utils/theme";
import "../styles.css";

// Get Convex URL from environment
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error("Missing EXPO_PUBLIC_CONVEX_URL environment variable");
}

const convex = new ConvexReactClient(convexUrl, {
  logger: {
    log: console.log,
    warn: console.warn,
    error: (msg: unknown, ...args: unknown[]) => {
      // Filter out handled auth errors that we display as toasts
      if (typeof msg === "string" && msg.includes("Unauthenticated")) {
        return;
      }
      console.error(msg, ...args);
    },
    logVerbose: () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
    },
  },
});

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? colors.dark : colors.light;

  const toastConfig: ToastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: theme.success,
          backgroundColor: theme.card,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: "600",
          color: theme.foreground,
        }}
        text2Style={{
          fontSize: 13,
          color: theme.mutedForeground,
        }}
      />
    ),
    error: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: theme.destructive,
          backgroundColor: theme.card,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: "600",
          color: theme.foreground,
        }}
        text2Style={{
          fontSize: 13,
          color: theme.mutedForeground,
        }}
      />
    ),
    info: (props) => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: theme.info,
          backgroundColor: theme.card,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: "600",
          color: theme.foreground,
        }}
        text2Style={{
          fontSize: 13,
          color: theme.mutedForeground,
        }}
      />
    ),
  };

  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      {/*
          The Stack component displays the current page.
          It also allows you to configure your screens
        */}
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.primary,
          },
          contentStyle: {
            backgroundColor: theme.background,
          },
        }}
      />
      <StatusBar />
      <Toast config={toastConfig} />
    </ConvexBetterAuthProvider>
  );
}
