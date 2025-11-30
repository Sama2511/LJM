"use client";

import * as React from "react";
import { LayoutDashboard, User, CalendarCheck2, Star, Bell, Settings, CalendarDays, HeartHandshake } from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

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
    name: "Volunteer",
    email: "volunteer@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/UserDashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Profile",
      url: "/UserDashboard/profile",
      icon: User,
    },
     {
      title: "Browse Events",
      url: "/UserDashboard/level",
      icon: CalendarDays,
     },
      {
      title: "My Volunteering",
      url: "/UserDashboard/level",
      icon: HeartHandshake,
      },
    {
      title: "Volunteer Level",
      url: "/UserDashboard/level",
      icon: Star,
    },
    {
      title: "Notifications",
      url: "/UserDashboard/notifications",
      icon: Bell,
    },
     {
      title: "Settings",
      url: "/UserDashboard/status",
      icon: Settings,
    },
  ],
};

export function UserSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
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
                Volunteer Portal
              </span>
              <span className="truncate font-medium">User Dashboard</span>
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