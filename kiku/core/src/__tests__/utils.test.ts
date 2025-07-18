import { describe, expect, it } from "vitest";
import { deepMerge } from "../utils";

describe("deepMerge", () => {
  it("should merge flat objects", () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };
    const result = deepMerge(target, source);

    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it("should merge nested objects", () => {
    const target = {
      config: { timeout: 5000, retries: 3 },
      name: "test",
    };
    const source = {
      config: { timeout: 10000 },
    };
    const result = deepMerge(target, source);

    expect(result).toEqual({
      config: { timeout: 10000, retries: 3 },
      name: "test",
    });
  });

  it("should handle deeply nested objects", () => {
    const target = {
      level1: {
        level2: {
          level3: { a: 1, b: 2 },
        },
      },
    };
    const source = {
      level1: {
        level2: {
          level3: { b: 3, c: 4 },
        },
      },
    };
    const result = deepMerge(target, source);

    expect(result).toEqual({
      level1: {
        level2: {
          level3: { a: 1, b: 3, c: 4 },
        },
      },
    });
  });

  it("should replace arrays, not merge them", () => {
    const target = { arr: [1, 2, 3], name: "test" };
    const source = { arr: [4, 5] };
    const result = deepMerge(target, source);

    expect(result).toEqual({ arr: [4, 5], name: "test" });
  });

  it("should handle null values", () => {
    const target = { a: { b: 1 }, c: 2 };
    const source = { a: null } as any;
    const result = deepMerge(target, source);

    expect(result).toEqual({ a: null, c: 2 });
  });

  it("should skip undefined values", () => {
    const target = { a: 1, b: 2 };
    const source = { a: undefined, b: 3 };
    const result = deepMerge(target, source);

    expect(result).toEqual({ a: 1, b: 3 });
  });

  it("should add new properties", () => {
    const target = { a: 1 };
    const source = { b: { c: 2 } } as any;
    const result = deepMerge(target, source);

    expect(result).toEqual({ a: 1, b: { c: 2 } });
  });

  it("should handle empty objects", () => {
    const target = { a: 1 };
    const source = {};
    const result = deepMerge(target, source);

    expect(result).toEqual({ a: 1 });
  });

  it("should not mutate the original objects", () => {
    const target = { a: { b: 1 } };
    const source = { a: { c: 2 } } as any;
    const targetCopy = JSON.parse(JSON.stringify(target));
    const sourceCopy = JSON.parse(JSON.stringify(source));

    deepMerge(target, source);

    expect(target).toEqual(targetCopy);
    expect(source).toEqual(sourceCopy);
  });
});
