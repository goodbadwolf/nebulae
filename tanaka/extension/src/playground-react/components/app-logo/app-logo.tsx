import "./app-logo.scss";

import { applyDefaults, type DeepPartial, type WithDefaults } from "@kiku/core";
import clsx from "clsx";

type AppLogoPropsBase = {
  size?: "sm" | "md" | "lg";
};

const defaultProps = {
  size: "md",
} as const;

export type AppLogoProps = WithDefaults<AppLogoPropsBase, typeof defaultProps>;

export function AppLogo(props: DeepPartial<AppLogoProps> = {}) {
  const { size } = applyDefaults(defaultProps, props);

  const classes = clsx("tnk-app-logo", `tnk-app-logo--${size}`);

  return <div className={classes}>T</div>;
}
