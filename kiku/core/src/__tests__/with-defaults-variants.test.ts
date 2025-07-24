import { describe, expect, it } from "vitest";

import type { PartialWithDefaults, ShallowWithDefaults, StrictWithDefaults } from "../with-defaults";

describe("WithDefaults type variants", () => {
  describe("PartialWithDefaults", () => {
    it("should keep all properties optional while showing defaults", () => {
      interface ConfigBase {
        theme?: string;
        debug?: boolean;
        port?: number;
        settings?: {
          timeout?: number;
          retries?: number;
        };
      }

      type ConfigDefaults = {
        theme: "dark";
        debug: false;
        settings: {
          timeout: 5000;
        };
      };

      type Config = PartialWithDefaults<ConfigBase, ConfigDefaults>;

      // All properties remain optional
      const minimal: Config = {}; // This should be valid
      expect(minimal).toEqual({});

      // Can provide just some properties
      const partial: Config = {
        theme: "light",
      };
      expect(partial).toEqual({ theme: "light" });

      // Can use default values
      const withDefaults: Config = {
        theme: "dark",
        debug: false,
        settings: {
          timeout: 5000,
          retries: 3,
        },
      };
      expect(withDefaults).toEqual({
        theme: "dark",
        debug: false,
        settings: {
          timeout: 5000,
          retries: 3,
        },
      });

      // Can use other values
      const custom: Config = {
        theme: "custom",
        debug: true,
        port: 8080,
      };
      expect(custom).toEqual({
        theme: "custom",
        debug: true,
        port: 8080,
      });
    });

    it("should handle nested partials correctly", () => {
      interface DeepConfig {
        api?: {
          endpoints?: {
            auth?: string;
            data?: string;
          };
          timeout?: number;
        };
      }

      type DeepDefaults = {
        api: {
          endpoints: {
            auth: "/auth";
          };
          timeout: 5000;
        };
      };

      type Config = PartialWithDefaults<DeepConfig, DeepDefaults>;

      // Everything is still optional
      const empty: Config = {};
      expect(empty).toEqual({});

      // Can provide partial nested
      const partial: Config = {
        api: {
          timeout: 3000,
        },
      };
      expect(partial).toEqual({
        api: {
          timeout: 3000,
        },
      });
    });
  });

  describe("ShallowWithDefaults", () => {
    it("should only merge at top level", () => {
      interface ConfigBase {
        theme?: string;
        debug?: boolean;
        nested?: {
          value?: number;
          enabled?: boolean;
        };
      }

      type ConfigDefaults = {
        theme: "dark";
        nested: {
          value: 100;
          enabled: true;
        };
      };

      type Config = ShallowWithDefaults<ConfigBase, ConfigDefaults>;

      // Properties with defaults are required
      const config: Config = {
        theme: "light",
        nested: { value: 200, enabled: false },
      };
      expect(config).toEqual({
        theme: "light",
        nested: { value: 200, enabled: false },
      });

      // Can use default values
      const withDefaults: Config = {
        theme: "dark",
        nested: { value: 100, enabled: true },
      };
      expect(withDefaults).toEqual({
        theme: "dark",
        nested: { value: 100, enabled: true },
      });

      // debug remains optional since no default provided
      const minimal: Config = {
        theme: "dark",
        nested: { value: 100, enabled: true },
      };
      expect(minimal).toEqual({
        theme: "dark",
        nested: { value: 100, enabled: true },
      });
    });

    it("should show unions at top level only", () => {
      interface Settings {
        mode?: "light" | "dark" | "auto";
        size?: "small" | "medium" | "large";
        options?: {
          animation?: boolean;
          sound?: boolean;
        };
      }

      type Defaults = {
        mode: "auto";
        options: {
          animation: true;
          sound: false;
        };
      };

      type MergedSettings = ShallowWithDefaults<Settings, Defaults>;

      const settings: MergedSettings = {
        mode: "dark", // Can use any valid mode
        options: {
          animation: false,
          sound: true,
        },
      };

      expect(settings.mode).toBe("dark");
      expect(settings.options).toEqual({
        animation: false,
        sound: true,
      });
    });
  });

  describe("StrictWithDefaults", () => {
    it("should require defaults for all properties", () => {
      interface ConfigBase {
        theme?: string;
        debug?: boolean;
        port?: number;
      }

      // This works - all properties have defaults
      type ValidDefaults = {
        theme: "dark";
        debug: false;
        port: 3000;
      };

      type Config = StrictWithDefaults<ConfigBase, ValidDefaults>;

      const config: Config = {
        theme: "light",
        debug: true,
        port: 8080,
      };

      expect(config).toEqual({
        theme: "light",
        debug: true,
        port: 8080,
      });

      // Type would error if trying to use partial defaults:
      // type InvalidDefaults = {
      //   theme: "dark";
      //   debug: false;
      //   // Missing port!
      // };
      // type BadConfig = StrictWithDefaults<ConfigBase, InvalidDefaults>; // Type error!
    });

    it("should work with nested required properties", () => {
      interface AppConfig {
        name?: string;
        version?: string;
        features?: {
          auth?: boolean;
          api?: boolean;
        };
      }

      type CompleteDefaults = {
        name: "MyApp";
        version: "1.0.0";
        features: {
          auth: true;
          api: true;
        };
      };

      type Config = StrictWithDefaults<AppConfig, CompleteDefaults>;

      const config: Config = {
        name: "CustomApp",
        version: "2.0.0",
        features: {
          auth: false,
          api: true,
        },
      };

      expect(config.name).toBe("CustomApp");
      expect(config.features!.auth).toBe(false);
    });
  });
});
