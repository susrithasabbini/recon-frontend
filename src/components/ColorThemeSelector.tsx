import React from "react";
import { Select, SelectItem } from "@heroui/select";
import { useColorTheme } from "@/contexts/ColorThemeContext";
import { SwatchIcon } from "@heroicons/react/24/outline";

export const ColorThemeSelector: React.FC = () => {
  const { theme, setThemeByName, availableThemes } = useColorTheme();

  const handleThemeChange = (keys: React.Key | Set<React.Key>) => {
    // Assuming Select component from HeroUI provides the selected key directly
    // or as the first item in a Set for single selection mode.
    const selectedKey =
      typeof keys === "string" || typeof keys === "number"
        ? keys.toString()
        : Array.from(keys as Set<React.Key>)[0]?.toString();
    if (selectedKey) {
      setThemeByName(selectedKey);
    }
  };

  return (
    <Select
      aria-label="Select color theme"
      placeholder="Select theme"
      selectedKeys={theme ? new Set([theme.name]) : new Set()}
      onSelectionChange={handleThemeChange}
      className="w-40"
      startContent={<SwatchIcon className="w-5 h-5 text-default-500" />}
    >
      {availableThemes.map((availTheme) => (
        <SelectItem key={availTheme.name} textValue={availTheme.name}>
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: availTheme.colors.primary }}
            />
            {availTheme.name.charAt(0).toUpperCase() + availTheme.name.slice(1)}
          </div>
        </SelectItem>
      ))}
    </Select>
  );
};
