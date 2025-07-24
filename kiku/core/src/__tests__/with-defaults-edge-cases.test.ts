import { describe, expect, it } from "vitest";

import type { WithDefaults } from "../index";
import { applyDefaults, createDefaultsApplier } from "../with-defaults";

describe("WithDefaults edge cases", () => {
  describe("Function types", () => {
    it("should handle function types in merge", () => {
      interface Config {
        callback?: () => void;
        transformer?: (x: number) => string;
        asyncHandler?: () => Promise<void>;
      }

      const defaultCallback = () => console.log("default");
      const defaultTransformer = (x: number) => x.toString();
      const defaultAsyncHandler = async () => {
        await Promise.resolve();
      };

      const defaults = {
        callback: defaultCallback,
        transformer: defaultTransformer,
        asyncHandler: defaultAsyncHandler,
      };

      type MergedConfig = WithDefaults<Config, typeof defaults>;

      // Type test - functions should work in the merged type
      const config: MergedConfig = {
        callback: defaultCallback,
        transformer: (x: number) => `Number: ${x}`,
        asyncHandler: defaultAsyncHandler,
      };

      expect(config.callback).toBe(defaultCallback);
      expect(config.transformer!(42)).toBe("Number: 42");
      expect(config.asyncHandler).toBe(defaultAsyncHandler);

      // Runtime test
      const applyConfigDefaults = createDefaultsApplier<Config>(defaults);
      const result = applyConfigDefaults({
        transformer: (x: number) => `Custom: ${x}`,
      });

      expect(result.callback).toBe(defaultCallback);
      expect(result.transformer!(10)).toBe("Custom: 10");
      expect(result.asyncHandler).toBe(defaultAsyncHandler);
    });

    it("should handle method vs function property correctly", () => {
      interface Service {
        process?: (data: string) => string;
        validate?: (input: unknown) => boolean;
      }

      const defaults = {
        process: (data: string) => data.toUpperCase(),
        validate: (input: unknown) => input !== null,
      };

      const result = applyDefaults<Service>(defaults, {
        process: (data: string) => data.toLowerCase(),
      });

      expect(result.process!("Test")).toBe("test");
      expect(result.validate!(null)).toBe(false);
    });
  });

  describe("Symbol keys", () => {
    it("should document symbol keys limitation", () => {
      const symA = Symbol("a");
      const symB = Symbol("b");

      interface ConfigWithSymbols {
        [symA]?: string;
        [symB]?: number;
        regular?: string;
      }

      const defaults = {
        [symA]: "default-a",
        [symB]: 42,
        regular: "default",
      };

      const result = applyDefaults<ConfigWithSymbols>(defaults, {
        [symA]: "custom-a",
        regular: "custom",
      });

      // LIMITATION: Symbol keys are not merged by deepMerge
      // Only string keys are processed
      expect(result[symA]).toBe("default-a"); // Stays as default
      expect(result[symB]).toBe(42);
      expect(result.regular).toBe("custom"); // String keys work fine
    });
  });

  describe("Deep nesting performance", () => {
    it("should handle deeply nested objects within reasonable time", () => {
      const createDeepObject = (depth: number, value: any = {}): any => {
        if (depth === 0) return { value: 1, ...value };
        return { nested: createDeepObject(depth - 1, value) };
      };

      const deepDefaults = createDeepObject(20, { defaultProp: "default" });
      const deepProps = createDeepObject(20, { value: 2 });

      const start = performance.now();
      const result = applyDefaults(deepDefaults, deepProps);
      const duration = performance.now() - start;

      // Verify it completes in reasonable time (100ms is generous)
      expect(duration).toBeLessThan(100);

      // Verify the merge worked correctly at depth
      let current = result;
      for (let i = 0; i < 20; i++) {
        current = current.nested;
      }
      expect(current.value).toBe(2);
      expect(current.defaultProp).toBe("default");
    });

    it("should handle wide objects efficiently", () => {
      const createWideObject = (width: number): any => {
        const obj: any = {};
        for (let i = 0; i < width; i++) {
          obj[`prop${i}`] = i;
        }
        return obj;
      };

      const wideDefaults = createWideObject(1000);
      const wideProps = {
        prop0: 999,
        prop500: 999,
        prop999: 999,
      };

      const start = performance.now();
      const result = applyDefaults(wideDefaults, wideProps);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(50);
      expect(result.prop0).toBe(999);
      expect((result as any).prop1).toBe(1);
      expect(result.prop500).toBe(999);
      expect(result.prop999).toBe(999);
    });
  });

  describe("Readonly properties", () => {
    it("should document readonly limitation", () => {
      interface ReadonlyConfig {
        readonly apiKey?: string;
        readonly version?: number;
        mutable?: string;
      }

      const _defaults = {
        apiKey: "default-key",
        version: 1,
        mutable: "can-change",
      };

      type MergedReadonly = WithDefaults<ReadonlyConfig, typeof _defaults>;

      // Type test - readonly is not preserved in the merged type
      // This is a known limitation that should be documented
      const config: MergedReadonly = {
        apiKey: "custom-key",
        version: 2,
        mutable: "changed",
      };

      // This would normally error if readonly was preserved:
      // But it doesn't because readonly is lost
      config.apiKey = "mutated";

      expect(config.apiKey).toBe("mutated");
    });
  });

  describe("Class instances", () => {
    it("should document class instance limitation", () => {
      class CustomDate {
        constructor(public value: number) {}
        toString() {
          return `CustomDate(${this.value})`;
        }
      }

      interface Config {
        date?: CustomDate;
        settings?: {
          date?: CustomDate;
          value?: number;
        };
      }

      const defaultDate = new CustomDate(1);
      const defaults = {
        date: defaultDate,
        settings: {
          date: new CustomDate(2),
          value: 100,
        },
      };

      const customDate = new CustomDate(3);
      const result = applyDefaults<Config>(defaults, {
        date: customDate,
        settings: {
          value: 200,
        },
      });

      // LIMITATION: Class instances are treated as plain objects
      // They lose their prototype chain and methods
      expect(result.date).toEqual({ value: 3 }); // Plain object, not instance
      expect((result.date as any).value).toBe(3);

      // Nested class instance also becomes plain object
      expect(result.settings?.date).toEqual({ value: 2 });
      expect(result.settings?.value).toBe(200);
    });
  });

  describe("Circular references", () => {
    it("should document circular reference limitation", () => {
      // Note: This test documents that circular references are NOT supported
      // Attempting to merge objects with circular references will cause stack overflow

      interface CircularConfig {
        name?: string;
        self?: CircularConfig;
      }

      const defaults: CircularConfig = {
        name: "default",
      };
      // Creating circular reference would cause issues:
      // defaults.self = defaults; // DON'T DO THIS!

      const props: CircularConfig = {
        name: "custom",
      };

      // This works fine without circular references
      const result = applyDefaults<CircularConfig>(defaults, props);
      expect(result.name).toBe("custom");

      // Document that circular references are not supported
      // Users should avoid circular structures in their defaults/props
    });
  });

  describe("Special values", () => {
    it("should handle NaN, Infinity, and -Infinity", () => {
      interface MathConfig {
        timeout?: number;
        maxRetries?: number;
        threshold?: number;
      }

      const defaults = {
        timeout: NaN,
        maxRetries: Infinity,
        threshold: -Infinity,
      };

      const result = applyDefaults<MathConfig>(defaults, {
        timeout: 5000,
      });

      expect(result.timeout).toBe(5000);
      expect(result.maxRetries).toBe(Infinity);
      expect(result.threshold).toBe(-Infinity);
    });

    it("should document Date and RegExp limitation", () => {
      interface TimeConfig {
        startDate?: Date;
        endDate?: Date;
        pattern?: RegExp;
      }

      const defaultStart = new Date("2024-01-01");
      const defaultEnd = new Date("2024-12-31");
      const defaultPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      const defaults = {
        startDate: defaultStart,
        endDate: defaultEnd,
        pattern: defaultPattern,
      };

      const customStart = new Date("2024-06-01");
      const customPattern = /^.+@company\.com$/;

      // First, let's verify the actual behavior
      const result = applyDefaults<TimeConfig>(defaults, {
        startDate: customStart,
        pattern: customPattern,
      });

      // LIMITATION: Date and RegExp objects are treated as plain objects by isPlainObject
      // The spread operator {...date} on Date/RegExp creates empty objects
      // So the merge results in empty objects

      // Check if the result is actually a Date/RegExp or empty object
      const isStartDateEmpty = Object.keys(result.startDate as any).length === 0;
      const isEndDateEmpty = Object.keys(result.endDate as any).length === 0;
      const isPatternEmpty = Object.keys(result.pattern as any).length === 0;

      expect(isStartDateEmpty).toBe(true); // Becomes empty object
      expect(isEndDateEmpty).toBe(true); // Becomes empty object
      expect(isPatternEmpty).toBe(true); // Becomes empty object

      // Recommendation: For Date/RegExp, replace the entire property
      // instead of relying on deep merge
    });
  });

  describe("Type edge cases", () => {
    it("should handle union types with literals", () => {
      interface ThemeConfig {
        mode?: "light" | "dark" | "auto";
        size?: "small" | "medium" | "large";
        position?: "top" | "bottom" | "left" | "right";
      }

      const defaults = {
        mode: "auto" as const,
        size: "medium" as const,
        position: "top" as const,
      };

      type MergedTheme = WithDefaults<ThemeConfig, typeof defaults>;

      const theme: MergedTheme = {
        mode: "dark",
        size: "large",
        position: "bottom",
      };

      expect(theme.mode).toBe("dark");

      // Runtime test
      const result = applyDefaults<ThemeConfig>(defaults, {
        mode: "light",
      });

      expect(result).toEqual({
        mode: "light",
        size: "medium",
        position: "top",
      });
    });

    it("should document discriminated union limitation", () => {
      type Shape =
        | { kind: "circle"; radius?: number }
        | { kind: "rectangle"; width?: number; height?: number }
        | { kind: "triangle"; base?: number; height?: number };

      interface Drawing {
        shape?: Shape;
        color?: string;
      }

      const defaults = {
        shape: { kind: "circle" as const, radius: 10 },
        color: "blue",
      };

      const result = applyDefaults<Drawing>(defaults, {
        shape: { kind: "rectangle", width: 20, height: 30 },
      });

      // LIMITATION: Discriminated unions don't work correctly
      // Properties from different variants get merged incorrectly
      expect(result.shape).toEqual({
        kind: "rectangle",
        radius: 10, // This shouldn't be here!
        width: 20,
        height: 30,
      });
      expect(result.color).toBe("blue");

      // For discriminated unions, users should replace the entire object
      // rather than relying on deep merge
    });

    it("should preserve branded types", () => {
      // Brand type pattern
      type UserId = string & { __brand: "UserId" };
      type ApiKey = string & { __brand: "ApiKey" };

      const createUserId = (id: string): UserId => id as UserId;
      const createApiKey = (key: string): ApiKey => key as ApiKey;

      interface Config {
        userId?: UserId;
        apiKey?: ApiKey;
        name?: string;
      }

      const defaults = {
        userId: createUserId("default-user"),
        apiKey: createApiKey("default-key"),
        name: "default",
      };

      type MergedConfig = WithDefaults<Config, typeof defaults>;

      // Type test - branded types should work in unions
      const _config: MergedConfig = {
        userId: createUserId("custom-user"),
        apiKey: createApiKey("custom-key"),
        name: "custom",
      };

      // Runtime test
      const result = applyDefaults<Config>(defaults, {
        userId: createUserId("new-user"),
      });

      expect(result.userId).toBe("new-user");
      expect(result.apiKey).toBe("default-key");

      // The brands are preserved at the type level
      // but at runtime they're just strings
      const testUserId: UserId = result.userId!;
      const testApiKey: ApiKey = result.apiKey!;

      expect(typeof testUserId).toBe("string");
      expect(typeof testApiKey).toBe("string");
    });

    it("should handle template literal types", () => {
      interface Config {
        env?: `${string}-${string}`;
        version?: `v${number}.${number}.${number}`;
        endpoint?: string;
      }

      const defaults = {
        env: "prod-us-east-1" as const,
        version: "v1.0.0" as const,
        endpoint: "/api",
      };

      type MergedConfig = WithDefaults<Config, typeof defaults>;

      // Type test
      const _config: MergedConfig = {
        env: "dev-eu-west-1",
        version: "v2.1.0",
        endpoint: "/api/v2",
      };

      // Runtime test
      const result = applyDefaults<Config>(defaults, {
        env: "staging-us-west-2",
      });

      expect(result.env).toBe("staging-us-west-2");
      expect(result.version).toBe("v1.0.0");
      expect(result.endpoint).toBe("/api");
    });
  });
});
