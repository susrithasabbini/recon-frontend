import DefaultLayout from "@/layouts/default";

export default function FileUploadPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center py-16">
        <h1 className="text-3xl font-bold mb-4">File Upload</h1>
        <p className="text-lg text-gray-600">
          Upload OMS, PSP, and Bank data files to start the reconciliation
          process.
        </p>
      </section>
    </DefaultLayout>
  );
}
