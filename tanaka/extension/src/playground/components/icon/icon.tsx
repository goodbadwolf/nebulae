import "./icon.scss";

import { applyDefaults, type DeepPartial, type WithDefaults } from "@kiku/core";
import { IconContext } from "@phosphor-icons/react";
import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";

import { getCSSAnimationDuration } from "../../utils/animation-utils";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
export type IconWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
export type IconSpinning = boolean | number | "fast" | "base" | "slow" | string;

type IconPropsBase = {
  children?: ReactNode;
  size?: IconSize;
  weight?: IconWeight;
  spinning?: IconSpinning;
  className?: string;
};

const defaultProps = {
  size: "md",
  weight: "regular",
  spinning: false,
  className: "",
} as const;

export type IconProps = WithDefaults<IconPropsBase, typeof defaultProps>;

export function Icon(props: DeepPartial<IconProps> = {}) {
  const { children, size, weight, spinning, className } = applyDefaults(defaultProps, props);

  const classes = clsx("tnk-icon", size && `tnk-icon--${size}`, spinning && "tnk-icon--spinning", className);
  const spinningStyle: CSSProperties = spinning
    ? ({ "--tnk-icon-spin-duration": getCSSAnimationDuration(spinning) } as CSSProperties)
    : {};

  return (
    <span className={classes} style={spinningStyle}>
      <IconContext.Provider
        value={{
          weight: weight,
        }}
      >
        {children}
      </IconContext.Provider>
    </span>
  );
}
