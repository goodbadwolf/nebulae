import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import { pluginTypeCheck } from "@rsbuild/plugin-type-check";

import { getConfig } from "./tanaka.config";

// Load config before use
const config = await getConfig();

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginSass(),
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
      // Playground entries - Vanilla JS
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
      // Playground entry - React (Single SPA entry)
      playground: {
        import: "./src/playground/index.tsx",
        html: true,
      },
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
    },
  },
  output: {
    distPath: {
      root: config.buildDir,
    },
    filename: {
      html: "[name]/index.html",
    },
    copy: [
      {
        from: config.staticDir,
        to: config.buildDir,
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
      const templates: Record<string, string> = {
        "playground-js/index": "./src/playground-js/index.html",
        "playground-js/popup": "./src/playground-js/popup.html",
        "playground-js/welcome": "./src/playground-js/welcome.html",
        "playground-js/settings": "./src/playground-js/settings.html",
        "playground-js/manager": "./src/playground-js/manager.html",
        playground: "./src/playground/index.html",
      };
      return templates[entryName];
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
  server: {
    historyApiFallback: {
      rewrites: [{ from: /^\/playground/, to: "/playground/index.html" }],
    },
  },
});
