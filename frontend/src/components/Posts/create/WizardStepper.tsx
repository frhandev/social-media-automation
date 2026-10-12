import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = ["Media", "Platforms", "Content", "Review", "Publish"] as const;

type WizardSteps = 1 | 2;

type WizardPropsType = {
  step: WizardSteps;
  onStepChange: (step: WizardSteps) => void;
};

function WizardStepper({ step, onStepChange }: WizardPropsType) {
  return (
    <nav className="wizard-steps" aria-label="Create post steps">
      {STEPS.map((label, index) => {
        const number = index + 1;
        const isActive = step === number;
        const isComplete = number < step;
        const isEnabeled = number <= step && number <= 2;

        return (
          <button
            key={label}
            type="button"
            disabled={!isEnabeled}
            aria-current={isActive ? "step" : undefined}
            className={cn(
              "wizard-step",
              isActive && "active",
              isComplete && "complete",
              number > 2 && "opacity-40",
            )}
            onClick={() => {
              if (number === 1 || number === 2) {
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

export default WizardStepper;
