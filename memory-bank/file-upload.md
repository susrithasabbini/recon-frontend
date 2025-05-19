# File Upload Page (`src/pages/file-upload.tsx`)

## Overview

The File Upload page allows users to upload and preview OMS and PSP CSV files for reconciliation. It provides a modern, user-friendly interface with clear feedback and robust data handling.

## Key Features

- **CSV Upload:** Users can upload OMS and PSP CSV files via dedicated file inputs.
- **File Feedback:** Displays the name of the uploaded file and the number of rows for each file type.
- **Data Table:** Shows a paginated, scrollable preview of the uploaded data with a fixed number of rows per page (default: 5).
- **Pagination:** Users can navigate between pages of data using Previous/Next and page number buttons, styled consistently with other pages.
- **Select Box:** A select dropdown allows toggling between OMS and PSP data. The selection cannot be cleared (uses `disallowEmptySelection`).
- **Loading State:** Shows a loading indicator while files are being processed.
- **Empty State:** Friendly empty state UI with icon and helpful text when no data is uploaded.

## Implementation Details

- **CSV Parsing:** Uses a simple in-file parser (does not handle quoted commas).
- **State Management:** Uses React `useState` for file data, filenames, loading, pagination, and selected data type.
- **Table Rendering:**
  - The first row of the CSV is used as the table header.
  - Data rows are paginated and rendered using the `@heroui/table` component.
  - Table cells do not wrap by default, ensuring clean, single-line display.
- **Accessibility:**
  - File inputs are visually hidden but accessible via labels.
  - All interactive elements have appropriate ARIA labels.
- **Styling:**
  - Uses Tailwind CSS utility classes for layout and appearance.
  - Consistent with the design system used in other pages (e.g., account-creation, rules-mapping).

## UX Consistency

- Pagination, select box behavior, and empty/loading states are implemented to match the patterns in `account-creation.tsx` and `rules-mapping.tsx` for a seamless user experience.

## Future Improvements

- Enhance CSV parsing to support quoted fields and commas within values.
- Add drag-and-drop file upload support.
- Support for additional file types or validation.
- Option to clear/reset uploaded files.
