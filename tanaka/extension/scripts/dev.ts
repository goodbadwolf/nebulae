import { cac } from "cac";

import { type BuildMode, exitWithError, isValidMode, VALID_BUILD_MODES } from "./common";
import { logger } from "./logger";
import { ProcessManager, setupProcessHandlers } from "./process-utils";
import { rsbuildBuildConfig, rsbuildWatchConfig, webExtConfig } from "./rsbuild-utils";

const cli = cac("tanaka");

interface ModeOptions {
  mode: string;
}

type BuildOptions = ModeOptions;

type WatchOptions = ModeOptions;

type AnalyzeOptions = ModeOptions;

function createCommand(name: string, description: string, defaultMode: BuildMode = "dev") {
  return cli.command(name, description).option("-m, --mode <mode>", "Build mode (dev or prod)", {
    default: defaultMode,
  });
}

function validateMode(mode: string): BuildMode {
  if (!isValidMode(mode)) {
    exitWithError(`Invalid build mode: ${mode}. Valid modes are: ${VALID_BUILD_MODES.join(", ")}`);
  }
  return mode;
}

createCommand("build", "Build the extension").action(async (options: BuildOptions) => {
  const buildMode = validateMode(options.mode);

  logger.info(`Building extension in ${buildMode} mode`);

  const startTime = Date.now();
  const buildConfig = rsbuildBuildConfig(buildMode);

  const pm = new ProcessManager();
  const proc = pm.spawn(buildConfig);

  try {
    await proc.wait();
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.info(`✨ Build completed in ${duration}s`);
  } catch (error) {
    exitWithError("Build failed", error);
  }
});

createCommand("watch", "Build, watch for changes, and run in Firefox").action(async (options: WatchOptions) => {
  const buildMode = validateMode(options.mode);

  logger.info(`Starting watch mode in ${buildMode} mode`);

  const pm = new ProcessManager();
  setupProcessHandlers(() => pm.killAll());

  const watchConfig = rsbuildWatchConfig(buildMode);
  const webExtProcess = webExtConfig();

  pm.spawn(watchConfig);

  setTimeout(() => {
    pm.spawn(webExtProcess);
    pm.linkExitHandlers(watchConfig.name, webExtProcess.name, {
      onSuccess: true,
      onFailure: true,
    });
  }, 2000);

  logger.info("🚀 Development server running... (Press Ctrl+C to stop)");
});

// TODO: Implement bundle analysis
createCommand("analyze", "Analyze bundle size", "prod").action(async (options: AnalyzeOptions) => {
  const buildMode = validateMode(options.mode);

  logger.info(`Analyzing bundle in ${buildMode} mode`);

  logger.warn("Bundle analysis not yet implemented");
});

// Examples
cli.example("  $ tanaka build");
cli.example("  $ tanaka build --mode dev");
cli.example("  $ tanaka build --mode prod");
cli.example("  $ tanaka watch");
cli.example("  $ tanaka watch --mode prod");
cli.example("  $ tanaka analyze");
cli.example("  $ tanaka analyze --mode dev");

cli.help();
cli.parse();
