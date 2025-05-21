# File Upload Page (`src/pages/file-upload.tsx`)

## Overview

The File Upload page allows users to upload and preview OMS and PSP CSV files for reconciliation. It provides a modern, user-friendly interface with clear feedback and robust data handling.

## Key Features

- **CSV Upload:** Users can upload OMS and PSP CSV files via dedicated file inputs.
- **File Feedback:** Displays the name of the uploaded file and the number of rows for each file type.
- **Data Table:** Shows a paginated, scrollable preview of the uploaded data using the `@heroui/table` component.
- **Pagination:** Uses the `@heroui/pagination` component for navigating between pages of data, ensuring consistency with other paginated tables in the application.
- **Select Box:** A select dropdown (`@heroui/select`) allows toggling between OMS and PSP data. The selection cannot be cleared (uses `disallowEmptySelection`).
- **Loading State:** Shows a loading indicator while files are being processed.
- **Empty State:** Friendly empty state UI with icon and helpful text when no data is uploaded.

## Implementation Details

- **CSV Parsing:** Uses a simple in-file parser (does not handle quoted commas).
- **State Management:** Uses React `useState` for file data, filenames, loading, current page (`page`), and selected data type (`selectedType`).
- **Table Rendering:**
  - The first row of the CSV is used as the table header.
  - Data rows are paginated. The `@heroui/table` component's `bottomContent` prop is used to render the `@heroui/pagination` component.
  - Pagination component is conditionally rendered only if `pages > 1`.
- **Accessibility:**
  - File inputs are visually hidden but accessible via labels.
  - All interactive elements have appropriate ARIA labels.
- **Styling:**
  - Uses Tailwind CSS utility classes for layout and appearance.
  - Consistent with the design system used in other pages (e.g., account-creation, rules-mapping).

## UX Consistency

- Pagination (using `@heroui/pagination`), select box behavior, and empty/loading states are implemented to match the patterns in `account-creation.tsx` and `rules-mapping.tsx` for a seamless user experience.

## Future Improvements

- Enhance CSV parsing to support quoted fields and commas within values.
- Add drag-and-drop file upload support.
- Support for additional file types or validation.
- Option to clear/reset uploaded files.
