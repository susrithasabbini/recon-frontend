export interface ColorTheme {
  name: string;
  colors: {
    primary: string;
    primaryFocus?: string; // Optional: for focus states, can be a slightly darker/lighter shade
    primaryContent: string; // Text color on primary background
  };
}

export const themes: ColorTheme[] = [
  {
    name: "blue",
    colors: {
      primary: "#3b82f6", // Tailwind blue-500
      primaryFocus: "#2563eb", // Tailwind blue-600
      primaryContent: "#ffffff",
    },
  },
  {
    name: "red",
    colors: {
      primary: "#ef4444", // Tailwind red-500
      primaryFocus: "#dc2626", // Tailwind red-600
      primaryContent: "#ffffff",
    },
  },
  {
    name: "pink",
    colors: {
      primary: "#ec4899", // Tailwind pink-500
      primaryFocus: "#db2777", // Tailwind pink-600
      primaryContent: "#ffffff",
    },
  },
  {
    name: "yellow",
    colors: {
      primary: "#eab308", // Tailwind yellow-500
      primaryFocus: "#ca8a04", // Tailwind yellow-600
      primaryContent: "#1f2937", // Tailwind gray-800 (darker text for yellow)
    },
  },
  {
    name: "orange",
    colors: {
      primary: "#f97316", // Tailwind orange-500
      primaryFocus: "#ea580c", // Tailwind orange-600
      primaryContent: "#ffffff",
    },
  },
  {
    name: "violet",
    colors: {
      primary: "#8b5cf6", // Tailwind violet-500
      primaryFocus: "#7c3aed", // Tailwind violet-600
      primaryContent: "#ffffff",
    },
  },
  {
    name: "purple",
    colors: {
      primary: "#a855f7", // Tailwind purple-500
      primaryFocus: "#9333ea", // Tailwind purple-600
      primaryContent: "#ffffff",
    },
  },
  {
    name: "green",
    colors: {
      primary: "#22c55e", // Tailwind green-500
      primaryFocus: "#16a34a", // Tailwind green-600
      primaryContent: "#ffffff",
    },
  },
];

export const defaultThemeName = "blue";

export const defaultTheme =
  themes.find((theme) => theme.name === defaultThemeName) || themes[0];
