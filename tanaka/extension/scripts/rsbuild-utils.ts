import defaultConfig from "../tanaka.config";
import { type BuildMode } from "./common";
import { logger } from "./logger";
import { type ProcessConfig } from "./process-utils";

export function rsbuildBuildConfig(mode: BuildMode): ProcessConfig {
  return {
    command: "pnpm",
    args: ["rsbuild", "build", "--mode", mode],
    name: `rsbuild build (mode: ${mode})`,
    errorMessage: "Failed to build extension",
    env: {
      NODE_ENV: mode === "dev" ? "development" : "production",
    },
  };
}

export function rsbuildWatchConfig(mode: BuildMode): ProcessConfig {
  return {
    command: "pnpm",
    args: ["rsbuild", "dev", "--mode", mode],
    name: `rsbuild dev (mode: ${mode})`,
    errorMessage: "Failed to start development server",
    env: {
      NODE_ENV: mode === "dev" ? "development" : "production",
    },
  };
}

export function webExtConfig(): ProcessConfig {
  logger.info("Starting web-ext with config:", defaultConfig.webExt);
  const args = ["web-ext", "run", "--source-dir", defaultConfig.buildDir];

  if (defaultConfig.webExt.devtools) {
    args.push("--devtools");
  }

  if (defaultConfig.webExt.browserConsole) {
    args.push("--browser-console");
  }
  return {
    command: "pnpm",
    args,
    name: "web-ext",
    errorMessage: "Failed to start Firefox with extension",
  };
}
