import "./card.scss";

import { applyDefaults, type DeepPartial, type WithDefaults } from "@kiku/core";
import { Text } from "@mantine/core";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type CardPropsBase = {
  href?: string;
  icon?: ReactNode;
  title?: string;
  description?: string;
};

const defaultProps = {
  href: "#",
  icon: null,
  title: "",
  description: "",
} as const;

export type CardProps = WithDefaults<CardPropsBase, typeof defaultProps>;

export function Card(props: DeepPartial<CardProps> = {}) {
  const { href, icon, title, description } = applyDefaults(defaultProps, props);

  return (
    <Link to={href} className="tnk-playground-card">
      <div className="tnk-playground-card__header">
        {icon && <div className="tnk-playground-card__icon">{icon}</div>}
        <Text component="h3" className="tnk-playground-card__title" fw={600}>
          {title}
        </Text>
      </div>
      <Text component="p" className="tnk-playground-card__description">
        {description}
      </Text>
    </Link>
  );
}
