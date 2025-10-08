import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";
import prebuildBookmarklet from "./prebuild-bookmarklet-plugin.ts";
import { transpile } from "Typescript";
import { minify_sync } from "terser";

export default defineConfig({
  plugins: [
    tailwindcss(),
    cloudflare(),
    react(),
    tsconfigPaths(),
    prebuildBookmarklet("./src/bookmarklet.ts", transpile, minify_sync),
  ],
});
