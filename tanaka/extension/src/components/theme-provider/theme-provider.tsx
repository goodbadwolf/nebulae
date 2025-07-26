import { createTheme, MantineProvider } from "@mantine/core";
import React from "react";

const theme = createTheme({
  primaryColor: "indigo",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontFamilyMonospace: '"SF Mono", Monaco, "Cascadia Code", monospace',
  headings: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  fontSizes: {
    xs: "11px",
    sm: "12px",
    md: "14px",
    lg: "16px",
    xl: "18px",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
  },
  radius: {
    xs: "4px",
    sm: "6px",
    md: "8px",
    lg: "10px",
    xl: "12px",
  },
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      {children}
    </MantineProvider>
  );
}
