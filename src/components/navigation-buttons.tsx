import React from "react";
import { Button } from "@heroui/button"; // Assuming Button component is available
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import type { NavigationButtonsProps } from "@/types";

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  setCurrentStep,
  totalPages,
}) => {
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < totalPages - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="flex justify-between w-full mt-8 mb-4">
      <Button
        onClick={handlePrevious}
        isDisabled={currentStep === 0}
        variant="flat"
        className="flex items-center gap-2"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Previous
      </Button>
      <Button
        onClick={handleNext}
        isDisabled={currentStep === totalPages - 1}
        color="primary" // Changed to primary color
        variant="solid" // Assuming solid variant for a primary button, adjust if needed
        className="flex items-center gap-2"
      >
        Next
        <ArrowRightIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default NavigationButtons;
