import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The platform serves this app at a sub-path. Every asset URL and every
// in-app router URL must respect that prefix.
const BASE = "/alex/dfe-digital-standards-claude-code/";

export default defineConfig({
  base: BASE,
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Local dev: forward /api/* to the Hono server on 8787.
      // In prod the platform serves /alex/.../api/* itself, so no proxy needed there.
      [`${BASE}api`]: {
        target: "http://localhost:8787",
        changeOrigin: true,
        rewrite: (path) => path.replace(BASE, "/"),
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
