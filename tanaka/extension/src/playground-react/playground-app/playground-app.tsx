import "../styles/globals.scss";

import { Button, MantineProvider, Text, Title } from "@mantine/core";
import { RocketLaunchIcon } from "@phosphor-icons/react";

import styles from "./playground-app.module.scss";

export function PlaygroundApp() {
  return (
    <MantineProvider>
      <div className={styles.tnkPlaygroundApp}>
        <div className={styles.tnkPlaygroundContainer}>
          <div className={styles.tnkPlaygroundContainer__content}>
            <RocketLaunchIcon weight="duotone" className={styles.tnkPlaygroundContainer__icon} />
            <Title order={1} className={styles.tnkPlaygroundContainer__title}>
              Tanaka React Playground
            </Title>
            <Text className={styles.tnkPlaygroundContainer__subtitle}>React + Mantine migration in progress...</Text>
            <Button
              size="lg"
              className={`${styles.tnkPlaygroundContainer__button} ${styles["tnkPlaygroundContainer__button--primary"]}`}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </MantineProvider>
  );
}
