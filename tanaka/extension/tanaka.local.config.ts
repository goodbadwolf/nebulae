import type { DeepPartial } from "@kiku/core";

import type { TanakaConfig } from "./tanaka.config.d";

const localConfig: DeepPartial<TanakaConfig> = {
  webExt: {
    devtools: false,
    browserConsole: false,
  },
};

export default localConfig;
