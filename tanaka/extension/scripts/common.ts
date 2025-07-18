import { logger } from "./logger";

type ShortBuildMode = "dev" | "prod";
type LonbgBuildMode = "development" | "production";
export type BuildMode = ShortBuildMode | LonbgBuildMode;
export const VALID_BUILD_MODES: BuildMode[] = ["dev", "prod", "development", "production"];

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
