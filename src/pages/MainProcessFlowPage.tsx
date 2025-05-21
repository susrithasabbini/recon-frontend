import React, { useState } from "react";
import RowSteps from "@/components/RowSteps";
import AccountCreationPage from "./account-creation";
import FileUploadPage from "./file-upload";
import RulesMappingPage from "./rules-mapping";
import DefaultLayout from "@/layouts/default";
import MerchantManagementPage from "./merchant-creation";
import NavigationButtons from "@/components/NavigationButtons";

const pageSteps = [
  { title: "Merchant Creation" },
  { title: "Account Creation" },
  { title: "Rules Mapping" },
  { title: "File Upload" },
];

// Array of components to render for each step
const stepContentComponents = [
  MerchantManagementPage,
  AccountCreationPage,
  RulesMappingPage,
  FileUploadPage,
];

const MainProcessFlowPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const CurrentStepComponent = stepContentComponents[currentStep];

  return (
    <DefaultLayout>
      <div className="container mx-auto flex flex-col items-center gap-y-6">
        <div className="w-full flex justify-center">
          <RowSteps
            steps={pageSteps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
          />
        </div>
        <div className="w-full">
          <CurrentStepComponent />
        </div>
        <NavigationButtons
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          totalPages={pageSteps.length}
        />
      </div>
    </DefaultLayout>
  );
};

export default MainProcessFlowPage;
