import "./welcome-wizard.scss";

import { applyDefaults, type DeepPartial, type WithDefaults } from "@kiku/core";
import clsx from "clsx";
import { useState } from "react";

import { StepCompletion } from "../step-completion";
import { StepDeviceName } from "../step-device-name";
import { StepServerConfig } from "../step-server-config";
import { StepWelcome } from "../step-welcome";
import { WizardProgress } from "../wizard-progress";

export interface WizardData {
  deviceName: string;
  serverUrl: string;
  authToken: string;
}

type WelcomeWizardPropsBase = {
  onComplete?: (data: WizardData) => void;
  className?: string;
};

const defaultProps = {
  className: "",
} as const;

export type WelcomeWizardProps = WithDefaults<WelcomeWizardPropsBase, typeof defaultProps>;

const TOTAL_STEPS = 4;

export function WelcomeWizard(props: DeepPartial<WelcomeWizardProps> = {}) {
  const { onComplete, className } = applyDefaults(defaultProps, props);

  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    deviceName: "",
    serverUrl: "",
    authToken: "",
  });

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === TOTAL_STEPS && onComplete) {
      onComplete(wizardData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateData = (updates: Partial<WizardData>) => {
    setWizardData((prev) => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepWelcome onNext={handleNext} />;
      case 2:
        return (
          <StepDeviceName
            deviceName={wizardData.deviceName}
            onChange={(deviceName) => updateData({ deviceName })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <StepServerConfig
            serverUrl={wizardData.serverUrl}
            authToken={wizardData.authToken}
            onChange={(updates) => updateData(updates)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return <StepCompletion data={wizardData} onComplete={handleNext} />;
      default:
        return null;
    }
  };

  return (
    <div className={clsx("tnk-welcome-wizard", className)}>
      <WizardProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      <div className="tnk-welcome-wizard__content">{renderStep()}</div>
    </div>
  );
}
