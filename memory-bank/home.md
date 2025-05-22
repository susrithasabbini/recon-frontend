# Home Page (`src/pages/home.tsx`)

## Overview

The Home Page (exported as `IndexPage`) serves as the primary landing page for the "Accounting & Reconciliation Tool". It provides a welcoming interface with a brief introduction to the application's purpose and a clear call to action.

## Key Features

-   **Hero Illustration:**
    -   A custom SVG component (`HeroIllustration`) visually represents a simplified reconciliation flow involving OMS, PSP, and Bank data sources.
    -   The SVG includes animated paths and text elements.
-   **Informative Text:**
    -   Main title: "Accounting & Reconciliation Tool".
    -   Subtitle: Briefly explains the streamlined process of setting up accounts, mapping rules, and uploading files.
-   **Call to Action:**
    -   A prominent "Get Started" button.
    -   Links to the `/process-flow` page, guiding users to the main workflow of the application.
-   **Layout:**
    -   Uses the `DefaultLayout` component, ensuring consistency with other pages.
    -   Content is centered and designed for a clean, focused presentation.
-   **Animations:**
    -   Leverages `framer-motion` for smooth entrance animations for the hero illustration, text sections, a decorative divider, and the "Get Started" button.

## Implementation Details

-   **Component Structure:**
    -   The page is a single functional component `IndexPage`.
    -   The `HeroIllustration` is a separate functional component defined within the same file.
-   **Styling:**
    -   Uses Tailwind CSS via `clsx` and predefined `title` and `subtitle` primitives from `@/components/primitives`.
-   **Routing:**
    -   The "Get Started" button uses `<Button as={Link} href="/process-flow">`, utilizing `@heroui/link` (likely a wrapper around `react-router-dom`'s Link) for navigation.
-   **No Context or API Interaction:** This page is purely presentational and does not consume any React context or make API calls.

## Dependencies

-   `@heroui/link`
-   `@heroui/button`
-   `@/layouts/default`
-   `framer-motion`
-   `clsx`
-   `@/components/primitives` (for `title`, `subtitle`)

## Purpose in User Flow

-   Acts as the initial entry point for users.
-   Provides a high-level overview of the application's value.
-   Directs users to the main process flow to begin their reconciliation tasks.
