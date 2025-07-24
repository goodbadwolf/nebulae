import "./page-shell.scss";

import { applyDefaults, type DeepPartial, type WithDefaults } from "@kiku/core";
import { AppShell, Group, Title } from "@mantine/core";
import type { ReactNode } from "react";

import { AppLogo } from "../app-logo";

type PageShellPropsBase = {
  children?: ReactNode;
  header?: {
    brand?: string;
    logo?: {
      size?: "small" | "medium" | "large";
      icon?: ReactNode;
    };
    align?: "left" | "center" | "right";
  };
};

const defaultProps = {
  header: {
    brand: "Tanaka",
    logo: { size: "medium" },
    align: "center",
  },
} as const;

export type PageShellProps = WithDefaults<PageShellPropsBase, typeof defaultProps>;

export function PageShell(props: DeepPartial<PageShellProps> = {}) {
  const {
    children,
    header: {
      brand,
      logo: { size: logoSize, icon: logoIcon },
      align,
    },
  } = applyDefaults(defaultProps, props);

  const logoElement = logoIcon ?? <AppLogo size={logoSize} />;

  return (
    <AppShell className="tnk-page-shell">
      <AppShell.Header className="tnk-page-shell__header">
        <Group className="tnk-page-shell__brand" justify={align}>
          {logoElement}
          <Title order={1} className="tnk-page-shell__brand-text">
            {brand}
          </Title>
        </Group>
      </AppShell.Header>

      <AppShell.Main className="tnk-page-shell__main">{children}</AppShell.Main>
    </AppShell>
  );
}
