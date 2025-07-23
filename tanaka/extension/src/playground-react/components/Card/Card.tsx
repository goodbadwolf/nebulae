import { Anchor, Text } from "@mantine/core";
import type { ReactNode } from "react";

import styles from "./card.module.scss";

interface CardProps {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}

export function Card({ href, icon, title, description }: CardProps) {
  return (
    <Anchor href={href} className={styles.tnkPlaygroundCard} underline="never">
      <div className={styles.tnkPlaygroundCard__header}>
        <div className={styles.tnkPlaygroundCard__icon}>{icon}</div>
        <Text component="h3" className={styles.tnkPlaygroundCard__title} fw={600}>
          {title}
        </Text>
      </div>
      <Text component="p" className={styles.tnkPlaygroundCard__description}>
        {description}
      </Text>
    </Anchor>
  );
}
