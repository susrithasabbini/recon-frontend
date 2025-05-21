# Tech Context

## Frontend Stack

- **Language:** TypeScript
- **Framework:** React (version not specified, assumed to be a recent version like 18+)
- **Build Tool/Bundler:** Vite (as indicated by `vite.config.ts`, `vite.svg`, `vite-env.d.ts`)
- **Package Manager:** npm (as indicated by `package.json`, `package-lock.json`)
- **Styling:**
  - Tailwind CSS (configured in `tailwind.config.js`, `postcss.config.js`)
  - CSS Modules or global CSS (`src/styles/globals.css`)
- **UI Component Library:** HeroUI (`@heroui/react` and specific component packages like `@heroui/input`, `@heroui/button`, `@heroui/select`, `@heroui/card`, `@heroui/table`, `@heroui/modal`, `@heroui/tooltip`, `@heroui/toast`, `@heroui/pagination`)
- **Icons:** Heroicons (`@heroicons/react/24/outline`)
- **Routing:** React Router DOM (`react-router-dom`)
- **State Management:**
  - React Hooks (`useState`, `useEffect`, `useMemo`, `useContext`)
  - React Context API for shared state.
- **Animations:** Framer Motion (`framer-motion`)
- **HTTP Client:** Axios (`axios`)
- **Linting/Formatting:**
  - ESLint (configured in `eslint.config.mjs`)
  - Prettier (commonly used with ESLint, though not explicitly listed, auto-formatting behavior suggests its presence or a similar tool)
- **Testing:**
  - Cypress for End-to-End testing (configured in `cypress.config.ts`, with tests in `cypress/e2e/`)

## Key Dependencies (from file structure and code snippets)

- `react`
- `react-dom`
- `react-router-dom`
- `@heroui/*` (various UI components)
- `@heroicons/react`
- `axios`
- `clsx` (for conditional class names)
- `framer-motion`
- `typescript`

## Development Environment

- **Node.js:** Required for running the React application and npm.
- **IDE:** VSCode (implied by user interaction context).
- **Operating System:** macOS (from user's system information).
- **Shell:** zsh (from user's system information).

## Deployment (Assumed/Potential)

- `vercel.json` suggests potential deployment to Vercel.
- Static site generation or SPA deployment.

## Constraints & Considerations

- **Browser Compatibility:** Ensure compatibility with modern web browsers. Specific targets not defined but generally means latest versions of Chrome, Firefox, Safari, Edge.
- **Performance:** Optimize for fast load times and smooth interactions, especially with data-heavy tables and animations.
- **Accessibility (a11y):** Adherence to WCAG guidelines is expected, as indicated by ARIA attributes and focus management in provided code.
- **API Dependencies:** The frontend is tightly coupled with a backend API for data. API availability and response times will directly impact frontend performance and user experience.
- **Security:** Standard frontend security practices should be followed (e.g., protection against XSS if user-generated content is displayed, though not prominent in current views). Sensitive data handling should be primarily on the backend.
- **Scalability:** While primarily a frontend concern, the way data is fetched, managed, and displayed should consider potential growth in data volume (e.g., number of accounts, transactions). Pagination is one pattern addressing this.
