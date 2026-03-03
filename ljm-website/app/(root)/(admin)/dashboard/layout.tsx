import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(root)/(admin)/components/dashboardNav/dash-sidebar";
import "@/app/(root)/globals.css";

import { Toaster } from "@/components/ui/sonner";
import { UserProvider } from "@/contexts/UserContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <UserProvider>
        <SidebarProvider>
          <AppSidebar className="" />
          <SidebarInset>
            <SidebarTrigger className="m-2 md:hidden" />
            {children}
          </SidebarInset>
          <Toaster />
        </SidebarProvider>
      </UserProvider>
    </div>
  );
}
