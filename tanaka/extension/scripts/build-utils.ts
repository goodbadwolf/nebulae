import tanakaConfig from "../tanaka.config";
import { BuildMode, isDevBuildMode } from "./common";
import { ProcessConfig } from "./process-utils";

export function rspackBuildConfig(mode: BuildMode): ProcessConfig {
  const env: Record<string, string> = {
    ...process.env,
    BUILD_ENV: mode,
    NODE_ENV: isDevBuildMode(mode) ? "development" : "production",
    FORCE_COLOR: "1",
  };

  return {
    name: "rspack build",
    command: "pnpm",
    args: ["rspack", "build"],
    env,
    errorMessage: "Failure in rspack build",
  };
}

export function rspackWatchConfig(mode: BuildMode): ProcessConfig {
  const env: Record<string, string> = {
    ...process.env,
    BUILD_ENV: mode,
    NODE_ENV: isDevBuildMode(mode) ? "development" : "production",
    FORCE_COLOR: "1",
  };

  if (mode) {
    env.BUILD_ENV = mode;
  }

  return {
    name: "rspack watch",
    command: "pnpm",
    args: ["rspack", "build", "--watch"],
    env,
    errorMessage: "Failure in rspack watch",
  };
}

export function rspackServeConfig(mode?: string): ProcessConfig {
  const env: Record<string, string> = {
    NODE_ENV: "development",
  };

  if (mode) {
    env.BUILD_ENV = mode;
  }

  return {
    name: "rspack serve",
    command: "rspack",
    args: ["serve"],
    env,
    errorMessage: "Failure in rspack dev server",
  };
}

export function webExtConfig(): ProcessConfig {
  const args = ["run", "--source-dir", tanakaConfig.webExt.sourceDir];

  if (tanakaConfig.webExt.browserConsole) {
    args.push("--browser-console");
  }

  if (tanakaConfig.webExt.devtools) {
    args.push("--devtools");
  }

  if (tanakaConfig.webExt.firefoxProfile) {
    args.push("--firefox-profile", tanakaConfig.webExt.firefoxProfile);
  }

  if (tanakaConfig.webExt.startUrls) {
    tanakaConfig.webExt.startUrls.forEach((url) => {
      args.push("--start-url", url);
    });
  }

  return {
    name: "web-ext",
    command: "web-ext",
    args,
    errorMessage: "Failure in web-ext",
  };
}
