# Active Context - 2025-05-22

## Current Focus

- Implemented dynamic color theming feature, including focus ring theming for inputs and selects.

## Key Decisions & Changes

### Dynamic Color Theming:

- **Objective**: Allow users to change the application's primary color scheme via a dropdown in the navbar, including focus indicators.
- **Strategy**:
  - Defined multiple color themes (blue, red, pink, yellow, orange, violet, purple, green) with primary, focus, and content colors in `src/config/colorThemes.ts`.
  - Introduced CSS custom properties (e.g., `--color-primary-rgb`) in `src/styles/globals.css` to hold theme color values.
  - Configured Tailwind CSS (`tailwind.config.js`) to use these CSS custom properties for its semantic colors (`primary`, `primary-focus`, `primary-content`) and set the default `ringColor` to the theme's primary color.
  - Created a `ColorThemeContext` (`src/contexts/ColorThemeContext.tsx`) to manage the active theme and apply it by updating CSS variables on the root element. The context also persists the selected theme to localStorage.
  - Developed a `ColorThemeSelector` component (`src/components/ColorThemeSelector.tsx`) using HeroUI's `Select` component for theme selection.
  - Integrated the `ColorThemeSelector` into the main `Navbar` component (`src/components/navbar.tsx`).
  - Wrapped the entire application with `ColorThemeProvider` in `src/App.tsx`.
  - Refactored `src/components/row-steps.tsx` and page titles to use theme-aware colors.
  - Updated the `title` primitive in `src/components/primitives.ts`.
  - Applied themed focus ring styles (`focus-within:ring-2 focus-within:ring-primary focus-within:border-primary` or `focus:ring-2 focus:ring-primary focus:border-primary`) to `Input` and `Select` components in `merchant-creation.tsx`, `account-creation.tsx`, `rules-mapping.tsx`, `file-upload.tsx`, and `file-upload-form.tsx` using their `classNames` prop.
- **Files Created/Modified**:
  - `src/config/colorThemes.ts` (created)
  - `src/styles/globals.css` (updated)
  - `tailwind.config.js` (updated with ringColor)
  - `src/contexts/ColorThemeContext.tsx` (created, updated)
  - `src/components/ColorThemeSelector.tsx` (created, updated)
  - `src/components/navbar.tsx` (updated)
  - `src/App.tsx` (updated)
  - `src/components/row-steps.tsx` (updated)
  - `src/components/primitives.ts` (updated)
  - `src/pages/merchant-creation.tsx` (updated for title and input focus rings)
  - `src/pages/account-creation.tsx` (updated for title and input/select focus rings)
  - `src/pages/rules-mapping.tsx` (updated for title and select focus rings)
  - `src/pages/file-upload.tsx` (updated for title and select focus rings)
  - `src/components/file-upload-form.tsx` (updated for select focus rings)
  - `memory-bank/activeContext.md` (this update)
  - `memory-bank/progress.md` (to be updated)
  - `memory-bank/systemPatterns.md` (to be updated)
  - `memory-bank/techContext.md` (to be updated)

---

_Previous Context (Type Refactoring):_

### TypeScript Types Refactoring:

- **Objective**: Improve organization and maintainability of TypeScript types.
- **Strategy**:
  - Identified all inline types in `src/pages` and `src/components`.
  - Created domain-specific type files under `src/types/`.
  - Updated `src/types/index.ts` to be a barrel file.
  - Refactored component and page files to import types from `@/types`.
- **Files Created/Modified**:
  - `src/types/common.types.ts`, `merchant.types.ts`, `account.types.ts`, `rule.types.ts`, `file.types.ts` (created)
  - `src/types/index.ts` (updated)
  - Various pages and components in `src/pages` and `src/components` (refactored)
  - `memory-bank/systemPatterns.md` (updated)

## Next Steps

- Update `progress.md`, `systemPatterns.md`, and `techContext.md` in the Memory Bank.
- User to verify focus ring theming for Inputs and Selects after restarting dev server.
