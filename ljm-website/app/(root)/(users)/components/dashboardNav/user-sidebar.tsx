"use client";

import * as React from "react";
import {
  LayoutDashboard,
  User,
  CalendarCheck2,
  Star,
  Bell,
  Settings,
  CalendarDays,
  HeartHandshake,
  LogOut,
} from "lucide-react";

import { NavMain } from "./nav-main";

import {
  Sidebar,
  SidebarContent,
  SidebarRail,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { logout } from "@/actions/users";
import { useTransition } from "react";

const data = {
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
      url: "/UserDashboard/events",
      icon: CalendarDays,
    },
    {
      title: "My Volunteering",
      url: "/UserDashboard/volunteering",
      icon: HeartHandshake,
    },
   
  ],
};

export function UserSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="sticky top-[120px] h-[calc(100vh-120px)]"
    >
      {/* <SidebarHeader className="border-b-2 py-5">
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
      </SidebarHeader> */}

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
