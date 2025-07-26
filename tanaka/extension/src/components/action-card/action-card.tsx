import "./action-card.scss";

import { Card as MantineCard, Group, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface ActionCardProps {
  href?: string;
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  onClick?: () => void;
}

export function ActionCard({ href, icon, title = "", subtitle = "", description = "", onClick }: ActionCardProps = {}) {
  // Use Mantine's polymorphic component feature
  if (href) {
    return (
      <MantineCard
        component={Link}
        to={href}
        className="tnk-action-card tnk-action-card--link"
        shadow="sm"
        padding="xl"
        radius="lg"
        withBorder
      >
        <ActionCardContent icon={icon} title={title} subtitle={subtitle} description={description} />
      </MantineCard>
    );
  }

  if (onClick) {
    return (
      <MantineCard
        component="button"
        onClick={onClick}
        className="tnk-action-card tnk-action-card--button"
        shadow="sm"
        padding="xl"
        radius="lg"
        withBorder
      >
        <ActionCardContent icon={icon} title={title} subtitle={subtitle} description={description} />
      </MantineCard>
    );
  }

  return (
    <MantineCard className="tnk-action-card" shadow="sm" padding="xl" radius="lg" withBorder>
      <ActionCardContent icon={icon} title={title} subtitle={subtitle} description={description} />
    </MantineCard>
  );
}

// Extract the content to avoid duplication
function ActionCardContent({ icon, title, subtitle, description }: Omit<ActionCardProps, "href" | "onClick">) {
  return (
    <Group gap="lg" align="flex-start">
      {icon && <div className="tnk-action-card__icon">{icon}</div>}
      <Stack gap="xs" flex={1}>
        <div>
          <Text component="h3" size="lg" fw={600} className="tnk-action-card__title">
            {title}
          </Text>
          {subtitle && (
            <Text component="span" size="sm" c="dimmed" className="tnk-action-card__subtitle">
              {subtitle}
            </Text>
          )}
        </div>
        {description && (
          <Text component="p" size="sm" c="dimmed" className="tnk-action-card__description">
            {description}
          </Text>
        )}
      </Stack>
    </Group>
  );
}
