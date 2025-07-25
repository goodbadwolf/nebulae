import "./step-server-config.scss";

import { Button, Group, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { CheckCircle, Warning, WifiHigh } from "@phosphor-icons/react";
import { useState } from "react";

import { Icon } from "../../../../components/icon";
import type { WizardData } from "../welcome-wizard";

interface StepServerConfigProps {
  serverUrl: string;
  authToken: string;
  onChange: (updates: Partial<WizardData>) => void;
  onNext: () => void;
  onBack: () => void;
}

type TestStatus = "idle" | "testing" | "success" | "error";

export function StepServerConfig({ serverUrl, authToken, onChange, onNext, onBack }: StepServerConfigProps) {
  const [urlError, setUrlError] = useState("");
  const [tokenError, setTokenError] = useState("");
  const [testStatus, setTestStatus] = useState<TestStatus>("idle");
  const [testMessage, setTestMessage] = useState("");

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) {
      setUrlError("Server URL is required");
      return false;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setUrlError("URL must start with http:// or https://");
      return false;
    }

    try {
      new URL(url);
      setUrlError("");
      return true;
    } catch {
      setUrlError("Invalid URL format");
      return false;
    }
  };

  const validateToken = (token: string): boolean => {
    if (!token.trim()) {
      setTokenError("Auth token is required");
      return false;
    }

    if (token.length !== 32 || !/^[a-zA-Z0-9]+$/.test(token)) {
      setTokenError("Token must be exactly 32 alphanumeric characters");
      return false;
    }

    setTokenError("");
    return true;
  };

  const handleUrlChange = (value: string) => {
    onChange({ serverUrl: value });
    validateUrl(value);
  };

  const handleTokenChange = (value: string) => {
    onChange({ authToken: value });
    validateToken(value);
  };

  const handleTestConnection = async () => {
    if (!validateUrl(serverUrl) || !validateToken(authToken)) {
      return;
    }

    setTestStatus("testing");
    setTestMessage("Testing connection...");

    // Simulate connection test
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate success for demo
    const success = Math.random() > 0.2;

    if (success) {
      setTestStatus("success");
      setTestMessage("Connection successful!");
    } else {
      setTestStatus("error");
      setTestMessage("Failed to connect. Please check your settings.");
    }
  };

  const canProceed = !urlError && !tokenError && serverUrl && authToken && testStatus === "success";

  return (
    <Stack className="tnk-step-server-config">
      <div>
        <Title order={2} className="tnk-step-server-config__title">
          Connect to Server
        </Title>
        <Text className="tnk-step-server-config__description">Enter your Tanaka server details to start syncing</Text>
      </div>

      <TextInput
        label="Server URL"
        placeholder="https://tanaka.example.com"
        value={serverUrl}
        onChange={(e) => handleUrlChange(e.target.value)}
        error={urlError}
        size="md"
      />

      <PasswordInput
        label="Auth Token"
        placeholder="32 character token"
        value={authToken}
        onChange={(e) => handleTokenChange(e.target.value)}
        error={tokenError}
        size="md"
      />

      <div className="tnk-step-server-config__test-section">
        <Button
          onClick={handleTestConnection}
          loading={testStatus === "testing"}
          disabled={!!urlError || !!tokenError || !serverUrl || !authToken}
          leftSection={<WifiHigh size={20} />}
        >
          Test Connection
        </Button>

        {testStatus !== "idle" && (
          <div className={`tnk-step-server-config__test-result tnk-step-server-config__test-result--${testStatus}`}>
            <Icon size="md">{testStatus === "success" ? <CheckCircle /> : <Warning />}</Icon>
            <Text size="sm">{testMessage}</Text>
          </div>
        )}
      </div>

      <Group justify="space-between" className="tnk-step-server-config__actions">
        <Button variant="subtle" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed}>
          Next
        </Button>
      </Group>
    </Stack>
  );
}
