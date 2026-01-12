import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(root)/(admin)/components/dashboardNav/dash-sidebar";
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
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        {children}
        <Toaster />
      </SidebarProvider>
      <Footer />
    </div>
  );
}
