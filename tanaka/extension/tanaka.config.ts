import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { applyDefaults, createDefaultsApplier, type DeepPartial, type WithDefaults } from "@kiku/core";

import type { Environment, TanakaConfig } from "./tanaka.config.d";

const projectRoot = dirname(fileURLToPath(import.meta.url));
const staticDir = join(projectRoot, "static");
const buildDir = join(projectRoot, "dist");

const configDefaults: TanakaConfig = {
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
    startUrls: ["https://www.google.com", "https://www.youtube.com", "https://en.wikipedia.org"],
    browserConsole: true,
    devtools: true,
  },
};

export type TanakaConfigWithDefaults = WithDefaults<TanakaConfig, typeof configDefaults>;

const applyConfigDefaults = createDefaultsApplier<TanakaConfig>(configDefaults);

function getEnvironmentConfig(env: Environment): DeepPartial<TanakaConfig> {
  switch (env) {
    case "production":
      return {
        webExt: {
          browserConsole: false,
          devtools: false,
        },
      };
    case "test":
      return {
        buildDir: join(projectRoot, "dist-test"),
      };
    default:
      return {};
  }
}

/**
 * Validates the configuration object
 * @throws {Error} If configuration is invalid
 */
function validateConfig(config: unknown): config is TanakaConfig {
  if (!config || typeof config !== "object") {
    throw new Error("Invalid configuration: config must be an object");
  }

  const c = config as any;

  if (!existsSync(c.srcDir)) {
    throw new Error(`Source directory not found: ${c.srcDir}`);
  }

  if (!existsSync(c.staticDir)) {
    throw new Error(`Static directory not found: ${c.staticDir}`);
  }

  if (!existsSync(c.manifestFile)) {
    throw new Error(`Manifest file not found: ${c.manifestFile}`);
  }

  if (!Array.isArray(c.iconSizes) || c.iconSizes.some((size: any) => typeof size !== "number" || size <= 0)) {
    throw new Error("Invalid icon sizes: must be an array of positive numbers");
  }

  if (!c.entries || typeof c.entries !== "object") {
    throw new Error("Invalid entries configuration");
  }

  if (!c.webExt || typeof c.webExt !== "object") {
    throw new Error("Invalid webExt configuration");
  }

  if (!Array.isArray(c.webExt.startUrls)) {
    throw new Error("webExt.startUrls must be an array");
  }

  return true;
}

/**
 * Load and merge configuration from various sources
 */
async function loadConfig(): Promise<TanakaConfig> {
  let config = applyConfigDefaults({});

  const env = (process.env.NODE_ENV || "development") as Environment;
  const envConfig = getEnvironmentConfig(env);
  if (Object.keys(envConfig).length > 0) {
    config = applyDefaults(config, envConfig);
  }

  const localConfigPath = join(projectRoot, "tanaka.local.config.ts");
  if (existsSync(localConfigPath)) {
    try {
      const { default: localConfig } = await import("./tanaka.local.config");
      config = applyDefaults(config, localConfig);
    } catch (error) {
      console.warn(`Failed to load local config: ${error}`);
    }
  }

  if (!validateConfig(config)) {
    throw new Error("Configuration validation failed");
  }

  return config;
}

// Cached configuration for lazy loading
let cachedConfig: TanakaConfig | null = null;

/**
 * Get the configuration asynchronously
 * Loads the config on first call and caches it for subsequent calls
 */
export async function getConfig(): Promise<TanakaConfig> {
  if (!cachedConfig) {
    cachedConfig = await loadConfig();
  }
  return cachedConfig;
}

/**
 * Get the configuration synchronously
 * @throws {Error} If config hasn't been loaded yet
 */
export function getConfigSync(): TanakaConfig {
  if (!cachedConfig) {
    throw new Error("Configuration not loaded. Call getConfig() first.");
  }
  return cachedConfig;
}

/**
 * Reset the cached configuration (useful for testing)
 */
export function resetConfig(): void {
  cachedConfig = null;
}
