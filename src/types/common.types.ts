// Types for common UI elements and utilities
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface ThemeSwitchProps {
  className?: string;
  classNames?: import("@heroui/switch").SwitchProps["classNames"];
}

export interface NavigationButtonsProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalPages: number;
}

export type RowStepProps = {
  title?: React.ReactNode;
  className?: string;
};

export interface RowStepsProps extends React.HTMLAttributes<HTMLButtonElement> {
  steps?: RowStepProps[];
  color?: import("@heroui/button").ButtonProps["color"];
  currentStep?: number;
  defaultStep?: number;
  hideProgressBars?: boolean;
  className?: string;
  stepClassName?: string;
  onStepChange?: (stepIndex: number) => void;
}
