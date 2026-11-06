import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.PAGES_BASE ?? "/",
  build: { rollupOptions: { input: ["index.html", "dom-demo.html"] } },
  plugins: [react(), tailwindcss()],
});
