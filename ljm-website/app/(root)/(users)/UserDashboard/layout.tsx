import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserSidebar } from "@/app/(root)/(users)/components/dashboardNav/user-sidebar";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-chillax flex min-h-screen flex-col">
      {/* ---------- HEADER ---------- */}
      <Header />

      {/* ---------- MAIN CONTENT + SIDEBAR ---------- */}
      <div className="flex flex-1">
        <SidebarProvider>
          {/* Left Sidebar */}
          <UserSidebar />

          {/* Page Content */}
          <main className="flex-1 p-6">
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </div>

      {/* ---------- FOOTER ---------- */}
      <Footer />
    </div>
  );
}
