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
      title: "Events Management",
      url: "/dashboard/EventManagement",
      icon: ShipWheelIcon,
    },
    {
      title: "Crew Application",
      url: "/dashboard/CrewApplication",
      icon: FileUser,
    },

    {
      title: "User Management",
      url: "/dashboard/user-management",
      icon: UserCog,
    },
    {
      title: "Article Management",
      url: "/dashboard/ArticleManagement",
      icon: Newspaper,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
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
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              disabled={isPending}
              tooltip="Logout"
              className="h-[50px]"
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
