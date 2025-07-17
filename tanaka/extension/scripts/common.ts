import { logger } from "./logger";

export type ShortBuildMode = "dev" | "prod";
export type LonbgBuildMode = "development" | "production";
export type BuildMode = ShortBuildMode | LonbgBuildMode;
export const VALID_BUILD_MODES: BuildMode[] = [
  "dev",
  "prod",
  "development",
  "production",
];

export function isValidMode(mode: string): mode is BuildMode {
  return VALID_BUILD_MODES.includes(mode as BuildMode);
}

export function isDevBuildMode(mode: BuildMode): boolean {
  return mode === "dev" || mode === "development";
}

export function isProdBuildMode(mode: BuildMode): boolean {
  return mode === "prod" || mode === "production";
}

export function exitWithError(message: string, error?: unknown): never {
  if (error) {
    logger.error(error);
  } else {
    logger.error(message);
  }
  process.exit(1);
}

export function isMainModule(importMetaUrl: string): boolean {
  return importMetaUrl === `file://${process.argv[1]}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function runCLI(main: () => Promise<void>, importMetaUrl: string): void {
  if (isMainModule(importMetaUrl)) {
    main().catch((error) => {
      exitWithError("Unexpected error", error);
    });
  }
}
