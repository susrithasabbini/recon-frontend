# System Patterns and Architecture

## Frontend Architecture

- **Component-Based UI:** The frontend is built using React, leveraging a component-based architecture for modularity and reusability.
- **Layout System:** A `DefaultLayout` component provides a consistent structure (e.g., navbar, main content area) for all pages.
- **Styling:** Tailwind CSS is used for utility-first styling, ensuring rapid UI development and consistency. HeroUI components provide a pre-styled set of UI elements.
- **Routing:** React Router DOM (`react-router-dom`) handles client-side routing, enabling navigation between different pages like Account Management, File Upload, and Rules Mapping.
- **State Management:**
  - **Local Component State:** React `useState` and `useMemo` hooks are used for managing state within individual components (e.g., form inputs, loading flags, filtered data).
  - **Shared Context:** React Context API (`useDefaultContext`, `useColorTheme`) is employed for managing global or shared state. This includes `selectedMerchant` ID, shared data functions, and the active color theme.
- **API Interaction:** Axios is configured for making HTTP requests to the backend API. A base instance (`@/config/axios`) is likely set up with default configurations (e.g., base URL, headers).
- **Animations:** Framer Motion is used for UI animations, enhancing user experience with smooth transitions and visual feedback (e.g., `fadeInUp`, `scaleIn` variants).
- **Notifications:** A toast notification system (`@heroui/toast`) is used to provide users with feedback on operations (e.g., success or failure of creating an account).

## Key UI/UX Patterns

- **Page Structure:**
  - **Standard Page Layout:** Most pages include a hero section (title, description) and a main content area.
  - **Two-Column CRUD Pattern:** Several pages (`account-creation`, `merchant-creation`, `rules-mapping`) utilize a consistent two-column layout: a form for creation/input on one side (typically left), and a paginated, searchable/filterable table displaying existing data on the other. Modals are used for editing or confirmation.
- **Data Display:**
  - Tables (`@heroui/table`) are consistently used for displaying lists of data.
  - Pagination (`@heroui/pagination`) is implemented for tables displaying large datasets.
  - Search/filtering capabilities are provided for tables.
  - **Complex Filtering Logic:** Some tables (e.g., "Processed Entries" in `file-upload.tsx`) feature multiple interconnected filters (e.g., status dropdowns, boolean switches) that combine to refine the displayed dataset.
- **Forms:**
  - Input fields (`@heroui/input`), select dropdowns (`@heroui/select`), and buttons (`@heroui/button`) from HeroUI are standard.
  - Client-side validation is performed, with error messages displayed near the relevant fields.
- **Modals (`@heroui/modal`):** Used for confirmations (e.g., delete actions) and editing data in a focused manner.
- **Loading States:**
  - Skeleton loaders or loading indicators are displayed during data fetching or processing to provide visual feedback.
  - Buttons often show a loading state during asynchronous operations.
- **Empty States:** Informative messages and icons are shown when no data is available (e.g., no accounts, no files uploaded, no merchant selected).
- **Merchant Context:** The application heavily relies on a `selectedMerchant` context. Most functionalities are scoped to the selected merchant, and UI elements are often disabled or show prompts if no merchant is selected.
- **Wizard/Stepper Pattern:** The `MainProcessFlowPage.tsx` implements a wizard/stepper UI to guide users through a sequence of operations (Merchant Creation → Account Creation → Rules Mapping → File Upload).
- **Page Composition:** The `MainProcessFlowPage.tsx` composes other full-page components (`MerchantManagementPage`, `AccountCreationPage`, etc.) into its steps, demonstrating a modular approach where pages can be used standalone or as part of a guided flow.
- **Dynamic Color Theming:**
  - A `ColorThemeContext` (`src/contexts/ColorThemeContext.tsx`) manages the active color theme (e.g., blue, red, green).
  - Theme definitions (color palettes) are stored in `src/config/colorThemes.ts`.
  - On theme change, CSS custom properties (e.g., `--color-primary-rgb`) are updated on the root HTML element. These properties store space-separated RGB values.
  - Tailwind CSS (`tailwind.config.js`) is configured to use these CSS variables for its semantic colors (e.g., `primary: "rgb(var(--color-primary-rgb) / <alpha-value>)"`) and its default `ringColor`.
  - A `ColorThemeSelector` component in the navbar allows users to switch themes.
  - The selected theme is persisted in `localStorage`.
  - Components like `RowSteps` and page titles (using the `title` primitive) have been updated to utilize these theme-aware primary colors.

## Code Structure (Illustrative based on provided files)

```
src/
├── components/         # Reusable UI components (icons, primitives, etc.)
├── config/             # Application configuration (axios, site settings, colorThemes.ts)
├── contexts/           # React Context providers (e.g., DefaultReconProvider, ColorThemeProvider)
├── layouts/            # Layout components (e.g., DefaultLayout)
├── pages/              # Page-level components (AccountCreationPage, FileUploadPage). Note: `src/pages/index.tsx` appears to be a component/section rather than a standalone page.
├── styles/             # Global styles
├── types/              # TypeScript type definitions (organized by domain: common, merchant, account, rule, file)
│   ├── index.ts        # Barrel file for types
│   ├── common.types.ts
│   ├── merchant.types.ts
│   ├── account.types.ts
│   ├── rule.types.ts
│   └── file.types.ts
├── App.tsx             # Main application component, sets up router and providers
├── main.tsx            # Entry point of the application
├── provider.tsx        # Main application provider setup
└── routes.tsx          # Route definitions
```

## Backend Interaction

- The frontend communicates with a RESTful API.
- API endpoints are structured around resources, typically nested under a merchant or account context. Examples:
  - `/merchants/{merchant_id}/accounts` (GET, POST, PUT, DELETE for accounts)
  - `/merchants/{merchant_id}/recon-rules` (GET, POST for rules)
  - `/merchants/{merchant_id}/recon-rules/{rule_id}` (DELETE for a specific rule)
  - `/accounts/{account_id}/staging-entries` (GET for staging data)
  - `/accounts/{account_id}/staging-entries/files` (POST for file uploads to staging)
  - `/accounts/{account_id}/entries` (GET for processed account entries)
- **Polling for Real-time Updates:** Some pages (e.g., `file-upload.tsx`) use `setInterval` to poll API endpoints (like `/staging-entries` and `/entries`) periodically (e.g., every second) to refresh data and provide near real-time updates to the user.
- Authentication and authorization are handled by the backend (details not specified but implied).

## Design Principles

- **Modularity:** Breaking down the application into smaller, manageable components and modules.
- **Reusability:** Creating components and functions that can be used across different parts of the application.
- **Separation of Concerns:** Keeping UI logic, business logic, and API communication distinct where possible.
- **Consistency:** Maintaining a consistent look, feel, and behavior throughout the application by using a shared component library and design patterns.
- **Memory Bank Upkeep:** After any code modifications, the relevant files within the `/memory-bank/` directory (especially `activeContext.md`, `progress.md`, and any directly impacted page-specific markdown files) will be updated to reflect these changes. This ensures the Memory Bank remains a current and reliable source of project context.
