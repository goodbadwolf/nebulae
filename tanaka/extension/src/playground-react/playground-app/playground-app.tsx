import "../styles/globals.scss";

import { MantineProvider, SimpleGrid, Title } from "@mantine/core";
import { AppWindowIcon, GearIcon, KanbanIcon, RocketLaunchIcon } from "@phosphor-icons/react";

import { Card } from "../components/card";
import { Icon } from "../components/icon";
import { Logo } from "../components/logo";
import styles from "./playground-app.module.scss";

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

export function PlaygroundApp() {
  console.log(styles);
  return (
    <MantineProvider>
      <div className={styles.tnkPlaygroundContainer}>
        <div className={styles.tnkPlaygroundContainer__header}>
          <Logo size="large" />
          <Title order={1} className={styles.tnkPlaygroundContainer__title}>
            Tanaka Playground
          </Title>
        </div>

        <div className={styles.tnkPlaygroundPagesSection}>
          <Title order={2} className={styles.tnkPlaygroundPagesSection__title}>
            Extension Pages
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg" className={styles.tnkPlaygroundPagesGrid}>
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
        </div>
      </div>
    </MantineProvider>
  );
}
