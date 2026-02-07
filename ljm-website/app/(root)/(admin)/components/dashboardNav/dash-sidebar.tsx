"use client";

import * as React from "react";
import {
  CalendarCheck2,
  FileUser,
  LayoutDashboard,
  Settings,
  ShipWheelIcon,
  UserCog,
  LogOut,
  Newspaper,
  Files,
} from "lucide-react";

import { NavMain } from "@/app/(root)/(admin)/components/dashboardNav/nav-main";
import { NavUser } from "@/app/(root)/(admin)/components/dashboardNav/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuItem,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { createClient } from "@/app/utils/client";
import { logout } from "@/actions/users";
import { useTransition } from "react";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Events ",
      url: "/dashboard/EventManagement",
      icon: ShipWheelIcon,
    },
    {
      title: "Crew Applications",
      url: "/dashboard/CrewApplication",
      icon: FileUser,
    },

    {
      title: "Users ",
      url: "/dashboard/user-management",
      icon: UserCog,
    },
    {
      title: "Articles",
      url: "/dashboard/ArticleManagement",
      icon: Newspaper,
    },
    {
      title: "Documents",
      url: "/dashboard/DocumentManagement",
      icon: Files,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isPending, startTransition] = useTransition();
  const { setOpenMobile } = useSidebar();

  const handleLogout = () => {
    setOpenMobile(false);
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <Sidebar
      collapsible="icon"
      className="sticky top-[120px] h-[calc(100vh-120px)]"
      {...props}
    >
      <SidebarContent className="bg-muted">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="bg-muted border-accent-foreground border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              disabled={isPending}
              tooltip="Logout"
              className="text-accent-foreground h-[50px]"
            >
              <LogOut style={{ width: 22, height: 22 }} />
              <span className="text-[17px] font-medium">
                {isPending ? "Logging out..." : "Logout"}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
