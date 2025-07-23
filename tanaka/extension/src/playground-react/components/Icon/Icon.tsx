import { IconContext } from "@phosphor-icons/react";
import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";

import { getCSSAnimationDuration } from "../../utils/animation-utils";
import styles from "./icon.module.scss";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
export type IconWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
export type IconSpinning = boolean | number | "fast" | "base" | "slow" | string;

interface IconProps {
  children: ReactNode;
  size?: IconSize;
  weight?: IconWeight;
  spinning?: IconSpinning;
  className?: string;
}

export function Icon({ children, size = "md", weight = "regular", spinning = false, className = "" }: IconProps) {
  const classes = clsx(
    styles.tnkIcon,
    size && styles[`tnkIcon--${size}`],
    spinning && styles["tnkIcon--spinning"],
    className
  );

  // Handle custom spin duration
  const style: CSSProperties = spinning
    ? ({ "--tnk-icon-spin-duration": getCSSAnimationDuration(spinning) } as CSSProperties)
    : {};

  return (
    <span className={classes} style={style}>
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
