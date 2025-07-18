/**
 * Checks if a value is a plain object (not null, not an array).
 * Used to determine if deep merging should occur.
 *
 * Returns true for:
 * - Plain objects: {}, { key: value }, Object.create(null)
 * - Built-in objects: Date, RegExp, Map, Set, etc.
 * - Custom class instances: new CustomClass()
 *
 * Returns false for:
 * - Primitives: string, number, boolean, undefined, symbol, bigint
 * - null
 * - Arrays: [], [1, 2, 3]
 * - Functions: () => {}, function() {}
 *
 * @param value - The value to check
 * @returns true if value is a non-null object that isn't an array
 */

export function isPlainObject(value: unknown): boolean {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
