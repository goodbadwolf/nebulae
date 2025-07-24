import { describe, expect, it } from "vitest";

import type { WithDefaults } from "../index";
import { applyDefaults, withDefaults } from "../with-defaults";

describe("WithDefaults type", () => {
  // Type-level tests using type assertions
  it("should show literal defaults in type", () => {
    interface ConfigBase {
      theme?: string;
      debug?: boolean;
      port?: number;
    }

    type ConfigDefaults = {
      theme: "dark";
      debug: false;
      port: 3000;
    };

    type Config = WithDefaults<ConfigBase, ConfigDefaults>;

    // IMPORTANT: WithDefaults is a type-only construct. It doesn't apply defaults at runtime.
    // An empty object would NOT have default values - you must explicitly set them or use
    // the runtime helpers (withDefaults/applyDefaults) to apply defaults.

    // Type test - verify that the type allows default values
    const configWithDefaults: Config = {
      theme: "dark",
      debug: false,
      port: 3000,
    };

    // Type test - verify that the type allows other values too
    const configWithOverrides: Config = {
      theme: "light", // Can override with any string
      debug: true, // Can override with any boolean
      port: 8080, // Can override with any number
    };

    expect(configWithDefaults).toEqual({
      theme: "dark",
      debug: false,
      port: 3000,
    });

    expect(configWithOverrides).toEqual({
      theme: "light",
      debug: true,
      port: 8080,
    });

    // Demonstrate that an empty object does NOT have defaults
    // (This would fail TypeScript compilation because properties are required)
    // const emptyConfig: Config = {};  // ❌ TypeScript error!

    // This is why we need runtime helpers:

    // Test with runtime helper
    const applyConfigDefaults = withDefaults<ConfigBase>({
      theme: "dark",
      debug: false,
      port: 3000,
    });

    // Test applying all defaults
    const config1 = applyConfigDefaults();
    expect(config1).toEqual({
      theme: "dark",
      debug: false,
      port: 3000,
    });

    // Test overriding some defaults
    const config2 = applyConfigDefaults({ theme: "light", port: 8080 });
    expect(config2).toEqual({
      theme: "light",
      debug: false,
      port: 8080,
    });
  });

  it("should handle nested defaults", () => {
    interface SettingsBase {
      ui?: {
        theme?: string;
        fontSize?: number;
      };
      api?: {
        timeout?: number;
        retries?: number;
      };
    }

    type SettingsDefaults = {
      ui: {
        theme: "dark";
        fontSize: 14;
      };
      api: {
        timeout: 5000;
      };
    };

    type Settings = WithDefaults<SettingsBase, SettingsDefaults>;

    // Type test - verify nested defaults are part of the type
    const settingsInstance: Settings = {
      ui: {
        theme: "dark",
        fontSize: 14,
      },
      api: {
        timeout: 5000,
        retries: 3, // Optional property can still be added
      },
    };
    expect(settingsInstance).toEqual({
      ui: {
        theme: "dark",
        fontSize: 14,
      },
      api: {
        timeout: 5000,
        retries: 3,
      },
    });

    // Test runtime behavior with actual values
    const applySettingsDefaults = withDefaults<SettingsBase>({
      ui: {
        theme: "dark",
        fontSize: 14,
      },
      api: {
        timeout: 5000,
      },
    });

    const settings1 = applySettingsDefaults();
    expect(settings1).toEqual({
      ui: {
        theme: "dark",
        fontSize: 14,
      },
      api: {
        timeout: 5000,
      },
    });

    const settings2 = applySettingsDefaults({
      ui: { theme: "light" },
      api: { retries: 3 },
    });
    expect(settings2).toEqual({
      ui: {
        theme: "light",
        fontSize: 14, // Default preserved
      },
      api: {
        timeout: 5000, // Default preserved
        retries: 3,
      },
    });
  });

  it("should create union types allowing both defaults and original types", () => {
    interface Options {
      mode?: "light" | "dark" | "auto";
      size?: number;
      enabled?: boolean;
    }

    type OptionDefaults = {
      mode: "auto";
      size: 100;
      enabled: true;
    };

    type MergedOptions = WithDefaults<Options, OptionDefaults>;

    // All of these should be valid
    const opt1: MergedOptions = {
      mode: "auto", // Default value
      size: 100, // Default value
      enabled: true, // Default value
    };

    const opt2: MergedOptions = {
      mode: "light", // Other valid value from original type
      size: 200, // Different number
      enabled: false, // Different boolean
    };

    const opt3: MergedOptions = {
      mode: "dark", // Another valid value
      size: 50, // Another number
      enabled: true,
    };

    expect(opt1).toEqual({
      mode: "auto",
      size: 100,
      enabled: true,
    });
    expect(opt2).toEqual({
      mode: "light",
      size: 200,
      enabled: false,
    });
    expect(opt3).toEqual({
      mode: "dark",
      size: 50,
      enabled: true,
    });

    // Test runtime behavior as well
    const applyDefaults = withDefaults<Options>({
      mode: "auto",
      size: 100,
      enabled: true,
    });

    const result1 = applyDefaults();
    expect(result1).toEqual({
      mode: "auto",
      size: 100,
      enabled: true,
    });

    const result2 = applyDefaults({ mode: "light" });
    expect(result2).toEqual({
      mode: "light",
      size: 100,
      enabled: true,
    });

    const result3 = applyDefaults({ size: 50, enabled: false });
    expect(result3).toEqual({
      mode: "auto",
      size: 50,
      enabled: false,
    });
  });

  it("should handle arrays in defaults", () => {
    interface ConfigWithArrays {
      tags?: string[];
      numbers?: number[];
    }

    type ArrayDefaults = {
      tags: ["default", "tag"];
      numbers: [1, 2, 3];
    };

    type MergedConfig = WithDefaults<ConfigWithArrays, ArrayDefaults>;

    const config: MergedConfig = {
      tags: ["default", "tag"], // Can use default array
      numbers: [4, 5, 6], // Or different array
    };

    expect(config).toEqual({
      tags: ["default", "tag"],
      numbers: [4, 5, 6],
    });
  });

  it("should handle optional properties not in defaults", () => {
    interface UserSettings {
      name?: string;
      email?: string;
      age?: number;
      premium?: boolean;
    }

    type UserDefaults = {
      name: "Anonymous";
      premium: false;
      // Note: email and age have no defaults
    };

    type MergedSettings = WithDefaults<UserSettings, UserDefaults>;

    const settings: MergedSettings = {
      name: "John",
      email: "john@example.com", // Should still be optional
      premium: true,
      // age is still optional and can be omitted
    };

    expect(settings).toEqual({
      name: "John",
      email: "john@example.com",
      premium: true,
    });

    // Verify that properties without defaults are still optional
    const minimal: MergedSettings = {
      name: "Anonymous", // Has default
      premium: false, // Has default
      // email and age are optional - can be omitted
    };

    expect(minimal).toEqual({
      name: "Anonymous",
      premium: false,
    });
  });

  it("should handle deeply nested objects", () => {
    interface DeepConfig {
      server?: {
        database?: {
          connection?: {
            host?: string;
            port?: number;
          };
          pool?: {
            min?: number;
            max?: number;
          };
        };
      };
    }

    type DeepDefaults = {
      server: {
        database: {
          connection: {
            host: "localhost";
            port: 5432;
          };
          pool: {
            min: 2;
          };
        };
      };
    };

    type MergedDeep = WithDefaults<DeepConfig, DeepDefaults>;

    const config: MergedDeep = {
      server: {
        database: {
          connection: {
            host: "prod-server", // Override default
            port: 5432,
          },
          pool: {
            min: 2,
            max: 10, // Add optional property
          },
        },
      },
    };

    expect(config).toEqual({
      server: {
        database: {
          connection: {
            host: "prod-server",
            port: 5432,
          },
          pool: {
            min: 2,
            max: 10,
          },
        },
      },
    });
  });
});

