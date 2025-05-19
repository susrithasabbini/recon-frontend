import DefaultLayout from "@/layouts/default";

export default function AccountCreationPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center py-16">
        <h1 className="text-3xl font-bold mb-4">Account Creation</h1>
        <p className="text-lg text-gray-600">
          Set up your accounts (e.g., Sales Revenue, PSP Holding, Bank Account)
          to get started with reconciliation.
        </p>
      </section>
    </DefaultLayout>
  );
}
