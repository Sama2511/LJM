import Footer from "@/components/Footer";
import Header from "@/components/header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="pt-32">
        {children}
      </div>
      <Footer />
    </>
  );
}