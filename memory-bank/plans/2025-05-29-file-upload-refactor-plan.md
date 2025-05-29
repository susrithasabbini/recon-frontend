## Plan: Refactor File Upload Page

**Objective:** Align layout with `account-creation.tsx`, move file upload/processing mode to a modal, and center tables.

| Done | # | Action                                                                 | Detail                                                                                                                                                              |
|------|---|------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [ ]  | 1 | Add Imports & Modal State                                              | Import `Modal`, `Button`, and related components from HeroUI. Add state for managing modal visibility (e.g., `isFileUploadModalOpen`).                               |
| [ ]  | 2 | Update Page Root Structure & Title                                     | Change the root element to `<div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">` and update the title section to match the centered style of other pages. |
| [ ]  | 3 | Relocate Account Selection Card & Add "Upload File" Button             | Keep the "Select Account" card on the main page. Add a new "Upload File" button that will trigger the modal.                                                        |
| [ ]  | 4 | Implement File Upload Modal                                            | Create a new Modal component. Move the existing `FileUploadForm` component (or its core elements for file input, processing mode, and upload action) into this modal. |
| [ ]  | 5 | Remove Old `FileUploadForm` Placement & Two-Column Grid                | Delete the `FileUploadForm` from its current position in the layout and remove the `aside`/`main` two-column grid structure.                                        |
| [ ]  | 6 | Restructure & Center Table Sections                                    | Ensure the "Processing Entries" and "Processed Entries" table cards are directly within the new single-column centered layout, similar to `account-creation.tsx`.     |
| [ ]  | 7 | Update Memory Bank                                                     | Document changes in `activeContext.md`, `progress.md`, and `file-upload.md`.                                                                                        |

