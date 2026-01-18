import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-3 px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}