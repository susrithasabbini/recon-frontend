## Main Process Flow UI Implementation Plan - 2025-05-21

This plan outlines the steps to implement a horizontal stepper UI using `RowSteps` to navigate between existing application pages: Account Creation, File Upload, and Rules Mapping.

## Steps

| Done | #   | Action                               | Detail                                                                             |
| ---- | --- | ------------------------------------ | ---------------------------------------------------------------------------------- |
| [ ]  | 1   | Create RowSteps Component            | `src/components/RowSteps.tsx` - Using the code provided by the user.               |
| [ ]  | 2   | Create Main Process Flow Page        | `src/pages/MainProcessFlowPage.tsx` - Hosts `RowSteps` and renders existing pages. |
| [ ]  | 3   | Add Route for Main Process Flow Page | Update `src/routes.tsx` for `/process-flow`.                                       |
| [ ]  | 4   | Update Navbar (Optional)             | Add a link to `/process-flow` in `src/components/navbar.tsx`.                      |
| [ ]  | 5   | Update Memory Bank                   | Document new components and patterns in relevant Memory Bank files.                |

<!--
{
  "plan": [
    {
      "id": "1_create_rowsteps_component",
      "tool": "write_to_file",
      "args": {
        "path": "src/components/RowSteps.tsx",
        "content": "\"use client\";\n\nimport type {ComponentProps} from \"react\";\nimport type {ButtonProps} from \"@heroui/react\";\n\nimport React from \"react\";\nimport {useControlledState} from \"@react-stately/utils\";\nimport {m, LazyMotion, domAnimation} from \"framer-motion\";\nimport {cn} from \"@heroui/react\";\n\nexport type RowStepProps = {\n  title?: React.ReactNode;\n  className?: string;\n};\n\nexport interface RowStepsProps extends React.HTMLAttributes<HTMLButtonElement> {\n  steps?: RowStepProps[];\n  color?: ButtonProps[\"color\"];\n  currentStep?: number;\n  defaultStep?: number;\n  hideProgressBars?: boolean;\n  className?: string;\n  stepClassName?: string;\n  onStepChange?: (stepIndex: number) => void;\n}\n\nfunction CheckIcon(props: ComponentProps<\"svg\">) {\n  return (\n    <svg {...props} fill=\"none\" stroke=\"currentColor\" strokeWidth={2} viewBox=\"0 0 24 24\">\n      <m.path\n        animate={{pathLength: 1}}\n        d=\"M5 13l4 4L19 7\"\n        initial={{pathLength: 0}}\n        strokeLinecap=\"round\"\n        strokeLinejoin=\"round\"\n        transition={{\n          delay: 0.2,\n          type: \"tween\",\n          ease: \"easeOut\",\n          duration: 0.3,\n        }}\n      />\n    </svg>\n  );\n}\n\nconst RowSteps = React.forwardRef<HTMLButtonElement, RowStepsProps>(\n  (\n    {\n      color = \"primary\",\n      steps = [],\n      defaultStep = 0,\n      onStepChange,\n      currentStep: currentStepProp,\n      hideProgressBars = false,\n      stepClassName,\n      className,\n      ...props\n    },\n    ref,\n  ) => {\n    const [currentStep, setCurrentStep] = useControlledState(\n      currentStepProp,\n      defaultStep,\n      onStepChange,\n    );\n\n    const colors = React.useMemo(() => {\n      let userColor;\n      let fgColor;\n      const colorsVars = [\n        \"[--active-fg-color:var(--step-fg-color)]\",\n        \"[--active-border-color:var(--step-color)]\",\n        \"[--active-color:var(--step-color)]\",\n        \"[--complete-background-color:var(--step-color)]\",\n        \"[--complete-border-color:var(--step-color)]\",\n        \"[--inactive-border-color:hsl(var(--heroui-default-300))]\",\n        \"[--inactive-color:hsl(var(--heroui-default-300))]\",\n      ];\n      switch (color) {\n        case \"primary\": userColor = \"[--step-color:hsl(var(--heroui-primary))]\"; fgColor = \"[--step-fg-color:hsl(var(--heroui-primary-foreground))]\"; break;\n        case \"secondary\": userColor = \"[--step-color:hsl(var(--heroui-secondary))]\"; fgColor = \"[--step-fg-color:hsl(var(--heroui-secondary-foreground))]\"; break;\n        case \"success\": userColor = \"[--step-color:hsl(var(--heroui-success))]\"; fgColor = \"[--step-fg-color:hsl(var(--heroui-success-foreground))]\"; break;\n        case \"warning\": userColor = \"[--step-color:hsl(var(--heroui-warning))]\"; fgColor = \"[--step-fg-color:hsl(var(--heroui-warning-foreground))]\"; break;\n        case \"danger\": userColor = \"[--step-color:hsl(var(--heroui-error))]\"; fgColor = \"[--step-fg-color:hsl(var(--heroui-error-foreground))]\"; break;\n        case \"default\": userColor = \"[--step-color:hsl(var(--heroui-default))]\"; fgColor = \"[--step-fg-color:hsl(var(--heroui-default-foreground))]\"; break;\n        default: userColor = \"[--step-color:hsl(var(--heroui-primary))]\"; fgColor = \"[--step-fg-color:hsl(var(--heroui-primary-foreground))]\"; break;\n      }\n      if (!className?.includes(\"--step-fg-color\")) colorsVars.unshift(fgColor);\n      if (!className?.includes(\"--step-color\")) colorsVars.unshift(userColor);\n      if (!className?.includes(\"--inactive-bar-color\")) colorsVars.push(\"[--inactive-bar-color:hsl(var(--heroui-default-300))]\");\n      return colorsVars;\n    }, [color, className]);\n\n    return (\n      <nav aria-label=\"Progress\" className=\"-my-4 max-w-fit overflow-x-auto py-4\">\n        <ol className={cn(\"flex flex-row flex-nowrap gap-x-3\", colors, className)}>\n          {steps?.map((step, stepIdx) => {\n            let status = currentStep === stepIdx ? \"active\" : currentStep < stepIdx ? \"inactive\" : \"complete\";\n            return (\n              <li key={stepIdx} className=\"relative flex w-full items-center pr-12\">\n                <button\n                  key={stepIdx}\n                  ref={ref}\n                  aria-current={status === \"active\" ? \"step\" : undefined}\n                  className={cn(\"group flex w-full cursor-pointer flex-row items-center justify-center gap-x-3 rounded-large py-2.5\", stepClassName)}\n                  onClick={() => setCurrentStep(stepIdx)}\n                  {...props}\n                >\n                  <div className=\"h-ful relative flex items-center\">\n                    <LazyMotion features={domAnimation}>\n                      <m.div animate={status} className=\"relative\">\n                        <m.div\n                          className={cn(\"relative flex h-[34px] w-[34px] items-center justify-center rounded-full border-medium text-large font-semibold text-default-foreground\", { \"shadow-lg\": status === \"complete\" })}\n                          initial={false}\n                          transition={{duration: 0.25}}\n                          variants={{\n                            inactive: { backgroundColor: \"transparent\", borderColor: \"var(--inactive-border-color)\", color: \"var(--inactive-color)\" },\n                            active: { backgroundColor: \"transparent\", borderColor: \"var(--active-border-color)\", color: \"var(--active-color)\" },\n                            complete: { backgroundColor: \"var(--complete-background-color)\", borderColor: \"var(--complete-border-color)\" },\n                          }}\n                        >\n                          <div className=\"flex items-center justify-center\">\n                            {status === \"complete\" ? <CheckIcon className=\"h-6 w-6 text-[var(--active-fg-color)]\" /> : <span>{stepIdx + 1}</span>}\n                          </div>\n                        </m.div>\n                      </m.div>\n                    </LazyMotion>\n                  </div>\n                  <div className=\"max-w-full flex-1 text-start\">\n                    <div className={cn(\"text-small font-medium text-default-foreground transition-[color,opacity] duration-300 group-active:opacity-80 lg:text-medium\", { \"text-default-500\": status === \"inactive\" })}>\n                      {step.title}\n                    </div>\n                  </div>\n                  {stepIdx < steps.length - 1 && !hideProgressBars && (\n                    <div aria-hidden=\"true\" className=\"pointer-events-none absolute right-0 w-10 flex-none items-center\" style={{ \"--idx\": stepIdx } as React.CSSProperties}>\n                      <div className={cn(\"relative h-0.5 w-full bg-[var(--inactive-bar-color)] transition-colors duration-300\", \"after:absolute after:block after:h-full after:w-0 after:bg-[var(--active-border-color)] after:transition-[width] after:duration-300 after:content-['']\", { \"after:w-full\": stepIdx < currentStep })} />\n                    </div>\n                  )}\n                </button>\n              </li>\n            );\n          })}\n        </ol>\n      </nav>\n    );\n  }\n);\n\nRowSteps.displayName = \"RowSteps\";\nexport default RowSteps;\n"
      },
      "description": "Create the RowSteps.tsx component using the code provided by the user.",
      "success": "File src/components/RowSteps.tsx created.",
      "status": "pending"
    },
    {
      "id": "2_create_main_process_flow_page",
      "tool": "write_to_file",
      "args": {
        "path": "src/pages/MainProcessFlowPage.tsx",
        "content": "import React, { useState } from 'react';\nimport RowSteps from '@/components/RowSteps';\nimport AccountCreationPage from './account-creation';\nimport FileUploadPage from './file-upload';\nimport RulesMappingPage from './rules-mapping';\nimport DefaultLayout from '@/layouts/default'; // Assuming DefaultLayout is used\n\nconst pageSteps = [\n  { title: 'Account Creation' },\n  { title: 'File Upload' },\n  { title: 'Rules Mapping' },\n];\n\nconst stepContentComponents = [\n  <AccountCreationPage key=\"account-creation\" />,\n  <FileUploadPage key=\"file-upload\" />,\n  <RulesMappingPage key=\"rules-mapping\" />,\n];\n\nconst MainProcessFlowPage: React.FC = () => {\n  const [currentStep, setCurrentStep] = useState(0);\n\n  // Note: The RowSteps component handles its own currentStep via onStepChange.\n  // If we want the parent to control it for Next/Prev buttons, \n  // we'd pass currentStep and onStepChange to RowSteps.\n\n  const handleNext = () => {\n    setCurrentStep((prev) => Math.min(prev + 1, pageSteps.length - 1));\n  };\n\n  const handlePrevious = () => {\n    setCurrentStep((prev) => Math.max(prev - 1, 0));\n  };\n\n  return (\n    <DefaultLayout>\n      <div className=\"container mx-auto p-4 flex flex-col items-center gap-8\">\n        <div className=\"w-full flex justify-center my-4\">\n          <RowSteps \n              steps={pageSteps} \n              currentStep={currentStep} \n              onStepChange={setCurrentStep} \n          />\n        </div>\n        <div className=\"w-full\">\n          {/* Render the component for the current step */}\n          {stepContentComponents[currentStep]}\n        </div>\n        {/* Optional: Global Next/Previous buttons if not relying solely on RowSteps clicks */}\n        {/* <div className=\"mt-8 flex justify-between w-full max-w-3xl\">\n          <button \n            onClick={handlePrevious} \n            disabled={currentStep === 0}\n            className=\"px-6 py-2 bg-gray-300 rounded disabled:opacity-50 text-gray-700\"\n          >\n            Previous Page\n          </button>\n          <button \n            onClick={handleNext} \n            disabled={currentStep === pageSteps.length - 1}\n            className=\"px-6 py-2 bg-indigo-600 text-white rounded disabled:opacity-50\"\n          >\n            Next Page\n          </button>\n        </div> */}\n      </div>\n    </DefaultLayout>\n  );\n};\n\nexport default MainProcessFlowPage;\n"
      },
      "description": "Create MainProcessFlowPage.tsx to host RowSteps and render existing pages.",
      "success": "File src/pages/MainProcessFlowPage.tsx created.",
      "status": "pending"
    },
    {
      "id": "3_read_routes",
      "tool": "read_file",
      "args": {"path": "src/routes.tsx"},
      "description": "Read current routes to prepare for modification.",
      "success": "Read content of src/routes.tsx.",
      "status": "pending"
    },
    {
      "id": "3.1_add_route_for_main_flow",
      "tool": "replace_in_file",
      "args": {
        "path": "src/routes.tsx",
        "diff": "" // Placeholder, will be filled after reading routes.tsx
      },
      "description": "Add new route for MainProcessFlowPage.",
      "success": "Route for /process-flow added to src/routes.tsx.",
      "status": "pending",
      "depends_on": "3_read_routes"
    },
    {
      "id": "4_read_navbar",
      "tool": "read_file",
      "args": {"path": "src/components/navbar.tsx"},
      "description": "Read current navbar to prepare for modification.",
      "success": "Read content of src/components/navbar.tsx.",
      "status": "pending"
    },
    {
      "id": "4.1_update_navbar_for_main_flow",
      "tool": "replace_in_file",
      "args": {
        "path": "src/components/navbar.tsx",
        "diff": "" // Placeholder, will be filled after reading navbar.tsx
      },
      "description": "Add a link for /process-flow to navbar.tsx.",
      "success": "Navbar link for /process-flow added.",
      "status": "pending",
      "depends_on": "4_read_navbar"
    },
    {
      "id": "5_update_active_context",
      "tool": "write_to_file",
      "args": {
        "path": "memory-bank/activeContext.md",
        "content": "# Active Context\n\n## Current Focus\nImplementing a new main process flow UI. This involves using the `RowSteps` component to navigate between existing pages: Account Creation, File Upload, and Rules Mapping. A new plan `memory-bank/plans/2025-05-21-main-process-flow-plan.md` has been created.\n\n## Key Decisions Made Recently\n- Switched from implementing a stepper for `recon.md` content to a stepper for existing pages (`AccountCreationPage`, `FileUploadPage`, `RulesMappingPage`).\n- Will use the user-provided `RowSteps` (horizontal stepper) component.\n- A new `MainProcessFlowPage.tsx` will host the stepper and render the selected existing page.\n\n## Next Steps (Immediate)\n- Proceed with ACT MODE implementation as per `memory-bank/plans/2025-05-21-main-process-flow-plan.md`.\n  1. Create `src/components/RowSteps.tsx`.\n  2. Create `src/pages/MainProcessFlowPage.tsx`.\n  3. Update `src/routes.tsx`.\n  4. Update `src/components/navbar.tsx` (optional link).\n  5. Update Memory Bank after implementation."
      },
      "description": "Update activeContext.md with the current implementation status.",
      "success": "activeContext.md updated.",
      "status": "pending"
    },
    {
      "id": "5.1_update_progress",
      "tool": "write_to_file",
      "args": {
        "path": "memory-bank/progress.md",
        "content": "" // Placeholder, will be filled after reading progress.md
      },
      "description": "Update progress.md to reflect the new task. This should append to existing progress.",
      "success": "progress.md updated.",
      "status": "pending"
    }
  ]
}
-->
