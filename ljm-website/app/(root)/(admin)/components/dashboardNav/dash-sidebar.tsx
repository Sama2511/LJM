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

const data = {
  user: {
    name: "Oussama",
    email: "Hassouneoussama@gmail.com",
    avatar: "",
  },
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
      <SidebarHeader className="border-b-2 py-5">
        <SidebarMenuItem>
          <div className="flex">
            <img
              src="/image14.png"
              width={50}
              height={30}
              className="rounded-md"
            />
            <div className="ml-[6px] grid text-left text-sm leading-tight">
              <span className="truncate text-lg font-bold">
                Memorial Hospital
              </span>
              <span className="truncate font-medium">Admin portal</span>
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t-2">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
