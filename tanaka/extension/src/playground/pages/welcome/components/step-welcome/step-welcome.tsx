import "./step-welcome.scss";

import { Button, Stack, Text, Title } from "@mantine/core";
import { RocketLaunchIcon } from "@phosphor-icons/react";

import { Icon } from "../../../../../components/icon";

interface StepWelcomeProps {
  onNext: () => void;
}

export function StepWelcome({ onNext }: StepWelcomeProps) {
  return (
    <Stack className="tnk-step-welcome" align="center">
      <Icon size="4xl" className="tnk-step-welcome__icon">
        <RocketLaunchIcon />
      </Icon>
      <Title order={1} className="tnk-step-welcome__title">
        Welcome to Tanaka
      </Title>
      <Text className="tnk-step-welcome__description">
        Keep your Firefox browsing entangled across every computer you use. Let's get you set up in just a few steps.
      </Text>
      <Button size="lg" onClick={onNext} className="tnk-step-welcome__button">
        Get Started
      </Button>
    </Stack>
  );
}
