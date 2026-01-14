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
      title: "Browse Events",
      url: "/UserDashboard/events",
      icon: CalendarDays,
    },
    {
      title: "My Volunteering",
      url: "/UserDashboard/volunteering",
      icon: HeartHandshake,
    },
    {
      title: "My Profile",
      url: "/UserDashboard/profile",
      icon: User,
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
