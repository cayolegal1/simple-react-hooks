import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "simple-react-hooks",
    },
    
    sourcemap: true,
    target: "ESNext",
    rollupOptions: {
      external: ["react", "react-dom", "html2canvas"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          html2canvas: "html2Canvas"
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx"],
  },
  plugins: [
    react(),
    tsconfigPaths(),
    dts({
      outDir: "dist",
      include: ["src"],
      exclude: ["**/*.test.ts", "tests/", "vitest.config.*"],
    }),
  ],
});
