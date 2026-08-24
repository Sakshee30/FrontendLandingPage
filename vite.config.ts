import { defineConfig } from "vite";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

function figmaAssetResolver() {
  return {
    name: "figma-asset-resolver",
    resolveId(id: string) {
      if (id.startsWith("figma:asset/")) {
        const filename = id.replace("figma:asset/", "");
        return path.resolve(__dirname, "src/assets", filename);
      }
    },
  };
}

export default defineConfig({
  plugins: [figmaAssetResolver(), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    proxy: {
      '/api': 'http://127.0.0.1:3001',
      '/r/': 'http://127.0.0.1:3001',
      '/b/': 'http://127.0.0.1:3001',
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ["recharts"],
          ui: ["lucide-react"],
          qr: ["qrcode"],
        },
      },
    },
  },
  esbuild: {
    // Strip console.* and debugger statements from the production bundle
    drop: ["console", "debugger"],
  },
  assetsInclude: ["**/*.svg", "**/*.csv"],
});
