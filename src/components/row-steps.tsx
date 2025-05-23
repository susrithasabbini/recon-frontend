"use client";

import type { ComponentProps } from "react";

import React from "react";
import { useControlledState } from "@react-stately/utils";
import { m, LazyMotion, domAnimation } from "framer-motion";
import clsx from "clsx";

// Helper for cn, assuming similar usage to other components in the project
const cn = clsx;
import type { RowStepsProps } from "@/types";

function CheckIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <m.path
        animate={{ pathLength: 1 }}
        d="M5 13l4 4L19 7"
        initial={{ pathLength: 0 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        transition={{
          delay: 0.2,
          type: "tween",
          ease: "easeOut",
          duration: 0.3,
        }}
      />
    </svg>
  );
}

const RowSteps = React.forwardRef<HTMLButtonElement, RowStepsProps>(
  (
    {
      // color prop is no longer used directly for styling, theming handles it
      steps = [],
      defaultStep = 0,
      onStepChange,
      currentStep: currentStepProp,
      hideProgressBars = false,
      stepClassName,
      className,
      ...props
    },
    ref,
  ) => {
    const [currentStep, setCurrentStep] = useControlledState(
      currentStepProp,
      defaultStep,
      onStepChange,
    );

    // Removed the complex 'colors' useMemo hook. Styling will be done via Tailwind classes
    // that use CSS variables set by ColorThemeContext.

    return (
      <div className="flex items-center gap-x-4 w-2/3">
        <nav
          aria-label="Progress"
          className="flex flex-grow justify-center -my-4 overflow-x-auto py-4"
        >
          <ol
            className={cn(
              "flex flex-row flex-nowrap gap-x-12",
              className, // Removed 'colors' variable from here
            )}
          >
            {steps?.map((step, stepIdx) => {
              let status =
                currentStep === stepIdx
                  ? "active"
                  : currentStep < stepIdx
                    ? "inactive"
                    : "complete";
              const isLastStep = stepIdx === steps.length - 1;
              return (
                <li
                  key={stepIdx}
                  className={cn(
                    "relative flex items-center",
                    !isLastStep && "pr-12",
                  )}
                >
                  <button
                    key={stepIdx}
                    ref={ref}
                    aria-current={status === "active" ? "step" : undefined}
                    className={cn(
                      "group flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-large py-2.5",
                      stepClassName,
                    )}
                    onClick={() => setCurrentStep(stepIdx)}
                    {...props}
                  >
                    <div className="h-ful relative flex items-center">
                      <LazyMotion features={domAnimation}>
                        <m.div animate={status} className="relative">
                          <m.div
                            className={cn(
                              "relative flex h-[34px] w-[34px] items-center justify-center rounded-full border-medium text-large font-semibold text-default-foreground",
                              { "shadow-lg": status === "complete" },
                            )}
                            initial={false}
                            transition={{ duration: 0.25 }}
                            variants={{
                              inactive: {
                                // Use Tailwind classes with CSS variables
                                backgroundColor: "transparent",
                                borderColor: "hsl(var(--heroui-default-300))", // Keep inactive border standard
                                color: "hsl(var(--heroui-default-300))", // Keep inactive text standard
                              },
                              active: {
                                backgroundColor: "transparent",
                                borderColor: "rgb(var(--color-primary-rgb))",
                                color: "rgb(var(--color-primary-rgb))",
                              },
                              complete: {
                                backgroundColor:
                                  "rgb(var(--color-primary-rgb))",
                                borderColor: "rgb(var(--color-primary-rgb))",
                              },
                            }}
                          >
                            <div className="flex items-center justify-center">
                              {status === "complete" ? (
                                <CheckIcon className="h-6 w-6 text-primary-content" /> // Use themed text color
                              ) : (
                                <span>{stepIdx + 1}</span>
                              )}
                            </div>
                          </m.div>
                        </m.div>
                      </LazyMotion>
                    </div>
                    <div className="max-w-[120px] text-center">
                      <div
                        className={cn(
                          "text-small font-medium transition-[color,opacity] duration-300 group-active:opacity-80 lg:text-medium whitespace-nowrap",
                          status === "active"
                            ? "text-primary"
                            : "text-default-foreground", // Active text is primary, others default
                          { "text-default-500": status === "inactive" },
                        )}
                      >
                        {step.title}
                      </div>
                    </div>
                    {!isLastStep && !hideProgressBars && (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute right-[-4rem] top-[25px] w-32 flex-none items-center"
                        style={{ "--idx": stepIdx } as React.CSSProperties}
                      >
                        <div
                          className={cn(
                            "relative h-0.5 w-full bg-default-300 transition-colors duration-300", // Inactive bar color
                            "after:absolute after:block after:h-full after:w-0 after:bg-primary after:transition-[width] after:duration-300 after:content-['']", // Active bar uses bg-primary
                            { "after:w-full": stepIdx < currentStep },
                          )}
                        />
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    );
  },
);

RowSteps.displayName = "RowSteps";
export default RowSteps;
