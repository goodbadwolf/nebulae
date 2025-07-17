import { defineConfig } from "@rspack/cli";
import rspack from "@rspack/core";
import { readFileSync, writeFileSync } from "fs";
import HtmlPlugin from "html-webpack-plugin";
import { resolve } from "path";
import { TsCheckerRspackPlugin } from "ts-checker-rspack-plugin";
import tanakaConfig from "./tanaka.config.ts";

export default defineConfig({
  entry: tanakaConfig.entries,
  output: {
    path: tanakaConfig.buildDir,
    filename: "[name]/index.js",
    cssFilename: "[name]/styles.css",
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    extensionAlias: {
      ".js": [".ts", ".js"],
      ".jsx": [".tsx", ".jsx"],
    },
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        loader: "builtin:swc-loader",
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
              tsx: true,
            },
            transform: {
              react: {
                runtime: "automatic",
              },
            },
          },
        },
      },
      {
        test: /\.css$/,
        type: "css",
      },
    ],
  },
  plugins: [
    new TsCheckerRspackPlugin({
      typescript: {
        configFile: "./tsconfig.json",
      },
    }),
    new HtmlPlugin({
      template: "./src/popup/index.html",
      filename: "popup/index.html",
      chunks: ["popup"],
      inject: "body",
      scriptLoading: "defer",
      publicPath: "./",
    }),
    new rspack.CopyRspackPlugin({
      patterns: [
        {
          from: tanakaConfig.publicDir,
          to: ".",
        },
      ],
    }),
    {
      apply: (compiler: any) => {
        compiler.hooks.afterEmit.tap("FixHtmlPaths", () => {
          const htmlPath = resolve(tanakaConfig.buildDir, "popup/index.html");
          let html = readFileSync(htmlPath, "utf-8");
          html = html.replace(
            /href="\.\/popup\/styles\.css"/,
            'href="./styles.css"'
          );
          html = html.replace(/src="\.\/popup\/index\.js"/, 'src="./index.js"');
          writeFileSync(htmlPath, html);
        });
      },
    },
  ],
  experiments: {
    css: true,
  },
});
