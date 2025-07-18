import { describe, expect, it } from "vitest";

import { isPlainObject } from "../object-utils";

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
