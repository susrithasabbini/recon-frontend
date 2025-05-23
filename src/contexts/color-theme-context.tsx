import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { themes, defaultTheme, ColorTheme } from "@/config/colorThemes";

interface ColorThemeContextType {
  theme: ColorTheme;
  setThemeByName: (themeName: string) => void;
  availableThemes: ColorTheme[];
}

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(
  undefined,
);

// Helper function to convert hex to RGB
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}` // Space separated
    : "0 0 0"; // Default to black if conversion fails
};

export const ColorThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(() => {
    if (typeof window !== "undefined") {
      const storedThemeName = localStorage.getItem("colorTheme");
      const foundTheme = themes.find(
        (t: ColorTheme) => t.name === storedThemeName,
      );
      return foundTheme || defaultTheme;
    }
    return defaultTheme;
  });

  const applyTheme = useCallback((themeToApply: ColorTheme) => {
    const root = document.documentElement;
    root.style.setProperty(
      "--color-primary-rgb",
      hexToRgb(themeToApply.colors.primary),
    );
    if (themeToApply.colors.primaryFocus) {
      root.style.setProperty(
        "--color-primary-focus-rgb",
        hexToRgb(themeToApply.colors.primaryFocus),
      );
    } else {
      // Fallback if primaryFocus is not defined (e.g., use primary color)
      root.style.setProperty(
        "--color-primary-focus-rgb",
        hexToRgb(themeToApply.colors.primary),
      );
    }
    root.style.setProperty(
      "--color-primary-content-rgb",
      hexToRgb(themeToApply.colors.primaryContent),
    );

    if (typeof window !== "undefined") {
      localStorage.setItem("colorTheme", themeToApply.name);
    }
  }, []);

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme, applyTheme]);

  const setThemeByName = (themeName: string) => {
    const newTheme = themes.find((t: ColorTheme) => t.name === themeName);
    if (newTheme) {
      setCurrentTheme(newTheme);
    }
  };

  return (
    <ColorThemeContext.Provider
      value={{ theme: currentTheme, setThemeByName, availableThemes: themes }}
    >
      {children}
    </ColorThemeContext.Provider>
  );
};

export const useColorTheme = () => {
  const context = useContext(ColorThemeContext);
  if (context === undefined) {
    throw new Error("useColorTheme must be used within a ColorThemeProvider");
  }
  return context;
};
