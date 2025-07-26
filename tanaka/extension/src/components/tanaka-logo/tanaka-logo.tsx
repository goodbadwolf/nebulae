import "./tanaka-logo.scss";

import { Avatar, type MantineSize } from "@mantine/core";

export interface TanakaLogoProps {
  size?: MantineSize;
}

export function TanakaLogo({ size = "lg" }: TanakaLogoProps = {}) {
  return (
    <Avatar
      size={size}
      radius="md"
      variant="gradient"
      gradient={{ from: "indigo", to: "violet", deg: 135 }}
      className="tnk-logo"
    >
      <span className="tnk-logo__initial">T</span>
    </Avatar>
  );
}
