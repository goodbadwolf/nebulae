import "./app-logo.scss";

import { Box } from "@mantine/core";

export interface AppLogoProps {
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { w: 48, h: 48, fz: 24 },
  md: { w: 60, h: 60, fz: 28 },
  lg: { w: 72, h: 72, fz: 36 },
} as const;

export function AppLogo({ size = "md" }: AppLogoProps = {}) {
  const dimensions = sizeMap[size];

  return (
    <Box
      component="span"
      display="inline-flex"
      w={dimensions.w}
      h={dimensions.h}
      fz={dimensions.fz}
      fw="bold"
      c="white"
      className="tnk-app-logo"
    >
      T
    </Box>
  );
}
