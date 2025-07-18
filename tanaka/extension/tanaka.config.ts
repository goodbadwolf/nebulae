import { deepMerge } from "@kiku/core";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { TanakaConfig } from "./tanaka.config.d";

const projectRoot = dirname(fileURLToPath(import.meta.url));
const staticDir = join(projectRoot, "static");
const buildDir = join(projectRoot, "dist");

const defaultConfig: TanakaConfig = {
  srcDir: join(projectRoot, "src"),
  staticDir,
  buildDir,
  manifestFile: join(staticDir, "manifest.json"),
  iconSizes: [16, 32, 48, 128],
  entries: {
    popup: "src/popup/index.tsx",
    background: "src/background/index.ts",
  },
  webExt: {
    sourceDir: buildDir,
    startUrls: [
      "https://www.google.com",
      "https://www.youtube.com",
      "https://en.wikipedia.org",
    ],
    browserConsole: true,
    devtools: true,
  },
};

async function loadConfig(): Promise<TanakaConfig> {
  let config = defaultConfig;

  const localConfigPath = join(projectRoot, "tanaka.local.config.ts");
  if (existsSync(localConfigPath)) {
    const { default: localConfig } = await import("./tanaka.local.config");
    config = deepMerge(config, localConfig);
  }

  return config;
}

export default await loadConfig();
