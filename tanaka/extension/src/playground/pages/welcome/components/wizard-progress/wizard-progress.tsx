import { Progress } from "@mantine/core";

export interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function WizardProgress({ currentStep, totalSteps, className = "" }: WizardProgressProps) {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <Progress
      value={progressPercentage}
      size="xs"
      radius="xs"
      className={className}
      color="indigo"
      transitionDuration={300}
    />
  );
}
