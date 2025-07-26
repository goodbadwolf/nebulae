import "./spin.scss";

import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";

import { getCSSAnimationDuration } from "../../utils/animation-utils";

export type SpinSpeed = boolean | number | "fast" | "base" | "slow" | string;

export interface SpinProps {
  children: ReactNode;
  speed?: SpinSpeed;
  className?: string;
}

export function Spin({ children, speed = true, className = "" }: SpinProps) {
  const classes = clsx("tnk-spin-wrapper", speed && "tnk-spin-wrapper--spin", className);
  const spinStyle: CSSProperties = speed
    ? ({ "--tnk-spin-duration": getCSSAnimationDuration(speed) } as CSSProperties)
    : {};

  return (
    <span className={classes} style={spinStyle}>
      {children}
    </span>
  );
}
