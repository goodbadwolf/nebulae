import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "fs";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    {
      name: "copy-html",
      writeBundle() {
        mkdirSync("dist/popup", { recursive: true });
        copyFileSync("dist/src/popup/index.html", "dist/popup/index.html");

        // Fix paths in the HTML file
        const htmlPath = "dist/popup/index.html";
        let html = readFileSync(htmlPath, "utf-8");
        html = html.replace(/src=".*?popup\/index\.js"/, 'src="./index.js"');
        html = html.replace(/href=".*?popup\/styles\.css"/, 'href="./styles.css"');
        writeFileSync(htmlPath, html);
      },
    },
  ],

  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup/index.html"),
      },
      output: {
        entryFileNames: "[name]/index.js",
        chunkFileNames: "[name]/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "[name]/styles[extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },

  publicDir: "public",
});
