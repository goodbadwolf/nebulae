import "./wizard-progress.scss";

import { applyDefaults, type DeepPartial, type WithDefaults } from "@kiku/core";
import clsx from "clsx";

type WizardProgressPropsBase = {
  currentStep: number;
  totalSteps: number;
  className?: string;
};

const defaultProps = {
  className: "",
} as const;

export type WizardProgressProps = WithDefaults<WizardProgressPropsBase, typeof defaultProps>;

export function WizardProgress(props: DeepPartial<WizardProgressProps>) {
  const { currentStep, totalSteps, className } = applyDefaults(defaultProps, props);

  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className={clsx("tnk-wizard-progress", className)}>
      <div className="tnk-wizard-progress__bar">
        <div className="tnk-wizard-progress__fill" style={{ width: `${progressPercentage}%` }} />
      </div>
    </div>
  );
}
