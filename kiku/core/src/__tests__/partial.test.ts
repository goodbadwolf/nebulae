import { describe, expectTypeOf, it } from "vitest";

import type { DeepPartial } from "../partial";

describe("DeepPartial type", () => {
  it("should make all properties optional", () => {
    interface Config {
      name: string;
      port: number;
      enabled: boolean;
    }

    type PartialConfig = DeepPartial<Config>;

    expectTypeOf<PartialConfig>().toMatchTypeOf<{
      name?: string;
      port?: number;
      enabled?: boolean;
    }>();
  });

  it("should make nested properties optional", () => {
    interface NestedConfig {
      server: {
        host: string;
        port: number;
        ssl: {
          enabled: boolean;
          cert: string;
        };
      };
    }

    type PartialNestedConfig = DeepPartial<NestedConfig>;

    expectTypeOf<PartialNestedConfig>().toMatchTypeOf<{
      server?: {
        host?: string;
        port?: number;
        ssl?: {
          enabled?: boolean;
          cert?: string;
        };
      };
    }>();
  });

  it("should work with arrays", () => {
    interface WithArrays {
      items: string[];
      config: {
        values: number[];
      };
    }

    type PartialWithArrays = DeepPartial<WithArrays>;

    expectTypeOf<PartialWithArrays>().toMatchTypeOf<{
      items?: ReadonlyArray<string>;
      config?: {
        values?: ReadonlyArray<number>;
      };
    }>();
  });
});
