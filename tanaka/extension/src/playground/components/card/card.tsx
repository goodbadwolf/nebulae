import "./card.scss";

import { applyDefaults, type DeepPartial, type WithDefaults } from "@kiku/core";
import { Card as MantineCard, Group, Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type CardPropsBase = {
  href?: string;
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  onClick?: () => void;
};

const defaultProps = {
  href: undefined,
  icon: null,
  title: "",
  subtitle: "",
  description: "",
  onClick: undefined,
} as const;

export type CardProps = WithDefaults<CardPropsBase, typeof defaultProps>;

export function Card(props: DeepPartial<CardProps> = {}) {
  const { href, icon, title, subtitle, description, onClick } = applyDefaults(defaultProps, props);

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
        <Stack gap="xs" style={{ flex: 1 }}>
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

  // If href is provided, wrap in Link
  if (href) {
    return (
      <Link to={href} className="tnk-card__link">
        {cardContent}
      </Link>
    );
  }

  // If onClick is provided, wrap in button
  if (onClick) {
    return (
      <button onClick={onClick} className="tnk-card__button">
        {cardContent}
      </button>
    );
  }

  // Otherwise, return just the card
  return cardContent;
}
