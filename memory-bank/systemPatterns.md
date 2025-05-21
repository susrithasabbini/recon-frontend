# System Patterns and Architecture

## Frontend Architecture

- **Component-Based UI:** The frontend is built using React, leveraging a component-based architecture for modularity and reusability.
- **Layout System:** A `DefaultLayout` component provides a consistent structure (e.g., navbar, main content area) for all pages.
- **Styling:** Tailwind CSS is used for utility-first styling, ensuring rapid UI development and consistency. HeroUI components provide a pre-styled set of UI elements.
- **Routing:** React Router DOM (`react-router-dom`) handles client-side routing, enabling navigation between different pages like Account Management, File Upload, and Rules Mapping.
- **State Management:**
  - **Local Component State:** React `useState` and `useMemo` hooks are used for managing state within individual components (e.g., form inputs, loading flags, filtered data).
  - **Shared Context:** React Context API (`useDefaultContext`) is employed for managing global or shared state, such as the `selectedMerchant` ID, and providing access to shared functions like `getAccounts`, `createAccount`.
- **API Interaction:** Axios is configured for making HTTP requests to the backend API. A base instance (`@/config/axios`) is likely set up with default configurations (e.g., base URL, headers).
- **Animations:** Framer Motion is used for UI animations, enhancing user experience with smooth transitions and visual feedback (e.g., `fadeInUp`, `scaleIn` variants).
- **Notifications:** A toast notification system (`@heroui/toast`) is used to provide users with feedback on operations (e.g., success or failure of creating an account).

## Key UI/UX Patterns

- **Page Structure:** Most pages follow a pattern:
  - Hero section with a title and descriptive text.
  - A main content area, often a two-column grid layout (e.g., form on one side, data display on the other).
- **Data Display:**
  - Tables (`@heroui/table`) are consistently used for displaying lists of data (accounts, uploaded CSV rows, mappings).
  - Pagination (`@heroui/pagination`) is implemented for tables displaying large datasets.
  - Search/filtering capabilities are provided for tables.
- **Forms:**
  - Input fields (`@heroui/input`), select dropdowns (`@heroui/select`), and buttons (`@heroui/button`) from HeroUI are standard.
  - Client-side validation is performed, with error messages displayed near the relevant fields.
- **Modals (`@heroui/modal`):** Used for confirmations (e.g., delete actions) and editing data in a focused manner.
- **Loading States:**
  - Skeleton loaders or loading indicators are displayed during data fetching or processing to provide visual feedback.
  - Buttons often show a loading state during asynchronous operations.
- **Empty States:** Informative messages and icons are shown when no data is available (e.g., no accounts, no files uploaded, no merchant selected).
- **Merchant Context:** The application heavily relies on a `selectedMerchant` context. Most functionalities are scoped to the selected merchant, and UI elements are often disabled or show prompts if no merchant is selected.

## Code Structure (Illustrative based on provided files)

```
src/
├── components/         # Reusable UI components (icons, primitives, etc.)
├── config/             # Application configuration (axios, site settings)
├── contexts/           # React Context providers (e.g., DefaultReconProvider)
├── layouts/            # Layout components (e.g., DefaultLayout)
├── pages/              # Page-level components (AccountCreationPage, FileUploadPage)
├── styles/             # Global styles
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component, sets up router and providers
├── main.tsx            # Entry point of the application
├── provider.tsx        # Main application provider setup
└── routes.tsx          # Route definitions
```

## Backend Interaction (Assumed)

- The frontend communicates with a RESTful or GraphQL API.
- API endpoints are structured around resources (e.g., `/merchants/{merchant_id}/accounts`, `/merchants/{merchant_id}/recon-rules`).
- Authentication and authorization are handled by the backend (details not specified but implied).

## Design Principles

- **Modularity:** Breaking down the application into smaller, manageable components and modules.
- **Reusability:** Creating components and functions that can be used across different parts of the application.
- **Separation of Concerns:** Keeping UI logic, business logic, and API communication distinct where possible.
- **Consistency:** Maintaining a consistent look, feel, and behavior throughout the application by using a shared component library and design patterns.
- **Memory Bank Upkeep:** After any code modifications, the relevant files within the `/memory-bank/` directory (especially `activeContext.md`, `progress.md`, and any directly impacted page-specific markdown files) will be updated to reflect these changes. This ensures the Memory Bank remains a current and reliable source of project context.
