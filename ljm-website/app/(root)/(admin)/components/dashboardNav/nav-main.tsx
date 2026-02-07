"use client";

import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
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
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarGroup className="mt-10">
      <SidebarMenu>
        <SidebarGroupLabel className="text-accent-foreground">
          Menu
        </SidebarGroupLabel>
        {items.map((item, index) => {
          const isActive = pathname === item.url;
          return (
            <SidebarMenuItem
              key={index}
              className={`text-accent-foreground rounded-lg transition duration-300 ease-in-out ${
                isActive
                  ? "bg-chart-2 pointer-events-none text-white"
                  : "hover:bg-accent hover:scale-[1.05]"
              }`}
            >
              <SidebarMenuButton
                className="flex h-[50px] cursor-pointer"
                tooltip={item.title}
                onClick={() => {
                  setOpenMobile(false);
                  route.push(item.url);
                }}
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
