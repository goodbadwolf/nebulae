import "../../styles/globals.scss";
import "./home.scss";

import { MantineProvider, Stack, Title } from "@mantine/core";
import { AppWindowIcon, GearIcon, KanbanIcon, RocketLaunchIcon } from "@phosphor-icons/react";

import { Card } from "../../components/card";
import { Icon } from "../../components/icon";
import { PageShell } from "../../components/page-shell";
import { ResponsiveGrid } from "../../components/responsive-grid";

const ExtensionPages = () => {
  return (
    <Stack className="tnk-extension-pages-section">
      <Title order={2} className="tnk-extension-pages-section__title">
        Extension Pages
      </Title>
      <ResponsiveGrid gridItemProps={{ minWidth: "var(--tnk-space-16xl)", maxWidth: "var(--tnk-space-21xl)" }}>
        <Card
          href="welcome"
          icon={
            <Icon size="3xl" weight="duotone">
              <RocketLaunchIcon />
            </Icon>
          }
          title="Welcome Page"
          description="First-run setup experience with step-by-step guidance for device and server configuration."
        />
        <Card
          href="settings"
          icon={
            <Icon size="3xl" weight="duotone">
              <GearIcon />
            </Icon>
          }
          title="Settings Page"
          description="Extension configuration including server connection, device naming, and sync preferences."
        />
        <Card
          href="popup"
          icon={
            <Icon size="3xl" weight="duotone">
              <AppWindowIcon />
            </Icon>
          }
          title="Popup Interface"
          description="Main extension popup with workspace management, search functionality, and real-time sync status."
        />
        <Card
          href="manager"
          icon={
            <Icon size="3xl" weight="duotone">
              <KanbanIcon />
            </Icon>
          }
          title="Manager Tab"
          description="Full workspace manager with detailed tab lists, recently closed items, and device management."
        />
      </ResponsiveGrid>
    </Stack>
  );
};

export function HomePage() {
  return (
    <MantineProvider>
      <PageShell header={{ brand: "Tanaka Playground" }}>
        <Stack className="tnk-playground-sections-container">
          <ExtensionPages />
        </Stack>
      </PageShell>
    </MantineProvider>
  );
}
