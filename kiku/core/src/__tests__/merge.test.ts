import { describe, expect, it } from "vitest";

import { deepMerge, DeepPartial } from "../merge";

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
    const source = { a: null } as unknown as DeepPartial<typeof target>;
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
    const source = { b: { c: 2 } } as unknown as DeepPartial<typeof target>;
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
    const source = { a: { c: 2 } } as unknown as DeepPartial<typeof target>;
    const targetCopy = JSON.parse(JSON.stringify(target));
    const sourceCopy = JSON.parse(JSON.stringify(source));

    deepMerge(target, source);

    expect(target).toEqual(targetCopy);
    expect(source).toEqual(sourceCopy);
  });

  it("should replace objects with primitives", () => {
    const target = { a: { b: 1, c: 2 }, d: "test" };
    const source = { a: "string value" } as unknown as DeepPartial<typeof target>;
    const result = deepMerge(target, source);

    expect(result).toEqual({ a: "string value", d: "test" });
  });

  it("should replace primitives with objects", () => {
    const target = { a: "string", b: 42 };
    const source = { a: { nested: true }, b: { count: 10 } } as unknown as DeepPartial<typeof target>;
    const result = deepMerge(target, source);

    expect(result).toEqual({ a: { nested: true }, b: { count: 10 } });
  });

  it("should replace objects with arrays", () => {
    const target = { data: { a: 1, b: 2 }, id: 123 };
    const source = { data: [1, 2, 3] } as unknown as DeepPartial<typeof target>;
    const result = deepMerge(target, source);

    expect(result).toEqual({ data: [1, 2, 3], id: 123 });
  });

  it("should replace arrays with objects", () => {
    const target = { items: [1, 2, 3], name: "list" };
    const source = { items: { first: 1, second: 2 } } as unknown as DeepPartial<typeof target>;
    const result = deepMerge(target, source);

    expect(result).toEqual({ items: { first: 1, second: 2 }, name: "list" });
  });

  it("should handle various primitive types", () => {
    const target = {
      str: "old",
      num: 42,
      bool: true,
      obj: { nested: "value" },
    };
    const source = {
      str: "new",
      num: 99,
      bool: false,
    };
    const result = deepMerge(target, source);

    expect(result).toEqual({
      str: "new",
      num: 99,
      bool: false,
      obj: { nested: "value" },
    });
  });

  it("should handle mixed arrays and objects at the same level", () => {
    const target = {
      arr: [1, 2, 3],
      obj: { a: 1 },
      primitive: "hello",
    };
    const source = {
      arr: [4, 5],
      obj: { b: 2 },
      primitive: "world",
    } as DeepPartial<typeof target>;
    const result = deepMerge(target, source);

    expect(result).toEqual({
      arr: [4, 5],
      obj: { a: 1, b: 2 },
      primitive: "world",
    });
  });

  it("should preserve target properties not in source", () => {
    const target = { a: 1, b: 2, c: 3, d: { e: 4, f: 5 } };
    const source = { b: 20, d: { e: 40 } };
    const result = deepMerge(target, source);

    expect(result).toEqual({ a: 1, b: 20, c: 3, d: { e: 40, f: 5 } });
  });

  it("should handle nested type changes", () => {
    const target = {
      config: {
        settings: {
          theme: "dark",
          options: { verbose: true },
        },
      },
    };
    const source = {
      config: {
        settings: {
          theme: "light",
          options: ["simple", "fast"],
        },
      },
    } as unknown as DeepPartial<typeof target>;
    const result = deepMerge(target, source);

    expect(result).toEqual({
      config: {
        settings: {
          theme: "light",
          options: ["simple", "fast"],
        },
      },
    });
  });
});