describe("withDefaults runtime helper", () => {
  it("should apply defaults to props", () => {
    interface PageProps {
      title?: string;
      theme?: "light" | "dark";
      showHeader?: boolean;
    }

    const defaults = {
      title: "Default Title",
      theme: "dark" as const,
      showHeader: true,
    };

    const applyDefaults = withDefaults<PageProps>(defaults);

    const result1 = applyDefaults();
    expect(result1).toEqual({
      title: "Default Title",
      theme: "dark",
      showHeader: true,
    });

    const result2 = applyDefaults({ title: "Custom Title" });
    expect(result2).toEqual({
      title: "Custom Title",
      theme: "dark",
      showHeader: true,
    });

    const result3 = applyDefaults({ theme: "light", showHeader: false });
    expect(result3).toEqual({
      title: "Default Title",
      theme: "light",
      showHeader: false,
    });
  });

  it("should handle nested objects", () => {
    interface Config {
      app?: {
        name?: string;
        version?: string;
      };
      server?: {
        host?: string;
        port?: number;
        ssl?: {
          enabled?: boolean;
          cert?: string;
        };
      };
    }

    const defaults = {
      app: {
        name: "MyApp",
        version: "1.0.0",
      },
      server: {
        host: "localhost",
        port: 3000,
        ssl: {
          enabled: false,
        },
      },
    };

    const applyDef = withDefaults<Config>(defaults);

    const result = applyDef({
      server: {
        port: 8080,
        ssl: {
          enabled: true,
          cert: "/path/to/cert",
        },
      },
    });

    expect(result).toEqual({
      app: {
        name: "MyApp",
        version: "1.0.0",
      },
      server: {
        host: "localhost",
        port: 8080,
        ssl: {
          enabled: true,
          cert: "/path/to/cert",
        },
      },
    });
  });
});

