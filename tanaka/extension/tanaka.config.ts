import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export interface TanakaConfig {
  projectRoot: string;
  buildDir: string;
  publicDir: string;
  srcDir: string;
  manifestFile: string;
  iconSizes: number[];
  entries: {
    popup: string;
    background?: string;
    content?: string;
  };
  webExt: {
    sourceDir: string;
    firefoxProfile?: string;
    startUrls?: string[];
    browserConsole?: boolean;
    devtools?: boolean;
  };
}

const projectRoot = dirname(fileURLToPath(import.meta.url));
const buildDir = join(projectRoot, "dist");
const publicDir = join(projectRoot, "static");

export const tanakaConfig: TanakaConfig = {
  projectRoot,
  buildDir,
  publicDir,
  srcDir: join(projectRoot, "src"),
  manifestFile: join(publicDir, "manifest.json"),
  iconSizes: [16, 32, 48, 128],
  entries: {
    popup: "./src/popup/index.tsx",
  },
  webExt: {
    sourceDir: buildDir,
    startUrls: [
      "https://www.google.com",
      "https://www.youtube.com",
      "https://en.wikipedia.org",
    ],
    browserConsole: true,
    devtools: true,
  },
};

export default tanakaConfig;
