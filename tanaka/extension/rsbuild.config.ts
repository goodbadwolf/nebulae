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
    ],
  },
  html: {
    template: "./src/popup/index.html",
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
    hmr: false,
    liveReload: false,
  },
});
