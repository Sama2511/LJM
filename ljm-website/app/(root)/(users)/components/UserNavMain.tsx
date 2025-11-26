"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, CalendarCheck2, Star } from "lucide-react";

export default function UserNavMain() {
  const pathname = usePathname();

  const items = [
    {
      title: "Dashboard",
      url: "/users/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Profile",
      url: "/users/dashboard/profile",
      icon: User,
    },
    {
      title: "My Status",
      url: "/users/dashboard/status",
      icon: CalendarCheck2,
    },
    {
      title: "Volunteer Level",
      url: "/users/dashboard/level",
      icon: Star,
    },
  ];

  return (
    <nav className="space-y-3">
      {items.map((item) => (
        <Link
          key={item.url}
          href={item.url}
          className={`flex items-center gap-3 p-2 rounded-md ${
            pathname === item.url
              ? "bg-purple-200 font-semibold"
              : "hover:bg-gray-100"
          }`}
        >
          <item.icon className="w-5 h-5" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
}