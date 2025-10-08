import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";
import prebuildBookmarklet from "./prebuild-bookmarklet-plugin.ts";

export default defineConfig({
  plugins: [
    tailwindcss(),
    cloudflare(),
    react(),
    tsconfigPaths(),
    prebuildBookmarklet("./src/bookmarklet.ts"),
  ],
});
