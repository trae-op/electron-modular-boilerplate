import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from "node:path";
import { defineConfig } from "vitest/config";

dotenv.config();

export default defineConfig({
  plugins: [react()],
  base: "./",
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/renderer/test/setup.ts",
  },
  build: {
    outDir: "dist-renderer",
  },
  server: {
    port: process.env.LOCALHOST_PORT
      ? Number(process.env.LOCALHOST_PORT)
      : 3000,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@windows": path.resolve(__dirname, "src/renderer/windows"),
      "@utils": path.resolve(__dirname, "src/renderer/utils"),
      "@hooks": path.resolve(__dirname, "src/renderer/hooks"),
      "@layouts": path.resolve(__dirname, "src/renderer/layouts"),
      "@conceptions": path.resolve(__dirname, "src/renderer/conceptions"),
      "@components": path.resolve(__dirname, "src/renderer/components"),
      "@composites": path.resolve(__dirname, "src/renderer/composites"),
      "@shared": path.resolve(__dirname, "src/renderer/shared"),
      "@config": path.resolve(__dirname, "src/renderer/config"),
      "#main": path.resolve(__dirname, "src/main"),
      "#main/": path.resolve(__dirname, "src/main/"),
    },
  },
});
