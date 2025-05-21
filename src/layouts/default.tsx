import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="flex-grow py-10">
        {" "}
        {/* Removed container, mx-auto, px-20 and py-10 */}
        {children}
      </main>
    </div>
  );
}
