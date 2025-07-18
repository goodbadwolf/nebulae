import { isPlainObject } from "./object-utils";
import type { DeepPartial } from "./partial";

/**
 * Represents an object that can be merged with deepMerge.
 * Constrains to object types with string keys and unknown values.
 */
export type Mergeable = Record<string, unknown>;


/**
 * Recursively merges properties from source into target, creating a new object.
 *
 * - Objects are merged recursively (nested properties are preserved)
 * - Arrays and primitives are replaced entirely, not merged
 * - undefined values in source are skipped
 * - null values in source overwrite target values
 *
 * @example
 * // Basic object merging - nested properties are preserved
 * deepMerge(
 *   { a: { b: 1, c: 2 } },
 *   { a: { b: 3 } }
 * )
 * // Returns: { a: { b: 3, c: 2 } }
 *
 * @example
 * // Arrays are replaced, not merged
 * deepMerge(
 *   { items: [1, 2, 3], name: "test" },
 *   { items: [4, 5] }
 * )
 * // Returns: { items: [4, 5], name: "test" }
 *
 * @example
 * // undefined values are skipped (original values preserved)
 * deepMerge(
 *   { a: 1, b: 2, c: 3 },
 *   { a: 10, b: undefined, c: null }
 * )
 * // Returns: { a: 10, b: 2, c: null }
 *
 * @example
 * // Deep nesting with mixed types
 * deepMerge(
 *   {
 *     config: {
 *       api: { url: "prod.com", timeout: 5000 },
 *       features: ["auth", "logging"]
 *     }
 *   },
 *   {
 *     config: {
 *       api: { url: "dev.com" },
 *       features: ["auth", "logging", "debug"]
 *     }
 *   }
 * )
 * // Returns: {
 * //   config: {
 * //     api: { url: "dev.com", timeout: 5000 },
 * //     features: ["auth", "logging", "debug"]
 * //   }
 * // }
 *
 * @param target - The base object to merge into
 * @param source - The partial object with values to merge
 * @returns A new object with merged properties
 */
export function deepMerge<T extends Mergeable>(target: T, source: DeepPartial<T>): T {
  const result = { ...target };

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = target[key];

    // Skip undefined values from source - they don't override existing values in target
    if (sourceValue === undefined) continue;

    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      // Both values are non-null objects (not arrays) - merge recursively
      result[key] = deepMerge(targetValue as Mergeable, sourceValue as DeepPartial<Mergeable>) as T[Extract<
        keyof T,
        string
      >];
    } else {
      // At least one value is not a plain object - replace target value entirely
      // This handles several cases:
      // - sourceValue is null => explicitly set to null
      // - sourceValue is array => replace with new array (no merging)
      // - sourceValue is primitive (string, number, boolean) => replace with new value
      // - targetValue is not a plain object => can't merge, so replace
      // - Both are non-objects => simple replacement
      result[key] = sourceValue as T[Extract<keyof T, string>];
    }
  }

  return result;
}

export type { DeepPartial };
