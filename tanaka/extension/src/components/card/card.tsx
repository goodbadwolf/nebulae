import "./card.scss";

import { Card as MantineCard, Group, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface CardProps {
  href?: string;
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  onClick?: () => void;
}

export function Card({ href, icon, title = "", subtitle = "", description = "", onClick }: CardProps = {}) {
  // Use Mantine's polymorphic component feature
  if (href) {
    return (
      <MantineCard
        component={Link}
        to={href}
        className="tnk-card tnk-card__link"
        shadow="sm"
        padding="xl"
        radius="lg"
        withBorder
      >
        <CardContent icon={icon} title={title} subtitle={subtitle} description={description} />
      </MantineCard>
    );
  }

  if (onClick) {
    return (
      <MantineCard
        component="button"
        onClick={onClick}
        className="tnk-card tnk-card__button"
        shadow="sm"
        padding="xl"
        radius="lg"
        withBorder
      >
        <CardContent icon={icon} title={title} subtitle={subtitle} description={description} />
      </MantineCard>
    );
  }

  return (
    <MantineCard className="tnk-card" shadow="sm" padding="xl" radius="lg" withBorder>
      <CardContent icon={icon} title={title} subtitle={subtitle} description={description} />
    </MantineCard>
  );
}

// Extract the content to avoid duplication
function CardContent({ icon, title, subtitle, description }: Omit<CardProps, "href" | "onClick">) {
  return (
    <Group gap="lg" align="flex-start">
      {icon && <div className="tnk-card__icon">{icon}</div>}
      <Stack gap="xs" flex={1}>
        <div>
          <Text component="h3" size="lg" fw={600} className="tnk-card__title">
            {title}
          </Text>
          {subtitle && (
            <Text component="span" size="sm" c="dimmed" className="tnk-card__subtitle">
              {subtitle}
            </Text>
          )}
        </div>
        {description && (
          <Text component="p" size="sm" c="dimmed" className="tnk-card__description">
            {description}
          </Text>
        )}
      </Stack>
    </Group>
  );
}
