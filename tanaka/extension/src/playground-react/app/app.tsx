import "../styles/globals.scss";
import "./app.scss";

import { MantineProvider, SimpleGrid, Stack, Title } from "@mantine/core";
import { AppWindowIcon, GearIcon, KanbanIcon, RocketLaunchIcon } from "@phosphor-icons/react";

import { Card } from "../components/card";
import { Icon } from "../components/icon";
import { PageShell } from "../components/page-shell";

const ExtensionPages = () => {
  const playgroundPages = [
    {
      href: "welcome",
      icon: <RocketLaunchIcon />,
      title: "Welcome Page",
      description: "First-run setup experience with step-by-step guidance for device and server configuration.",
    },
    {
      href: "settings",
      icon: <GearIcon />,
      title: "Settings Page",
      description: "Extension configuration including server connection, device naming, and sync preferences.",
    },
    {
      href: "popup",
      icon: <AppWindowIcon />,
      title: "Popup Interface",
      description: "Main extension popup with workspace management, search functionality, and real-time sync status.",
    },
    {
      href: "manager",
      icon: <KanbanIcon />,
      title: "Manager Tab",
      description: "Full workspace manager with detailed tab lists, recently closed items, and device management.",
    },
  ];

  return (
    <Stack className="tnk-extension-pages-section">
      <Title order={2} className="tnk-extension-pages-section__title">
        Extension Pages
      </Title>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="xl" className="tnk-extension-pages-section__grid">
        {playgroundPages.map((page) => (
          <Card
            key={page.href}
            href={page.href}
            icon={<Icon size="3xl">{page.icon}</Icon>}
            title={page.title}
            description={page.description}
          />
        ))}
      </SimpleGrid>
    </Stack>
  );
};

export function PlaygroundApp() {
  return (
    <MantineProvider>
      <PageShell header={{ brand: "Tanaka Playground" }}>
        <Stack>
          <ExtensionPages />
        </Stack>
      </PageShell>
    </MantineProvider>
  );
}
