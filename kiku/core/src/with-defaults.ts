import { deepMerge } from "./merge";
import type { DeepPartial } from "./partial";

/**
 * Deep merges type T with defaults D, making literal default values visible in IntelliSense
 * while preserving the ability to use the full type from T.
 *
 * This pattern is particularly valuable for configuration objects, component props, or API
 * client options where defaults improve developer experience but flexibility is still needed.
 * It solves a common TypeScript limitation where you typically have to choose between
 * visible defaults OR type flexibility, not both.
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
 * //   theme: "dark" | string;  // REQUIRED - Can use any string, but "dark" is the default
 * //   debug: false | boolean;  // REQUIRED - Can use any boolean, but false is the default
 * //   settings: {              // REQUIRED - Has default value
 * //     timeout: 5000 | number;  // REQUIRED - Can use any number, but 5000 is the default
 * //     retries?: number;  // Still OPTIONAL - no default provided
 * //   };
 * // }
 *
 * @note This performs a deep merge, handling nested objects recursively.
 *
 * @important Properties with defaults become REQUIRED in the result type.
 *            Properties without defaults remain optional.
 *
 * @arrayBehavior Arrays are REPLACED, not merged. For example:
 *                deepMerge([1, 2, 3], [4, 5]) results in [4, 5]
 *
 * @undefinedBehavior undefined values in defaults are skipped during merging
 */
export type WithDefaults<T, D extends DeepPartial<T>> = T extends object
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
// Note: We use Record<string, any> instead of Record<string, unknown> because
// unknown would be too restrictive and prevent proper type inference in many cases
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

/**
 * Like WithDefaults but keeps all properties optional while still showing
 * default values in IntelliSense. This is useful when you want to show
 * defaults but not require them.
 *
 * @template T - The base type with optional properties
 * @template D - Default values (should be assignable to T)
 *
 * @example
 * interface ConfigBase {
 *   theme?: string;
 *   debug?: boolean;
 *   port?: number;
 * }
 *
 * type ConfigDefaults = {
 *   theme: "dark";
 *   debug: false;
 * };
 *
 * type Config = PartialWithDefaults<ConfigBase, ConfigDefaults>;
 * // Result: {
 * //   theme?: "dark" | string;  // Still optional but shows default
 * //   debug?: false | boolean;  // Still optional but shows default
 * //   port?: number;           // Still optional, no default
 * // }
 */
export type PartialWithDefaults<T, D extends DeepPartial<T>> = {
  [K in keyof T]?: K extends keyof D
    ? T[K] extends object
      ? D[K] extends object
        ? PartialWithDefaults<T[K], D[K]>
        : T[K] | D[K]
      : T[K] | D[K]
    : T[K];
};

/**
 * Non-recursive version of WithDefaults for better performance with large flat objects.
 * Still preserves union types for IntelliSense visibility but only at the top level.
 *
 * @template T - The base type with optional properties
 * @template D - Default values (should be assignable to T)
 *
 * @example
 * interface ConfigBase {
 *   theme?: string;
 *   debug?: boolean;
 *   nested?: { value?: number };
 * }
 *
 * type ConfigDefaults = {
 *   theme: "dark";
 *   nested: { value: 100 };
 * };
 *
 * type Config = ShallowWithDefaults<ConfigBase, ConfigDefaults>;
 * // Result: {
 * //   theme: "dark" | string;    // Shows union
 * //   debug?: boolean;           // Still optional
 * //   nested: { value: 100 };    // Replaced entirely, no deep merge
 * // }
 */
export type ShallowWithDefaults<T, D extends DeepPartial<T>> = {
  [K in keyof T & keyof D]: T[K] | D[K];
} & {
  [K in keyof T as K extends keyof D ? never : K]?: T[K];
};

/**
 * Requires ALL properties to have defaults. Useful for configuration objects
 * where no property should be undefined.
 *
 * @template T - The base type
 * @template D - Default values (must provide defaults for ALL properties)
 *
 * @example
 * interface ConfigBase {
 *   theme?: string;
 *   debug?: boolean;
 *   port?: number;
 * }
 *
 * // This would cause a type error - missing 'port' default
 * // type Config = StrictWithDefaults<ConfigBase, { theme: "dark", debug: false }>;
 *
 * // This works - all properties have defaults
 * type Config = StrictWithDefaults<ConfigBase, {
 *   theme: "dark";
 *   debug: false;
 *   port: 3000;
 * }>;
 */
// Note: StrictWithDefaults uses a type intersection approach
// This allows us to enforce that D provides all required properties
// while still being compatible with the WithDefaults constraint
export type StrictWithDefaults<T, D extends Required<T>> = WithDefaults<T, D & DeepPartial<T>>;
