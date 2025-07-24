import { describe, expect, it } from "vitest";

import { createDefaultsApplier, type PartialWithDefaults, type WithDefaults } from "../with-defaults";

describe("WithDefaults with React patterns", () => {
  describe("React Component Props", () => {
    it("should work with React component props pattern", () => {
      // Common React component props pattern
      interface ButtonPropsBase {
        variant?: "primary" | "secondary" | "ghost";
        size?: "small" | "medium" | "large";
        disabled?: boolean;
        loading?: boolean;
        onClick?: (event: MouseEvent) => void;
        children?: React.ReactNode;
        className?: string;
      }

      const buttonDefaults = {
        variant: "primary" as const,
        size: "medium" as const,
        disabled: false,
        loading: false,
      };

      // For required props with defaults shown
      type _ButtonProps = WithDefaults<ButtonPropsBase, typeof buttonDefaults>;

      // Component would use it like:
      const createButtonProps = createDefaultsApplier<ButtonPropsBase>(buttonDefaults);

      // Test that defaults are applied
      const props1 = createButtonProps({ children: "Click me" });
      expect(props1.variant).toBe("primary");
      expect(props1.size).toBe("medium");
      expect(props1.disabled).toBe(false);

      // Test partial overrides
      const props2 = createButtonProps({
        variant: "secondary",
        onClick: () => {},
      });
      expect(props2.variant).toBe("secondary");
      expect(props2.size).toBe("medium"); // Still has default
    });

    it("should work with PartialWithDefaults for optional component props", () => {
      // When you want to show defaults but keep props optional
      interface CardPropsBase {
        title?: string;
        subtitle?: string;
        elevation?: 0 | 1 | 2 | 3;
        padding?: "none" | "small" | "medium" | "large";
        footer?: React.ReactNode;
      }

      const cardDefaults = {
        elevation: 1 as const,
        padding: "medium" as const,
      };

      // All props remain optional but show defaults in IntelliSense
      type _CardProps = PartialWithDefaults<CardPropsBase, typeof cardDefaults>;

      // Runtime helper for the component
      const applyCardDefaults = createDefaultsApplier<CardPropsBase>(cardDefaults);

      // Component can be called with no props
      const props1 = applyCardDefaults();
      expect(props1.elevation).toBe(1);
      expect(props1.padding).toBe("medium");
      expect(props1.title).toBeUndefined();

      // Or with some props
      const props2 = applyCardDefaults({ title: "My Card", elevation: 3 });
      expect(props2.title).toBe("My Card");
      expect(props2.elevation).toBe(3);
      expect(props2.padding).toBe("medium");
    });

    it("should handle complex nested component props", () => {
      interface ThemeConfig {
        colors?: {
          primary?: string;
          secondary?: string;
          background?: string;
          text?: string;
        };
        spacing?: {
          small?: number;
          medium?: number;
          large?: number;
        };
        breakpoints?: {
          mobile?: number;
          tablet?: number;
          desktop?: number;
        };
      }

      const themeDefaults = {
        colors: {
          primary: "#007bff",
          secondary: "#6c757d",
          background: "#ffffff",
          text: "#212529",
        },
        spacing: {
          small: 8,
          medium: 16,
          large: 24,
        },
        breakpoints: {
          mobile: 480,
          tablet: 768,
          desktop: 1024,
        },
      };

      type _Theme = WithDefaults<ThemeConfig, typeof themeDefaults>;

      const createTheme = createDefaultsApplier<ThemeConfig>(themeDefaults);

      // Test partial theme customization
      const customTheme = createTheme({
        colors: {
          primary: "#ff0000",
          // Other colors use defaults
        },
        spacing: {
          large: 32, // Override just large
        },
      });

      expect(customTheme.colors!.primary).toBe("#ff0000");
      expect(customTheme.colors!.secondary).toBe("#6c757d"); // Default
      expect(customTheme.spacing!.large).toBe(32);
      expect(customTheme.spacing!.medium).toBe(16); // Default
      expect(customTheme.breakpoints!.tablet).toBe(768); // Default
    });
  });

  describe("React Hook Configuration", () => {
    it("should work with custom hook options", () => {
      interface UseFetchOptionsBase {
        method?: "GET" | "POST" | "PUT" | "DELETE";
        retries?: number;
        timeout?: number;
        cache?: boolean;
        headers?: Record<string, string>;
        onSuccess?: (data: unknown) => void;
        onError?: (error: Error) => void;
      }

      const fetchDefaults = {
        method: "GET" as const,
        retries: 3,
        timeout: 30000,
        cache: true,
        headers: {
          "Content-Type": "application/json",
        },
      };

      type _UseFetchOptions = WithDefaults<UseFetchOptionsBase, typeof fetchDefaults>;

      // Hook implementation would use:
      const applyFetchDefaults = createDefaultsApplier<UseFetchOptionsBase>(fetchDefaults);

      // Test various usage patterns
      const options1 = applyFetchDefaults();
      expect(options1.method).toBe("GET");
      expect(options1.retries).toBe(3);
      expect(options1.headers).toEqual({ "Content-Type": "application/json" });

      const options2 = applyFetchDefaults({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
        },
      });
      expect(options2.method).toBe("POST");
      expect(options2.headers).toEqual({
        "Content-Type": "application/json",
        Authorization: "Bearer token",
      });
    });

    it("should work with React context default values", () => {
      interface AppContextBase {
        user?: {
          id?: string;
          name?: string;
          role?: "admin" | "user" | "guest";
        };
        settings?: {
          theme?: "light" | "dark" | "auto";
          language?: string;
          notifications?: boolean;
        };
        feature?: {
          analytics?: boolean;
          experiments?: boolean;
        };
      }

      const contextDefaults = {
        user: {
          role: "guest" as const,
        },
        settings: {
          theme: "auto" as const,
          language: "en",
          notifications: true,
        },
        feature: {
          analytics: false,
          experiments: false,
        },
      };

      type _AppContext = WithDefaults<AppContextBase, typeof contextDefaults>;

      const createContextValue = createDefaultsApplier<AppContextBase>(contextDefaults);

      // Test logged-in user scenario
      const loggedInContext = createContextValue({
        user: {
          id: "123",
          name: "John Doe",
          role: "user",
        },
        feature: {
          analytics: true, // Premium user
        },
      });

      expect(loggedInContext.user!.role).toBe("user");
      expect(loggedInContext.settings!.theme).toBe("auto"); // Default
      expect(loggedInContext.feature!.analytics).toBe(true);
      expect(loggedInContext.feature!.experiments).toBe(false); // Default
    });
  });

  describe("React Form Libraries", () => {
    it("should work with form field configuration", () => {
      interface FieldConfigBase {
        type?: "text" | "email" | "password" | "number" | "date";
        required?: boolean;
        disabled?: boolean;
        placeholder?: string;
        validation?: {
          minLength?: number;
          maxLength?: number;
          pattern?: RegExp;
          custom?: (value: unknown) => string | undefined;
        };
        autoComplete?: string;
      }

      const fieldDefaults = {
        type: "text" as const,
        required: false,
        disabled: false,
        validation: {
          minLength: 0,
          maxLength: 255,
        },
      };

      type _FieldConfig = WithDefaults<FieldConfigBase, typeof fieldDefaults>;

      const createFieldConfig = createDefaultsApplier<FieldConfigBase>(fieldDefaults);

      // Email field with some overrides
      const emailField = createFieldConfig({
        type: "email",
        required: true,
        placeholder: "Enter your email",
        validation: {
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        autoComplete: "email",
      });

      expect(emailField.type).toBe("email");
      expect(emailField.required).toBe(true);
      expect(emailField.disabled).toBe(false); // Default
      expect(emailField.validation!.maxLength).toBe(255); // Default preserved
      expect(emailField.validation!.pattern).toBeDefined();
    });
  });

  describe("React Component Libraries", () => {
    it("should work with design system component variants", () => {
      interface DesignSystemConfig {
        components?: {
          button?: {
            defaultVariant?: string;
            defaultSize?: string;
            ripple?: boolean;
          };
          input?: {
            defaultVariant?: string;
            showError?: boolean;
            floatingLabel?: boolean;
          };
          modal?: {
            closeOnOverlayClick?: boolean;
            closeOnEscape?: boolean;
            animation?: "fade" | "slide" | "zoom";
          };
        };
        global?: {
          darkMode?: boolean;
          rtl?: boolean;
          density?: "compact" | "normal" | "comfortable";
        };
      }

      const designSystemDefaults = {
        components: {
          button: {
            defaultVariant: "filled",
            defaultSize: "medium",
            ripple: true,
          },
          input: {
            defaultVariant: "outlined",
            showError: true,
            floatingLabel: false,
          },
          modal: {
            closeOnOverlayClick: true,
            closeOnEscape: true,
            animation: "fade" as const,
          },
        },
        global: {
          darkMode: false,
          rtl: false,
          density: "normal" as const,
        },
      };

      type _DSConfig = WithDefaults<DesignSystemConfig, typeof designSystemDefaults>;

      const createDSConfig = createDefaultsApplier<DesignSystemConfig>(designSystemDefaults);

      // Dark mode theme with some overrides
      const darkTheme = createDSConfig({
        global: {
          darkMode: true,
        },
        components: {
          modal: {
            animation: "zoom",
          },
        },
      });

      expect(darkTheme.global!.darkMode).toBe(true);
      expect(darkTheme.global!.density).toBe("normal"); // Default
      expect(darkTheme.components!.button!.ripple).toBe(true); // Default
      expect(darkTheme.components!.modal!.animation).toBe("zoom");
      expect(darkTheme.components!.modal!.closeOnEscape).toBe(true); // Default
    });
  });

  describe("React Server Components", () => {
    it("should work with RSC configuration patterns", () => {
      interface PageConfigBase {
        revalidate?: number | false;
        dynamic?: "auto" | "force-dynamic" | "force-static" | "error";
        dynamicParams?: boolean;
        runtime?: "nodejs" | "edge";
        preferredRegion?: string | string[];
        maxDuration?: number;
      }

      const pageDefaults = {
        revalidate: 3600, // 1 hour
        dynamic: "auto" as const,
        dynamicParams: true,
        runtime: "nodejs" as const,
        maxDuration: 30,
      };

      type _PageConfig = WithDefaults<PageConfigBase, typeof pageDefaults>;

      const createPageConfig = createDefaultsApplier<PageConfigBase>(pageDefaults);

      // Static page with custom revalidation
      const staticPage = createPageConfig({
        revalidate: 86400, // 24 hours
        dynamic: "force-static",
      });

      expect(staticPage.revalidate).toBe(86400);
      expect(staticPage.dynamic).toBe("force-static");
      expect(staticPage.runtime).toBe("nodejs"); // Default

      // Edge function page
      const edgePage = createPageConfig({
        runtime: "edge",
        preferredRegion: ["iad1", "sfo1"],
        maxDuration: 10,
      });

      expect(edgePage.runtime).toBe("edge");
      expect(edgePage.preferredRegion).toEqual(["iad1", "sfo1"]);
      expect(edgePage.revalidate).toBe(3600); // Default
    });
  });
});
