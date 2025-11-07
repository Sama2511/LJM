"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const route = useRouter();
  const pathname = usePathname();
  return (
    <SidebarGroup className="mt-10">
      <SidebarMenu>
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        {items.map((item) => {
          const isActive =
            pathname === item.url ||
            (pathname.startsWith(item.url) && item.url !== "/");
          return (
            <SidebarMenuItem
              className={isActive ? "bg-chart-2 rounded-lg text-white" : ""}
            >
              <SidebarMenuButton
                className="h-[50px] cursor-pointer"
                tooltip={item.title}
                onClick={() => route.push(item.url)}
              >
                {item.icon && <item.icon style={{ width: 22, height: 22 }} />}
                <span className="text-[17px] font-medium">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
