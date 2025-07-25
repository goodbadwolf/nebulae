import "./page-shell.scss";

import { AppShell, Group, type MantineSize, Title } from "@mantine/core";
import type { ReactNode } from "react";

import { TanakaLogo } from "../tanaka-logo";

export interface PageShellProps {
  children?: ReactNode;
  header?: {
    brand?: string;
    logo?: {
      size?: MantineSize;
      icon?: ReactNode;
    };
    align?: "left" | "center" | "right";
  };
}

export function PageShell({ children, header = {} }: PageShellProps = {}) {
  const { brand = "Tanaka", logo = {}, align = "center" } = header;

  const { size: logoSize = "lg", icon: logoIcon } = logo;

  const logoElement = logoIcon ?? <TanakaLogo size={logoSize} />;

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
