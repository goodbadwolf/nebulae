import "./step-device-name.scss";

import { Button, Group, Stack, Text, TextInput, Title } from "@mantine/core";
import { Desktop, DeviceMobile, Laptop } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

interface StepDeviceNameProps {
  deviceName: string;
  onChange: (deviceName: string) => void;
  onNext: () => void;
  onBack: () => void;
}

function suggestDeviceName(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();

  if (userAgent.includes("mobile") || userAgent.includes("android")) {
    return "My Phone";
  } else if (platform.includes("mac")) {
    return "My Mac";
  } else if (platform.includes("win")) {
    return "My PC";
  } else if (platform.includes("linux")) {
    return "My Linux Box";
  } else {
    return "My Computer";
  }
}

export function StepDeviceName({ deviceName, onChange, onNext, onBack }: StepDeviceNameProps) {
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!deviceName) {
      onChange(suggestDeviceName());
    }
  }, [deviceName, onChange]);

  const handleChange = (value: string) => {
    onChange(value);
    setTouched(true);

    if (!value.trim()) {
      setError("Device name is required");
    } else if (value.length > 50) {
      setError("Device name must be 50 characters or less");
    } else {
      setError("");
    }
  };

  const handleNext = () => {
    if (!deviceName.trim()) {
      setError("Device name is required");
      setTouched(true);
    } else if (!error) {
      onNext();
    }
  };

  const getDeviceIcon = () => {
    const name = deviceName.toLowerCase();
    if (name.includes("phone") || name.includes("mobile")) {
      return <DeviceMobile />;
    } else if (name.includes("laptop") || name.includes("mac")) {
      return <Laptop />;
    } else {
      return <Desktop />;
    }
  };

  return (
    <Stack className="tnk-step-device-name">
      <div>
        <Title order={2} className="tnk-step-device-name__title">
          Name This Device
        </Title>
        <Text className="tnk-step-device-name__description">
          Choose a name to identify this device in your synced tabs
        </Text>
      </div>

      <div className="tnk-step-device-name__preview">
        <div className="tnk-step-device-name__preview-icon">{getDeviceIcon()}</div>
        <Text className="tnk-step-device-name__preview-text">{deviceName || "Device Name"}</Text>
      </div>

      <TextInput
        label="Device Name"
        placeholder="e.g., My Laptop"
        value={deviceName}
        onChange={(e) => handleChange(e.target.value)}
        error={touched && error}
        size="md"
      />

      <Group justify="space-between" className="tnk-step-device-name__actions">
        <Button variant="subtle" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!!error || !deviceName.trim()}>
          Next
        </Button>
      </Group>
    </Stack>
  );
}
