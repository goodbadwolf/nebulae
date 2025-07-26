import "./icon.scss";

import { type Icon as PhosphorIcon, IconContext } from "@phosphor-icons/react";
import clsx from "clsx";
import { createElement } from "react";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
export type IconWeight = "thin" | "light" | "regular" | "bold" | "fill" | "duotone";

export interface IconProps {
  icon: PhosphorIcon;
  size?: IconSize;
  weight?: IconWeight;
  className?: string;
}

export function Icon({ icon, size = "md", weight = "regular", className = "" }: IconProps) {
  const classes = clsx("tnk-icon", size && `tnk-icon--${size}`, className);

  return (
    <span className={classes}>
      <IconContext.Provider
        value={{
          weight: weight,
        }}
      >
        {createElement(icon)}
      </IconContext.Provider>
    </span>
  );
}
