import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    outDir: "assets",
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      input: "./tailwind.css",
      output: {
        dir: "assets",
        assetFileNames: "tailwind.output.css"
      }
    }
  }
});
