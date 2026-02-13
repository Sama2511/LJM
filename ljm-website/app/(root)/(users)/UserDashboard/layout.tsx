import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserSidebar } from "@/app/(root)/(users)/components/dashboardNav/user-sidebar";
import { Toaster } from "sonner";
import { UserProvider } from "@/contexts/UserContext";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <UserProvider>
        <SidebarProvider>
          <UserSidebar />
          <SidebarTrigger className="mt-13" />
          {children}
          <Toaster />
        </SidebarProvider>
      </UserProvider>
      <Footer />
    </div>
  );
}
