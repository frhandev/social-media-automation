import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Media", "Platforms", "Content", "Review", "Publish"] as const;

export type WizardStep = 1 | 2 | 3;

type Props = {
  step: WizardStep;
  onStepChange: (step: WizardStep) => void;
};

export default function WizardStepper({ step, onStepChange }: Props) {
  return (
    <nav className="wizard-steps" aria-label="Create post steps">
      {STEPS.map((label, index) => {
        const number = index + 1;

        const isActive = number === step;
        const isComplete = number < step;
        const isAvailable = number <= step && number <= 3;

        return (
          <button
            key={label}
            type="button"
            disabled={!isAvailable}
            aria-current={isActive ? "step" : undefined}
            className={cn(
              "wizard-step",
              isActive && "active",
              isComplete && "complete",
              number > 3 && "opacity-40",
            )}
            onClick={() => {
              if (number === 1 || number === 2 || number === 3) {
                onStepChange(number);
              }
            }}
          >
            <span>{isComplete ? <Check size={15} /> : `0${number}`}</span>
            {label}
          </button>
        );
      })}
    </nav>
  );
}
