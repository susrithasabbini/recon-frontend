import React, { useState } from "react";
import RowSteps from "@/components/row-steps";
import AccountCreationPage from "./account-creation";
import RulesMappingPage from "./rules-mapping";
import DefaultLayout from "@/layouts/default";
import MerchantManagementPage from "./merchant-creation";
import NavigationButtons from "@/components/navigation-buttons";
import { PreviewPage } from "./preview-page";
import UploadPage from "./upload-page";
import ViewTransactionsPage from "@/pages/view-transactions-page"; // Import the new page

const pageSteps = [
  { title: "Merchant Creation" },
  { title: "Account Creation" },
  { title: "Rules Mapping" },
  { title: "File Upload" },
  { title: "Reconciliation" },
  { title: "View Transactions" }, // Added new step
];

// Array of components to render for each step
const stepContentComponents = [
  MerchantManagementPage,
  AccountCreationPage,
  RulesMappingPage,
  UploadPage,
  PreviewPage,
  ViewTransactionsPage, // Added new page component
];

const MainProcessFlowPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const CurrentStepComponent = stepContentComponents[currentStep];

  return (
    <DefaultLayout>
      <div className="mx-10 flex flex-col items-center gap-y-6">
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
