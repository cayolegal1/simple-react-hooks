import viteConfig from "./vite.config";
import { mergeConfig, defineConfig } from "vitest/config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      passWithNoTests: true,
      coverage: {
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
        include: ["src/**/*"],
        exclude: ["**/index.ts"],
      },
    },
  })
);
