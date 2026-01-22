import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
      },
    },
  },
  test: {
    environment: "node",
    include: ["src/main/**/*.test.ts"],
    globals: true,
    setupFiles: ["./src/main/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/main/**/*.ts"],
      exclude: [
        "src/main/**/*.test.ts",
        "src/main/**/*.d.ts",
        "src/main/app.ts",
        "src/main/preload.cts",
      ],
    },
    mockReset: true,
    restoreMocks: true,
    clearMocks: true,
    deps: {
      inline: ["electron", "electron-store", "@devisfuture/electron-modular"],
    },
  },
  resolve: {
    alias: {
      "#shared": path.resolve(__dirname, "./src/main/@shared"),
      "#main": path.resolve(__dirname, "./src/main"),
      electron: path.resolve(__dirname, "./src/main/test/electron.mock.ts"),
      "electron-store": path.resolve(
        __dirname,
        "./src/main/test/electron-store.mock.ts",
      ),
    },
  },
});
