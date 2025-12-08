import "@/app/(root)/globals.css";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      {children}
      <Toaster />
      <Footer />
    </div>
  );
}
