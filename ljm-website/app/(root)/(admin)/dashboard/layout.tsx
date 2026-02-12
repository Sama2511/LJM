import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(root)/(admin)/components/dashboardNav/dash-sidebar";
import "@/app/(root)/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/contexts/UserContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <UserProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarTrigger className="mt-13" />
          {children}
          <Toaster />
        </SidebarProvider>
      </UserProvider>
      <Footer />
    </div>
  );
}
