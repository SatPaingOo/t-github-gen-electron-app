import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@appConfig": fileURLToPath(
        new URL("../app.config.json", import.meta.url),
      ),
    },
  },
  test: {
    environment: "node",
    globals: true, // jest-style globals so the shared test file runs unchanged
    include: ["src/**/*.test.ts"],
  },
});
