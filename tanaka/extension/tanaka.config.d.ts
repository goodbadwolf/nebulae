export interface WebExtConfig {
  sourceDir: string;
  firefoxProfile?: string;
  startUrls: string[];
  browserConsole: boolean;
  devtools: boolean;
}

export interface TanakaConfig {
  srcDir: string;
  staticDir: string;
  buildDir: string;
  manifestFile: string;
  iconSizes: number[];
  entries: {
    popup: string;
    background: string;
  };
  webExt: WebExtConfig;
}
