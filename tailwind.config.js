import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary-rgb) / <alpha-value>)",
        "primary-focus": "rgb(var(--color-primary-focus-rgb) / <alpha-value>)",
        "primary-content":
          "rgb(var(--color-primary-content-rgb) / <alpha-value>)",
      },
    },
    ringColor: ({ theme }) => ({
      // Added ringColor configuration
      DEFAULT: theme("colors.primary"),
      primary: theme("colors.primary"),
    }),
  },
  darkMode: "class",
  plugins: [heroui()],
};
