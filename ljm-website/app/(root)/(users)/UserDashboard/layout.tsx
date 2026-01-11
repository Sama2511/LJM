import Header from "@/components/header";
import Footer from "@/components/Footer";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserSidebar } from "@/app/(root)/(users)/components/dashboardNav/user-sidebar";
import { Toaster } from "sonner";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <SidebarProvider>
        <UserSidebar />
        <SidebarTrigger />
        {children}
        <Toaster />
      </SidebarProvider>
      <Footer />
    </div>
  );
}
