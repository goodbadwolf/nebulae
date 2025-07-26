import "../../styles/globals.scss";

import { Container, MantineProvider, SimpleGrid, Stack, Title } from "@mantine/core";
import { AppWindowIcon, GearIcon, KanbanIcon, RocketLaunchIcon } from "@phosphor-icons/react";

import { ActionCard } from "../../../components/action-card";
import { Icon } from "../../../components/icon";
import { PageShell } from "../../../components/page-shell";

const ExtensionPages = () => {
  return (
    <Stack gap="xl">
      <Title order={2}>Extension Pages</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
        <ActionCard
          href="welcome"
          icon={
            <Icon size="3xl" weight="duotone">
              <RocketLaunchIcon />
            </Icon>
          }
          title="Welcome"
          subtitle="First-run setup"
          description="Step-by-step guidance for device and server configuration to get you started with Tanaka."
        />
        <ActionCard
          href="settings"
          icon={
            <Icon size="3xl" weight="duotone">
              <GearIcon />
            </Icon>
          }
          title="Settings"
          subtitle="Extension configuration"
          description="Configure server connection, device naming, sync preferences, and other extension options."
        />
        <ActionCard
          href="popup"
          icon={
            <Icon size="3xl" weight="duotone">
              <AppWindowIcon />
            </Icon>
          }
          title="Popup"
          subtitle="Extension popup"
          description="Workspace management, search functionality, and real-time sync status in a compact interface."
        />
        <ActionCard
          href="manager"
          icon={
            <Icon size="3xl" weight="duotone">
              <KanbanIcon />
            </Icon>
          }
          title="Manager"
          subtitle="Workspace manager"
          description="Detailed tab lists, recently closed items, device management, and advanced workspace controls."
        />
      </SimpleGrid>
    </Stack>
  );
};

export function HomePage() {
  return (
    <MantineProvider>
      <PageShell header={{ brand: "Tanaka Playground" }}>
        <Container size="xl" py="xl">
          <ExtensionPages />
        </Container>
      </PageShell>
    </MantineProvider>
  );
}
