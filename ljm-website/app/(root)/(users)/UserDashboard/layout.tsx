import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
      <UserProvider>
        <SidebarProvider>
          <UserSidebar />
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
