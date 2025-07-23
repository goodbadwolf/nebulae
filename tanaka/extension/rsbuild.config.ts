import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginTypeCheck } from "@rsbuild/plugin-type-check";

import defaultConfig from "./tanaka.config";

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginTypeCheck({
      enable: true,
      tsCheckerOptions: {
        typescript: {
          configFile: "./tsconfig.json",
        },
      },
    }),
  ],
  source: {
    entry: {
      popup: {
        import: defaultConfig.entries.popup,
        html: true,
      },
      background: {
        import: defaultConfig.entries.background!,
        html: false,
      },
      // Playground entries
      "playground-js/index": {
        import: "./src/playground-js/index.ts",
        html: true,
      },
      "playground-js/popup": {
        import: "./src/playground-js/popup.ts",
        html: true,
      },
      "playground-js/welcome": {
        import: "./src/playground-js/welcome.ts",
        html: true,
      },
      "playground-js/settings": {
        import: "./src/playground-js/settings.ts",
        html: true,
      },
      "playground-js/manager": {
        import: "./src/playground-js/manager.ts",
        html: true,
      },
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
    },
  },
  output: {
    distPath: {
      root: defaultConfig.buildDir,
    },
    filename: {
      html: "[name]/index.html",
    },
    copy: [
      {
        from: defaultConfig.staticDir,
        to: defaultConfig.buildDir,
      },
      {
        from: "./src/playground-js/styles",
        to: "./playground-js/styles",
      },
      {
        from: "./src/playground-js/mock-data.js",
        to: "./playground-js/mock-data.js",
      },
    ],
  },
  html: {
    template({ entryName }) {
      // Map entry names to their respective HTML templates
      const templates: Record<string, string> = {
        popup: "./src/popup/index.html",
        "playground-js/index": "./src/playground-js/index.html",
        "playground-js/popup": "./src/playground-js/popup.html",
        "playground-js/welcome": "./src/playground-js/welcome.html",
        "playground-js/settings": "./src/playground-js/settings.html",
        "playground-js/manager": "./src/playground-js/manager.html",
      };
      return templates[entryName] || "./src/popup/index.html";
    },
  },
  performance: {
    chunkSplit: {
      strategy: "all-in-one",
    },
  },
  tools: {
    rspack: {
      target: ["web", "es2020"],
      resolve: {
        fallback: {
          // process is not defined in the browser, so we need to fallback to false
          process: false,
        },
      },
    },
  },
  dev: {
    writeToDisk: true,
    hmr: true,
    liveReload: true,
  },
});
