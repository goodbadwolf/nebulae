import "./action-card.scss";

import { Card, type CardProps, Group, Stack, Text } from "@mantine/core";
import clsx from "clsx";
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

const sharedCardProps: Partial<CardProps> = {
  shadow: "sm",
  padding: "xl",
  radius: "lg",
  withBorder: true,
};

export function ActionCard({ href, icon, title, subtitle, description, onClick }: ActionCardProps) {
  const content = <ActionCardContent icon={icon} title={title} subtitle={subtitle} description={description} />;

  if (href) {
    return (
      <Card
        {...sharedCardProps}
        component={Link}
        to={href}
        className={clsx("tnk-action-card", "tnk-action-card--link")}
      >
        {content}
      </Card>
    );
  }

  if (onClick) {
    return (
      <Card
        {...sharedCardProps}
        component="button"
        onClick={onClick}
        className={clsx("tnk-action-card", "tnk-action-card--button")}
      >
        {content}
      </Card>
    );
  }

  return (
    <Card {...sharedCardProps} className={clsx("tnk-action-card")}>
      {content}
    </Card>
  );
}

interface ActionCardContentProps {
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
}

function ActionCardContent({ icon, title, subtitle, description }: ActionCardContentProps) {
  const hasTextContent = title || subtitle || description;

  if (!icon && !hasTextContent) {
    return null;
  }

  return (
    <Group gap="lg" align="flex-start">
      {icon && <div className={clsx("tnk-action-card__icon")}>{icon}</div>}
      {hasTextContent && (
        <Stack gap="xs" flex={1}>
          {(title || subtitle) && (
            <div>
              {title && (
                <Text component="h3" size="lg" fw={600} className={clsx("tnk-action-card__title")}>
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text component="span" size="sm" c="dimmed" className={clsx("tnk-action-card__subtitle")}>
                  {subtitle}
                </Text>
              )}
            </div>
          )}
          {description && (
            <Text component="p" size="sm" c="dimmed" className={clsx("tnk-action-card__description")}>
              {description}
            </Text>
          )}
        </Stack>
      )}
    </Group>
  );
}
