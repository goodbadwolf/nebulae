import type { DeepPartial } from "@kiku/core";

import type { TanakaConfig } from "./tanaka.config.d";

/**
 * Local configuration overrides for development
 * This file is ignored by git and can contain machine-specific settings
 *
 * @example
 * const localConfig: DeepPartial<TanakaConfig> = {
 *   // Use a specific Firefox profile
 *   webExt: {
 *     firefoxProfile: "dev-profile",
 *     startUrls: ["http://localhost:3000"],
 *   },
 *   // Add custom entry points
 *   entries: {
 *     devtools: "src/devtools/index.tsx",
 *   },
 * };
 */
const localConfig: DeepPartial<TanakaConfig> = {
  webExt: {
    devtools: false,
    browserConsole: false,
  },
};

export default localConfig;