<!--
{
  "plan": [
    {
      "id": 1,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/file-upload.tsx",
        "diff": "<<<<<<< SEARCH\nimport { title } from \"@/components/primitives\";\nimport { addToast } from \"@heroui/toast\";\n=======        \nimport { title } from \"@/components/primitives\";\nimport { addToast } from \"@heroui/toast\";\nimport { Button } from \"@heroui/button\";\nimport {\n  Modal,\n  ModalContent,\n  ModalHeader,\n  ModalBody,\n  ModalFooter,\n} from \"@heroui/modal\";\nimport { PlusIcon } from \"@heroicons/react/24/outline\"; // Or another suitable icon\n>>>>>>> REPLACE\n\n<<<<<<< SEARCH\n  const [uploadStatus, setUploadStatus] = useState<UploadResponse | null>(null);\n  const rowsPerPage = 10; // Changed to 10\n=======        \n  const [uploadStatus, setUploadStatus] = useState<UploadResponse | null>(null);\n  const rowsPerPage = 10; // Changed to 10\n  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);\n>>>>>>> REPLACE"
      },
      "success_criteria": "Imports and state added to file-upload.tsx",
      "status": "pending"
    },
    {
      "id": 2,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/file-upload.tsx",
        "diff": "<<<<<<< SEARCH\n  return (\n    <>\n      {/* Hero Section */}\n      <motion.section\n        variants={fadeInUp}\n        initial=\"hidden\"\n        animate=\"visible\"\n        className=\"container mx-auto\"\n      >\n        <motion.div\n          initial={{ opacity: 0, y: -24 }}\n          animate={{ opacity: 1, y: 0 }}\n          transition={{ duration: 0.7, ease: \"easeOut\" }}\n          className=\"relative mx-auto w-full max-w-4xl rounded-3xl px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 flex flex-col items-center gap-2 text-center\"\n        >\n          <motion.h1\n            variants={fadeInUp}\n            custom={1}\n            className={clsx(\n              title({ size: \"md\", color: \"primary\" }), // Changed color to \"primary\"\n              \"leading-6 py-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl\",\n            )}\n          >\n            File Upload\n          </motion.h1>\n          <motion.p\n            variants={fadeInUp}\n            custom={2}\n            className=\"text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg max-w-full sm:max-w-2xl mx-auto font-medium\"\n          >\n            Upload transaction files to start the reconciliation process.\n          </motion.p>\n        </motion.div>\n\n        {/* Grid Layout */}\n        <div className=\"grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 w-full mt-10\">\n=======        \n  return (\n    <div className=\"max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12\">\n      <motion.div\n        variants={fadeInUp}\n        initial=\"hidden\"\n        animate=\"visible\"\n        className=\"text-center mb-12 sm:mb-16\"\n      >\n        <h1\n          className={clsx(\n            title({ size: \"lg\", color: \"primary\" }),\n            \"mb-2\",\n          )}\n        >\n          File Upload\n        </h1>\n        <motion.p\n            variants={fadeInUp}\n            custom={1} // Adjusted delay if needed\n            className=\"text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg max-w-full sm:max-w-2xl mx-auto font-medium\"\n          >\n            Upload transaction files to start the reconciliation process.\n        </motion.p>\n      </motion.div>\n\n      {/* Content Layout */}\n      <div className=\"flex flex-col gap-6 md:gap-8 w-full mt-10\">\n>>>>>>> REPLACE"
      },
      "success_criteria": "Root layout and title section updated in file-upload.tsx",
      "status": "pending"
    },
    {
      "id": 3,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/file-upload.tsx",
        "diff": "<<<<<<< SEARCH\n        <div className=\"grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 w-full mt-10\">\n          {/* FORM */}\n          <aside className=\"lg:col-span-4 w-full max-w-full\">\n            <motion.div variants={scaleIn} initial=\"hidden\" animate=\"visible\">\n              <Card className=\"shadow-xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 w-full\">\n=======        \n      <div className=\"flex flex-col gap-6 md:gap-8 w-full mt-10\">\n          {/* ACCOUNT SELECTION AND UPLOAD TRIGGER */}\n          <motion.div variants={scaleIn} initial=\"hidden\" animate=\"visible\">\n            <Card className=\"shadow-xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 w-full\">\n>>>>>>> REPLACE\n\n<<<<<<< SEARCH\n            />\n          </aside>\n\n          {/* DATA TABLE */}\n          <main className=\"lg:col-span-8 space-y-4 sm:space-y-6 w-full max-w-full\">\n=======        \n            />\n            {/* Button to trigger modal - Placed after Account Selection Card */}\n            {selectedAccount && (\n              <div className=\"mt-6 flex justify-center\">\n                <Button \n                  color=\"primary\" \n                  onPress={() => setIsFileUploadModalOpen(true)}\n                  startContent={<ArrowUpTrayIcon className=\"w-5 h-5 mr-2\" />} // Using existing icon\n                >\n                  Upload File & Set Mode\n                </Button>\n              </div>\n            )}\n          </motion.div>\n          {/* DATA TABLES (will be direct children of the flex col) */}\n>>>>>>> REPLACE"
      },
      "success_criteria": "Account selection card relocated, upload button added, old aside/main structure prepared for removal.",
      "status": "pending"
    },
    {
      "id": 4,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/file-upload.tsx",
        "diff": "<<<<<<< SEARCH\n            />\n          </aside>\n=======        \n            />\n            {/* Modal for File Upload */}\n            <Modal\n              isOpen={isFileUploadModalOpen}\n              onClose={() => setIsFileUploadModalOpen(false)}\n              size=\"xl\" // Or md, lg as appropriate\n            >\n              <ModalContent>\n                <ModalHeader>Upload File and Set Processing Mode</ModalHeader>\n                <ModalBody>\n                  <FileUploadForm\n                    selectedAccount={selectedAccount}\n                    loading={loading}\n                    processingMode={processingMode}\n                    setProcessingMode={setProcessingMode}\n                    onFileChange={handleFileChange}\n                    handleUploadClick={async () => {\n                      await handleActualFileUpload();\n                      // Optionally close modal on success, or let user close it\n                      // if (uploadStatus && uploadStatus.failed_ingestions === 0) {\n                      //   setIsFileUploadModalOpen(false);\n                      // }\n                    }}\n                    filename={filename}\n                    uploadStatus={uploadStatus}\n                    isFileSelected={!!selectedFile}\n                  />\n                </ModalBody>\n                <ModalFooter>\n                  <Button variant=\"light\" onPress={() => setIsFileUploadModalOpen(false)}>\n                    Cancel\n                  </Button>\n                  {/* The FileUploadForm contains its own upload button, \n                      so we might not need another one here unless we change FileUploadForm structure.\n                      Alternatively, the main action button could be here, and FileUploadForm just handles inputs.\n                      For now, assuming FileUploadForm's button is primary.\n                   */}\n                </ModalFooter>\n              </ModalContent>\n            </Modal>\n          </motion.div> { /* Closing the motion.div that wraps Account Select and Upload Button */}\n>>>>>>> REPLACE"
      },
      "success_criteria": "File upload modal implemented with FileUploadForm.",
      "status": "pending"
    },
    {
      "id": 5,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/file-upload.tsx",
        "diff": "<<<<<<< SEARCH\n              </Card>\n            </motion.div>\n            <FileUploadForm\n              selectedAccount={selectedAccount}\n              loading={loading}\n              processingMode={processingMode}\n              setProcessingMode={setProcessingMode}\n              onFileChange={handleFileChange}\n              handleUploadClick={handleActualFileUpload}\n              filename={filename}\n              uploadStatus={uploadStatus}\n              isFileSelected={!!selectedFile}\n            />\n          </aside>\n\n          {/* DATA TABLE */}\n          <main className=\"lg:col-span-8 space-y-4 sm:space-y-6 w-full max-w-full\">\n=======        \n              </Card>\n            {/* FileUploadForm is now in the modal, remove from here */}\n            {/* End of Account Selection Card's motion.div is handled by previous step adding modal *after* it */}\n\n          {/* DATA TABLES section starts here, directly under the main flex col */}\n>>>>>>> REPLACE\n\n<<<<<<< SEARCH\n            </Card>\n          </main>\n        </div>\n      </motion.section>\n    </>\n=======        \n            </Card>\n        {/* End of Processed Entries Card */}\n        </div> { /* End of main flex col content layout */}\n    </div> { /* End of root max-w-6xl div */}\n>>>>>>> REPLACE"
      },
      "success_criteria": "Old FileUploadForm placement and two-column grid structure removed.",
      "status": "pending"
    },
    {
      "id": 6,
      "tool": "replace_in_file",
      "args": {
        "path": "src/pages/file-upload.tsx",
        "diff": ""
      },
      "comment": "Step 6 (Restructure & Center Table Sections) is largely achieved by removing the grid and main/aside. The table cards should now naturally flow in the centered column. If specific centering classes are needed on the cards themselves, this step would handle it, but likely not necessary if they are block elements within the flex column.",
      "success_criteria": "Table sections are centered in the new layout.",
      "status": "pending"
    },
    {
      "id": 7,
      "tool": "write_to_file",
      "args_summary": "Update activeContext.md, progress.md, file-upload.md",
      "status": "pending",
      "comment": "This step will involve multiple write_to_file calls or one call that updates a combined context document if preferred by Cline's future execution logic for multi-file updates."
    }
  ]
}
-->
