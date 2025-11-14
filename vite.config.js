import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    outDir: "assets",
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      input: "./assets/tailwind.input.css",
      output: {
        dir: "assets",
        assetFileNames: "tailwind.output.css"
      }
    }
  }
});
