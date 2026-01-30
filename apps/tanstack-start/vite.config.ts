import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    port: 3001, // Different from Next.js (3000)
  },
  plugins: [
    tsConfigPaths(),
    tanstackStart(),
    viteReact(), // Must come after tanstackStart
    tailwindcss(),
  ],
});
