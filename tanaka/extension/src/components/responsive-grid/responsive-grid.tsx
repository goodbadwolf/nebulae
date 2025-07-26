import "./responsive-grid.scss";

import { clsx } from "clsx";
import type { CSSProperties, ReactNode } from "react";

export interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  gridItemProps?: {
    className?: string;
    minWidth?: string;
    maxWidth?: string;
  };
  gap?: string;
}

export function ResponsiveGrid({
  children,
  className = "",
  gridItemProps = {
    minWidth: "1fr",
    maxWidth: "1fr",
  },
  gap = "var(--mantine-spacing-lg)",
}: ResponsiveGridProps) {
  const { minWidth, maxWidth } = gridItemProps;

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
