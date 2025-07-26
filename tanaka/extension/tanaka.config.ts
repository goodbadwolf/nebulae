import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { applyDefaults, createDefaultsApplier, type DeepPartial, hasProperty, type WithDefaults } from "@kiku/core";

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
  entries: {},
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
  if (!config || typeof config !== "object" || config === null) {
    throw new Error("Invalid configuration: config must be an object");
  }

  // Validate srcDir
  if (!hasProperty(config, "srcDir")) {
    throw new Error("Missing required property: srcDir");
  }
  if (typeof config.srcDir !== "string") {
    throw new Error("Invalid srcDir: must be a string");
  }
  if (!existsSync(config.srcDir)) {
    throw new Error(`Source directory not found: ${config.srcDir}`);
  }

  // Validate staticDir
  if (!hasProperty(config, "staticDir")) {
    throw new Error("Missing required property: staticDir");
  }
  if (typeof config.staticDir !== "string") {
    throw new Error("Invalid staticDir: must be a string");
  }
  if (!existsSync(config.staticDir)) {
    throw new Error(`Static directory not found: ${config.staticDir}`);
  }

  // Validate buildDir
  if (!hasProperty(config, "buildDir")) {
    throw new Error("Missing required property: buildDir");
  }
  if (typeof config.buildDir !== "string") {
    throw new Error("Invalid buildDir: must be a string");
  }

  // Validate manifestFile
  if (!hasProperty(config, "manifestFile")) {
    throw new Error("Missing required property: manifestFile");
  }
  if (typeof config.manifestFile !== "string") {
    throw new Error("Invalid manifestFile: must be a string");
  }
  if (!existsSync(config.manifestFile)) {
    throw new Error(`Manifest file not found: ${config.manifestFile}`);
  }

  // Validate iconSizes
  if (!hasProperty(config, "iconSizes")) {
    throw new Error("Missing required property: iconSizes");
  }
  if (!Array.isArray(config.iconSizes)) {
    throw new Error("Invalid iconSizes: must be an array");
  }
  if (config.iconSizes.some((size: unknown) => typeof size !== "number" || size <= 0)) {
    throw new Error("Invalid icon sizes: must be an array of positive numbers");
  }

  // Validate entries
  if (!hasProperty(config, "entries")) {
    throw new Error("Missing required property: entries");
  }
  if (!config.entries || typeof config.entries !== "object" || Array.isArray(config.entries)) {
    throw new Error("Invalid entries: must be an object");
  }

  // Validate entries properties are strings
  for (const [key, value] of Object.entries(config.entries)) {
    if (value !== undefined && typeof value !== "string") {
      throw new Error(`Invalid entry ${key}: must be a string or undefined`);
    }
  }

  // Validate webExt
  if (!hasProperty(config, "webExt")) {
    throw new Error("Missing required property: webExt");
  }
  if (!config.webExt || typeof config.webExt !== "object" || Array.isArray(config.webExt)) {
    throw new Error("Invalid webExt: must be an object");
  }

  const webExt = config.webExt;
  if (!hasProperty(webExt, "sourceDir") || typeof webExt.sourceDir !== "string") {
    throw new Error("Invalid webExt.sourceDir: must be a string");
  }
  if (!hasProperty(webExt, "startUrls") || !Array.isArray(webExt.startUrls)) {
    throw new Error("Invalid webExt.startUrls: must be an array");
  }
  if (!hasProperty(webExt, "browserConsole") || typeof webExt.browserConsole !== "boolean") {
    throw new Error("Invalid webExt.browserConsole: must be a boolean");
  }
  if (!hasProperty(webExt, "devtools") || typeof webExt.devtools !== "boolean") {
    throw new Error("Invalid webExt.devtools: must be a boolean");
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
