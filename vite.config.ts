import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath } from "node:url";
import { copyFileSync } from "node:fs";

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  // Served from https://mohammed-sufiyaan.github.io/Care-Connect/
  base: process.env.BASE_PATH ?? "/Care-Connect/",
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    {
      // GitHub Pages serves 404.html for unknown paths, so deep links like /network still load the app.
      name: "spa-404-fallback",
      closeBundle() {
        copyFileSync(r("./dist/index.html"), r("./dist/404.html"));
      },
    },
  ],
  resolve: { alias: { "@": r("./src") } },
});
