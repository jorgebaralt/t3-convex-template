/**
 * Theme colors for use with React Native StyleSheet.
 * These values match the CSS variables defined in tooling/tailwind/theme.css
 * Use these when you need colors outside of NativeWind (e.g., Toast, native components).
 */
export const colors = {
  light: {
    background: "#fbf9fb",
    foreground: "#1f1a1e",
    card: "#ffffff",
    cardForeground: "#1f1a1e",
    primary: "#c03484",
    primaryForeground: "#ffffff",
    muted: "#f5f2f5",
    mutedForeground: "#716b70",
    destructive: "#e5484d",
    destructiveForeground: "#ffffff",
    border: "#ebe6ea",
    success: "#30a46c",
    info: "#0090ff",
  },
  dark: {
    background: "#1a1618",
    foreground: "#faf8fa",
    card: "#1a1618",
    cardForeground: "#faf8fa",
    primary: "#d6679a",
    primaryForeground: "#1a1618",
    muted: "#2c2628",
    mutedForeground: "#908b8f",
    destructive: "#6f2d2f",
    destructiveForeground: "#ffffff",
    border: "#3a3436",
    success: "#30a46c",
    info: "#0090ff",
  },
} as const;

export type ThemeColors = typeof colors.light;
