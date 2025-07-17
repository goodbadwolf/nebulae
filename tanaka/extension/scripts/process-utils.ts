import { ChildProcess, spawn, SpawnOptions } from "node:child_process";
import { exitWithError } from "./common";
import { logger } from "./logger";

export interface ProcessConfig {
  name: string;
  command: string;
  args: string[];
  errorMessage: string;
  env?: Record<string, string>;
}

export class Process {
  private wrappedProcess: ChildProcess;
  private name: string;
  private config: ProcessConfig;

  constructor(config: ProcessConfig, options: SpawnOptions) {
    this.config = config;
    this.name = config.name;
    this.wrappedProcess = spawn(config.command, config.args, options);
  }

  on(event: string, listener: (...args: any[]) => void): this {
    this.wrappedProcess.on(event, listener);
    return this;
  }

  kill(): void {
    this.wrappedProcess.kill();
  }

  removeAllListeners(event: string): void {
    this.wrappedProcess.removeAllListeners(event);
  }

  async wait(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.wrappedProcess.on("close", (code) => {
        if (code === 0) {
          resolve(code);
        } else {
          reject(new Error(`${this.name} failed with exit code ${code}`));
        }
      });

      this.wrappedProcess.on("error", (error) => {
        reject(new Error(`${this.name} process error: ${error.message}`));
      });
    });
  }

  toString(): string {
    return `${this.name} (${this.config.command} ${this.config.args.join(
      " "
    )})`;
  }
}

export class ProcessManager {
  private processes = new Map<string, Process>();

  spawn(
    config: ProcessConfig,
    options: SpawnOptions = { stdio: "inherit", shell: false }
  ): Process {
    logger.info(`Starting ${config.name}...`);

    const spawnOptions = {
      ...options,
      env: { ...process.env, ...config.env },
    };

    const proc = new Process(config, spawnOptions);
    this.processes.set(config.name, proc);

    proc.on("error", (error) => {
      this.killAll();
      exitWithError(config.errorMessage, error);
    });

    return proc;
  }

  killAll(): void {
    for (const [name, proc] of this.processes) {
      logger.info(`Stopping ${name}...`);
      proc.kill();
    }
    this.processes.clear();
  }

  linkExitHandlers(
    primary: string,
    secondary: string,
    condition = { onSuccess: false, onFailure: true }
  ): void {
    logger.info(`Linking exit handlers for ${primary} and ${secondary}`);
    const primaryProc = this.processes.get(primary);
    const secondaryProc = this.processes.get(secondary);

    if (!primaryProc || !secondaryProc) {
      logger.error(
        `Failed to link exit handlers for ${primary} and ${secondary}`
      );
      return;
    }

    primaryProc.on("exit", (code) => {
      logger.info("Linked exit handler for primary process triggered");
      logger.info(`Primary process '${primary}' exited with code ${code}`);
      const shouldExitOnSuccess = condition.onSuccess && code === 0;
      const shouldExitOnFailure = condition.onFailure && code !== 0;
      if (shouldExitOnSuccess || shouldExitOnFailure) {
        this.unlinkExitHandlers(primary, secondary);
        logger.info(`Killing secondary process '${secondary}'`);
        secondaryProc.kill();
      }
    });

    secondaryProc.on("exit", (code) => {
      logger.info("Linked exit handler for secondary process triggered");
      logger.info(`Secondary process '${secondary}' exited with code ${code}`);
      const shouldExitOnSuccess = condition.onSuccess && code === 0;
      const shouldExitOnFailure = condition.onFailure && code !== 0;
      if (shouldExitOnSuccess || shouldExitOnFailure) {
        this.unlinkExitHandlers(primary, secondary);
        logger.info(`Killing primary process '${primary}'`);
        primaryProc.kill();
      }
    });
  }

  unlinkExitHandlers(primary: string, secondary: string): void {
    logger.info(`Unlinking exit handlers for ${primary} and ${secondary}`);
    const primaryProc = this.processes.get(primary);
    const secondaryProc = this.processes.get(secondary);

    if (!primaryProc || !secondaryProc) {
      logger.error(
        `Failed to unlink exit handlers for ${primary} and ${secondary}`
      );
      return;
    }

    primaryProc.removeAllListeners("exit");
    secondaryProc.removeAllListeners("exit");
  }
}

export function setupProcessHandlers(cleanup: () => void): void {
  process.on("SIGINT", () => {
    logger.info("Received SIGINT, cleaning up...");
    cleanup();
    process.exitCode = 0;
  });

  process.on("SIGTERM", () => {
    logger.info("Received SIGTERM, cleaning up...");
    cleanup();
    process.exitCode = 0;
  });

  process.on("unhandledRejection", (reason, _promise) => {
    logger.error({ err: reason }, "Unhandled promise rejection");
    process.exitCode = 1;
  });

  process.on("uncaughtException", (error) => {
    logger.error({ err: error }, "Uncaught exception");
    process.exitCode = 1;
  });
}
