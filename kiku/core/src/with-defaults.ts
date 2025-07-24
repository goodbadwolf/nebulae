import { deepMerge } from "./merge";
import type { DeepPartial } from "./partial";

/**
 * Deep merges type T with defaults D, making literal default values visible in IntelliSense
 * while preserving the ability to use the full type from T.
 *
 * @template T - The base type with optional properties
 * @template D - Default values (should be assignable to T)
 *
 * @example
 * interface ConfigBase {
 *   theme?: string;
 *   debug?: boolean;
 *   settings?: {
 *     timeout?: number;
 *     retries?: number;
 *   };
 * }
 *
 * type ConfigDefaults = {
 *   theme: "dark";
 *   debug: false;
 *   settings: {
 *     timeout: 5000;
 *   };
 * };
 *
 * type Config = WithDefaults<ConfigBase, ConfigDefaults>;
 * // Result: {
 * //   theme: "dark" | string;  // Can use any string, but "dark" is the default
 * //   debug: false | boolean;  // Can use any boolean, but false is the default
 * //   settings: {
 * //     timeout: 5000 | number;  // Can use any number, but 5000 is the default
 * //     retries?: number;  // Still optional, no default provided
 * //   };
 * // }
 *
 * @note This performs a deep merge, handling nested objects recursively.
 */
export type WithDefaults<T, D> = T extends object
  ? D extends object
    ? {
        // Required properties: those that have defaults
        [K in keyof T & keyof D]: T[K] extends object
          ? D[K] extends object
            ? WithDefaults<T[K], D[K]>
            : T[K] | D[K] // Union of original type and default
          : T[K] | D[K]; // Union of original type and default
      } & {
        // Optional properties: those that don't have defaults
        [K in keyof T as K extends keyof D ? never : K]?: T[K];
      }
    : T
  : D;

// Helper to ensure proper type constraints
type EnsureMergeable<T> = T & Record<string, unknown>;

/**
 * Runtime helper that applies defaults to props, with types that match WithDefaults.
 * This creates a function that merges provided props with defaults.
 *
 * @template T - The full type including required and optional properties
 * @param defaults - Default values to apply
 * @returns A function that takes partial props and returns the merged result
 *
 * @example
 * interface PageShellProps {
 *   title?: string;
 *   theme?: "light" | "dark";
 *   settings?: {
 *     timeout?: number;
 *   };
 * }
 *
 * const defaults = {
 *   title: "Tanaka",
 *   theme: "dark" as const,
 *   settings: {
 *     timeout: 5000
 *   }
 * };
 *
 * const applyDefaults = withDefaults<PageShellProps>(defaults);
 *
 * // Usage:
 * const props = applyDefaults({ title: "Custom" });
 * // Result: { title: "Custom", theme: "dark", settings: { timeout: 5000 } }
 */
export function withDefaults<T extends Record<string, any>>(defaults: DeepPartial<T>) {
  return function <P extends DeepPartial<T>>(props?: P): T {
    if (!props) {
      return defaults as T;
    }
    // Merge props into defaults (props override defaults)
    return deepMerge(defaults as EnsureMergeable<typeof defaults>, props as any) as T;
  };
}

/**
 * Direct application of defaults to props, returning the merged result with proper types.
 * This is useful when you want to apply defaults inline without creating a function.
 *
 * @template T - The full type including required and optional properties
 * @param defaults - Default values
 * @param props - Props to merge with defaults
 * @returns Merged result with defaults applied
 *
 * @example
 * interface Config {
 *   title?: string;
 *   theme?: "light" | "dark";
 * }
 *
 * const props = applyDefaults<Config>(
 *   { title: "Tanaka", theme: "dark" as const },
 *   { title: "Custom" }
 * );
 * // Result: { title: "Custom", theme: "dark" }
 */
export function applyDefaults<T extends Record<string, any>>(defaults: DeepPartial<T>, props?: DeepPartial<T>): T {
  if (!props) {
    return defaults as T;
  }
  return deepMerge(defaults as EnsureMergeable<typeof defaults>, props as any) as T;
}
