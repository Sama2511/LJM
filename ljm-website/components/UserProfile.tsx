"use client";
import { createClient } from "@/app/utils/client";
import React, { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Bell, Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Link from "next/link";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  avatar_url?: string;
  role: string;
  formcompleted: boolean;
  created_at: string;
}

interface UserProfileProps {
  pageName: string;
}

export default function UserProfile({ pageName }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const supabase = createClient();
        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        if (authError || !authData.user) {
          setError("Failed to get authenticated user");
          setLoading(false);
          return;
        }

        const { data, error: dbError } = await supabase
          .from("users")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (dbError) {
          setError("Failed to load user data");
          setLoading(false);
          return;
        }

        setUser(data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading user:", err);
        setError("An unexpected error occurred");
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="mb-6 flex justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="mb-6 flex justify-between">
        <h1 className="text-2xl font-semibold md:text-3xl">{pageName}</h1>
        <div className="text-muted-foreground text-sm">
          {error || "User not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 mb-10 flex justify-between">
      <h1 className="text-2xl font-semibold md:text-3xl">{pageName}</h1>
      <div className="bg-muted flex items-center gap-6 rounded-3xl border-2 px-5">
        <Tooltip>
          <TooltipTrigger>
            <Link href="/dashboard/settings">
              <Settings className="cursor-pointer transition-opacity hover:opacity-70" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <Bell className="cursor-pointer transition-opacity hover:opacity-70" />
          </TooltipTrigger>

          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>
        <div className="font-chillax flex h-fit items-center gap-3 py-2">
          <Avatar>
            <AvatarImage
              src={user.avatar_url}
              alt={`${user.firstname} ${user.lastname}`}
            />
            <AvatarFallback className="bg-[#3E5F44] text-white">
              {getInitials(user.firstname, user.lastname)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">
              {user.firstname} {user.lastname}
            </span>
            <span className="text-muted-foreground text-sm capitalize">
              {user.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
