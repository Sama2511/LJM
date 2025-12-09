"use client";

import * as React from "react";
import {
  CalendarCheck2,
  FileUser,
  LayoutDashboard,
  Settings,
  ShipWheelIcon,
  UserCog,
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
} from "@/components/ui/sidebar";
import { createClient } from "@/app/utils/client";

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
      title: "Crew request",
      url: "/dashboard/requests",
      icon: CalendarCheck2,
    },
    {
      title: "User Management",
      url: "/dashboard/user-management",
      icon: UserCog,
    },
    {
      title: "settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="sticky top-[120px] h-[calc(100vh-120px)]"
      {...props}
    >
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
