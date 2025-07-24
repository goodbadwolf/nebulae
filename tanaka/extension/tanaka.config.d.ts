/**
 * Configuration for the web-ext tool used during development
 */
export interface WebExtConfig {
  /** Source directory for web-ext to load the extension from */
  sourceDir: string;

  /** Firefox profile to use for development (optional) */
  firefoxProfile?: string;

  /** URLs to open when Firefox starts */
  startUrls: string[];

  /** Whether to open the browser console on startup */
  browserConsole: boolean;

  /** Whether to open the developer tools on startup */
  devtools: boolean;
}

/**
 * Main configuration interface for the Tanaka extension build system
 */
export interface TanakaConfig {
  /** Source directory containing the extension source code */
  srcDir: string;

  /** Directory containing static assets (manifest.json, icons, etc.) */
  staticDir: string;

  /** Output directory for built extension */
  buildDir: string;

  /** Path to manifest.json file */
  manifestFile: string;

  /** Icon sizes to generate (e.g., [16, 32, 48, 128]) */
  iconSizes: number[];

  /** Entry points for different extension contexts */
  entries: {
    /** Popup UI entry point */
    popup?: string;
    /** Background script entry point */
    background?: string;
    /** Content script entry point */
    content?: string;
    /** Options page entry point */
    options?: string;
    /** Allow custom entry points */
    [key: string]: string | undefined;
  };

  /** web-ext tool configuration */
  webExt: WebExtConfig;
}

/** Supported environment types */
export type Environment = "development" | "production" | "test";
