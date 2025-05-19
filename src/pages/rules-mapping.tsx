import DefaultLayout from "@/layouts/default";

export default function RulesMappingPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center py-16">
        <h1 className="text-3xl font-bold mb-4">Recon Rules Mapping</h1>
        <p className="text-lg text-gray-600">
          Define how data flows between accounts and set up expectations for
          automated reconciliation.
        </p>
      </section>
    </DefaultLayout>
  );
}