describe("applyDefaults direct function", () => {
  it("should apply defaults directly", () => {
    interface UserPrefs {
      theme?: string;
      language?: string;
      notifications?: boolean;
    }

    const defaults = {
      theme: "dark",
      language: "en",
      notifications: true,
    };

    const result1 = applyDefaults<UserPrefs>(defaults);
    expect(result1).toEqual(defaults);

    const result2 = applyDefaults<UserPrefs>(defaults, { theme: "light" });
    expect(result2).toEqual({
      theme: "light",
      language: "en",
      notifications: true,
    });

    const result3 = applyDefaults<UserPrefs>(defaults, {
      language: "es",
      notifications: false,
    });
    expect(result3).toEqual({
      theme: "dark",
      language: "es",
      notifications: false,
    });
  });

  it("should handle undefined props", () => {
    interface Settings {
      debug?: boolean;
      logLevel?: string;
    }

    const defaults = {
      debug: false,
      logLevel: "info",
    };

    const result = applyDefaults<Settings>(defaults, undefined);
    expect(result).toEqual(defaults);
  });

  it("should preserve additional properties from props", () => {
    interface BaseConfig {
      name?: string;
      value?: number;
    }

    const defaults = {
      name: "default",
      value: 0,
    };

    const props = {
      name: "custom",
      value: 42,
      extra: "additional",
    };

    const result = applyDefaults<BaseConfig>(defaults, props);
    expect(result).toEqual({
      name: "custom",
      value: 42,
      extra: "additional",
    });
  });

  it("should handle null values correctly", () => {
    interface Settings {
      value?: string | null;
      count?: number | null;
    }

    const defaults = {
      value: null,
      count: 0,
    };

    const result1 = applyDefaults<Settings>(defaults, { value: "test" });
    expect(result1.value).toBe("test");

    const result2 = applyDefaults<Settings>(defaults, { count: null });
    expect(result2.count).toBe(null);
  });

  it("should handle arrays properly", () => {
    interface Config {
      items?: string[];
      flags?: boolean[];
    }

    const defaults = {
      items: ["a", "b"],
      flags: [true, false],
    };

    const result = applyDefaults<Config>(defaults, {
      items: ["c", "d", "e"],
    });

    // Arrays should be replaced, not merged
    expect(result.items).toEqual(["c", "d", "e"]);
    expect(result.flags).toEqual([true, false]);
  });

  it("should handle deeply nested merging", () => {
    interface DeepConfig {
      api?: {
        endpoints?: {
          auth?: string;
          data?: string;
        };
        timeout?: number;
        retry?: {
          attempts?: number;
          delay?: number;
        };
      };
    }

    const defaults = {
      api: {
        endpoints: {
          auth: "/auth",
          data: "/data",
        },
        timeout: 5000,
        retry: {
          attempts: 3,
          delay: 1000,
        },
      },
    };

    const result = applyDefaults<DeepConfig>(defaults, {
      api: {
        endpoints: {
          auth: "/v2/auth",
        },
        retry: {
          attempts: 5,
        },
      },
    });

    expect(result).toEqual({
      api: {
        endpoints: {
          auth: "/v2/auth",
          data: "/data",
        },
        timeout: 5000,
        retry: {
          attempts: 5,
          delay: 1000,
        },
      },
    });
  });

  it("should handle edge case with empty objects", () => {
    interface Empty {
      data?: Record<string, never>;
    }

    const defaults = {
      data: {},
    };

    const result = applyDefaults<Empty>(defaults, {});
    expect(result.data).toEqual({});
  });

  it("should work with withDefaults curried function", () => {
    interface Theme {
      primary?: string;
      secondary?: string;
      mode?: "light" | "dark";
    }

    const defaults = {
      primary: "blue",
      secondary: "gray",
      mode: "light" as const,
    };

    const applyThemeDefaults = withDefaults<Theme>(defaults);

    // Test multiple applications
    const theme1 = applyThemeDefaults({ primary: "red" });
    expect(theme1).toEqual({
      primary: "red",
      secondary: "gray",
      mode: "light",
    });

    const theme2 = applyThemeDefaults({ mode: "dark" });
    expect(theme2).toEqual({
      primary: "blue",
      secondary: "gray",
      mode: "dark",
    });

    // Ensure function is reusable
    const theme3 = applyThemeDefaults();
    expect(theme3).toEqual(defaults);
  });
});
