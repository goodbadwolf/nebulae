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
  const isClickable = Boolean(href || onClick);

  const cardContent = (
    <MantineCard
      className="tnk-card"
      shadow="sm"
      padding="xl"
      radius="lg"
      withBorder
      component={isClickable ? "div" : "article"}
      style={{ cursor: isClickable ? "pointer" : "default" }}
    >
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
    </MantineCard>
  );

  if (href) {
    return (
      <Link to={href} className="tnk-card__link">
        {cardContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="tnk-card__button">
        {cardContent}
      </button>
    );
  }

  return cardContent;
}
