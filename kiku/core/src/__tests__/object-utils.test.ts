import { describe, expect, it } from "vitest";

import { hasProperty, isPlainObject } from "../object-utils";

describe("isPlainObject", () => {
  it("should return true for plain objects", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
    expect(isPlainObject({ nested: { value: true } })).toBe(true);
  });

  it("should return false for null", () => {
    expect(isPlainObject(null)).toBe(false);
  });

  it("should return false for arrays", () => {
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject([1, 2, 3])).toBe(false);
    expect(isPlainObject(["a", "b"])).toBe(false);
  });

  it("should return false for primitives", () => {
    expect(isPlainObject("string")).toBe(false);
    expect(isPlainObject(42)).toBe(false);
    expect(isPlainObject(true)).toBe(false);
    expect(isPlainObject(false)).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
  });

  it("should return false for undefined explicitly", () => {
    expect(isPlainObject(undefined)).toBe(false);
    const undefinedValue: any = undefined;
    expect(isPlainObject(undefinedValue)).toBe(false);
  });

  it("should return false for functions", () => {
    expect(isPlainObject(() => {})).toBe(false);
    expect(isPlainObject(function () {})).toBe(false);
  });

  it("should return true for Date objects", () => {
    expect(isPlainObject(new Date())).toBe(true);
  });

  it("should return true for RegExp objects", () => {
    expect(isPlainObject(/regex/)).toBe(true);
    expect(isPlainObject(new RegExp("test"))).toBe(true);
  });

  it("should return true for Map and Set", () => {
    expect(isPlainObject(new Map())).toBe(true);
    expect(isPlainObject(new Set())).toBe(true);
  });

  it("should return true for Object.create(null)", () => {
    expect(isPlainObject(Object.create(null))).toBe(true);
  });

  it("should return true for objects with constructor", () => {
    class CustomClass {}
    expect(isPlainObject(new CustomClass())).toBe(true);
  });

  it("should handle any type values", () => {
    const anyNull: any = null;
    const anyUndefined: any = undefined;
    const anyArray: any = [1, 2, 3];
    const anyObject: any = { key: "value" };
    const anyString: any = "test";
    const anyNumber: any = 42;

    expect(isPlainObject(anyNull)).toBe(false);
    expect(isPlainObject(anyUndefined)).toBe(false);
    expect(isPlainObject(anyArray)).toBe(false);
    expect(isPlainObject(anyObject)).toBe(true);
    expect(isPlainObject(anyString)).toBe(false);
    expect(isPlainObject(anyNumber)).toBe(false);
  });
});

describe("hasProperty", () => {
  it("should return true when object has the property", () => {
    const obj = { name: "test", value: 42 };
    expect(hasProperty(obj, "name")).toBe(true);
    expect(hasProperty(obj, "value")).toBe(true);
  });

  it("should return false when object does not have the property", () => {
    const obj = { name: "test" };
    expect(hasProperty(obj, "missing")).toBe(false);
    expect(hasProperty(obj, "value")).toBe(false);
  });

  it("should work with inherited properties", () => {
    const parent = { inherited: true };
    const child = Object.create(parent);
    child.own = "property";

    expect(hasProperty(child, "own")).toBe(true);
    expect(hasProperty(child, "inherited")).toBe(true);
  });

  it("should work with properties that have undefined values", () => {
    const obj = { undefinedProp: undefined };
    expect(hasProperty(obj, "undefinedProp")).toBe(true);
  });

  it("should work with null prototype objects", () => {
    const obj = Object.create(null);
    obj.prop = "value";
    expect(hasProperty(obj, "prop")).toBe(true);
    expect(hasProperty(obj, "missing")).toBe(false);
  });

  it("should provide proper type narrowing", () => {
    const obj: object = { name: "test", value: 42 };

    if (hasProperty(obj, "name")) {
      // TypeScript should now know that obj has a 'name' property
      const value: unknown = obj.name;
      expect(value).toBe("test");
    }
  });

  it("should work with empty objects", () => {
    const obj = {};
    expect(hasProperty(obj, "anyProp")).toBe(false);
  });

  it("should work with array indices", () => {
    const arr = ["a", "b", "c"];
    expect(hasProperty(arr, "0")).toBe(true);
    expect(hasProperty(arr, "1")).toBe(true);
    expect(hasProperty(arr, "3")).toBe(false);
  });

  it("should work with object property methods", () => {
    const obj = {
      toString: () => "custom",
      valueOf: () => 42,
    };
    expect(hasProperty(obj, "toString")).toBe(true);
    expect(hasProperty(obj, "valueOf")).toBe(true);
  });
});
