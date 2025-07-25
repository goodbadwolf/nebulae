import "./responsive-grid.scss";

import { applyDefaults, type DeepPartial, type WithDefaults } from "@kiku/core";
import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";

interface ResponsiveGridPropsBase {
  children: ReactNode;
  className?: string;
  gridItemProps?: {
    className?: string;
    minWidth?: string;
    maxWidth?: string;
  };
  gap?: string;
}

const defaultProps = {
  className: "",
  gridItemProps: {
    minWidth: "1fr",
    maxWidth: "1fr",
  },
  gap: "var(--tnk-space-lg)",
} as const;

export type ResponsiveGridProps = WithDefaults<ResponsiveGridPropsBase, typeof defaultProps>;

export function ResponsiveGrid(props: DeepPartial<ResponsiveGridProps> = {}) {
  const {
    children,
    className,
    gridItemProps: { minWidth, maxWidth },
    gap,
  } = applyDefaults(defaultProps, props);

  const style = {
    ...(minWidth && { "--responsive-grid-min-item-width": minWidth }),
    ...(maxWidth && { "--responsive-grid-max-item-width": maxWidth }),
    ...(gap && { "--responsive-grid-gap": gap }),
  } as CSSProperties;

  return (
    <div className={clsx("tnk-responsive-grid", className)} style={style}>
      {children}
    </div>
  );
}
