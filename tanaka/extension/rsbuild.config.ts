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
      "playground/index": {
        import: "./src/playground/index.ts",
        html: true,
      },
      "playground/popup": {
        import: "./src/playground/popup.ts",
        html: true,
      },
      "playground/onboarding": {
        import: "./src/playground/onboarding.ts",
        html: true,
      },
      "playground/settings": {
        import: "./src/playground/settings.ts",
        html: true,
      },
      "playground/manager": {
        import: "./src/playground/manager.ts",
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
        from: "./src/playground/styles",
        to: "./playground/styles",
      },
      {
        from: "./src/playground/mock-data.js",
        to: "./playground/mock-data.js",
      },
    ],
  },
  html: {
    template({ entryName }) {
      // Map entry names to their respective HTML templates
      const templates: Record<string, string> = {
        popup: "./src/popup/index.html",
        "playground/index": "./src/playground/index.html",
        "playground/popup": "./src/playground/popup.html",
        "playground/onboarding": "./src/playground/onboarding.html",
        "playground/settings": "./src/playground/settings.html",
        "playground/manager": "./src/playground/manager.html",
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
