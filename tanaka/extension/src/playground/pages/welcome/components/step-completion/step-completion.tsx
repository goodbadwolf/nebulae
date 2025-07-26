import "./step-completion.scss";

import { Button, Code, Stack, Text, Title } from "@mantine/core";
import { CheckCircle } from "@phosphor-icons/react";

import { Icon } from "../../../../../components/icon";
import type { WizardData } from "../welcome-wizard";

interface StepCompletionProps {
  data: WizardData;
  onComplete: () => void;
}

export function StepCompletion({ data, onComplete }: StepCompletionProps) {
  return (
    <Stack className="tnk-step-completion" align="center">
      <Icon icon={CheckCircle} size="4xl" weight="fill" className="tnk-step-completion__icon" />

      <Title order={1} className="tnk-step-completion__title">
        All Set!
      </Title>

      <Text className="tnk-step-completion__description">Tanaka is now configured and ready to sync your tabs</Text>

      <div className="tnk-step-completion__summary">
        <div className="tnk-step-completion__summary-item">
          <Text size="sm" className="tnk-step-completion__summary-label">
            Device Name
          </Text>
          <Code className="tnk-step-completion__summary-value">{data.deviceName}</Code>
        </div>

        <div className="tnk-step-completion__summary-item">
          <Text size="sm" className="tnk-step-completion__summary-label">
            Server
          </Text>
          <Code className="tnk-step-completion__summary-value">{data.serverUrl}</Code>
        </div>

        <div className="tnk-step-completion__summary-item">
          <Text size="sm" className="tnk-step-completion__summary-label">
            Auth Token
          </Text>
          <Code className="tnk-step-completion__summary-value">
            {data.authToken.slice(0, 8)}...{data.authToken.slice(-4)}
          </Code>
        </div>
      </div>

      <Button size="lg" onClick={onComplete} className="tnk-step-completion__button">
        Start Using Tanaka
      </Button>
    </Stack>
  );
}
