"use client";
import { createClient } from "@/app/utils/client";
import React, { useEffect, useState } from "react";
import { Skeleton } from "../../../../components/ui/skeleton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Bell, Settings } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
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

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  reference_type: string | null;
  reference_id: string | null;
  user_id: string | null;
  created_at: string;
  is_read: boolean;
}

interface UserProfileProps {
  pageName: string;
}

export default function UserProfile({ pageName }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return `${Math.floor(seconds / 604800)} weeks ago`;
  };

  const loadNotifications = async (userId: string) => {
    const supabase = createClient();

    const { data: notificationsData } = await supabase
      .from("notifications")
      .select("*")
      .or(`user_id.eq.${userId},user_id.is.null`)
      .order("created_at", { ascending: false })
      .limit(20);

    if (!notificationsData) return;

    const { data: readsData } = await supabase
      .from("notification_reads")
      .select("notification_id")
      .eq("user_id", userId);

    const readNotificationIds = new Set(
      readsData?.map((r) => r.notification_id) || [],
    );

    const notificationsWithReadStatus = notificationsData.map((n) => ({
      ...n,
      is_read: readNotificationIds.has(n.id),
    }));

    setNotifications(notificationsWithReadStatus);
    setUnreadCount(
      notificationsWithReadStatus.filter((n) => !n.is_read).length,
    );
  };

  const markAllAsRead = async () => {
    if (!user) return;

    const supabase = createClient();
    const unreadNotifications = notifications.filter((n) => !n.is_read);

    if (unreadNotifications.length === 0) return;

    const readsToInsert = unreadNotifications.map((n) => ({
      notification_id: n.id,
      user_id: user.id,
    }));

    await supabase.from("notification_reads").insert(readsToInsert);

    setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
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
        await loadNotifications(authData.user.id);
        setLoading(false);
      } catch (err) {
        console.error("Error loading user:", err);
        setError("An unexpected error occurred");
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      if (notificationOpen) {
        const target = e.target;
        if (
          target === document ||
          target === document.documentElement ||
          target === document.body
        ) {
          setNotificationOpen(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [notificationOpen]);

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
      <h1 className="font-chillax text-2xl font-semibold md:text-3xl">
        {pageName}
      </h1>
      <div className="bg-muted flex items-center gap-6 rounded-3xl border-2 px-5">
        <Tooltip>
          <TooltipTrigger>
            <Link href="/UserDashboard/profile">
              <Settings className="cursor-pointer transition-opacity hover:opacity-70" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
        <Tooltip>
          <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
            <TooltipTrigger>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Bell className="cursor-pointer transition-opacity hover:opacity-70" />
                  {/* Unread badge */}
                  {unreadCount > 0 && (
                    <span className="bg-destructive absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold text-white">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="border-b px-4 py-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary h-auto p-0 text-xs"
                        onClick={markAllAsRead}
                      >
                        Mark all as read
                      </Button>
                    )}
                  </div>
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-muted-foreground text-sm">
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`border-b px-4 py-3 transition-colors ${
                          notification.is_read
                            ? "hover:bg-muted/30 opacity-60"
                            : "bg-muted/50 hover:bg-muted"
                        }`}
                      >
                        <div className="flex gap-3">
                          <div
                            className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${
                              notification.is_read ? "" : "bg-primary"
                            }`}
                          ></div>
                          <div className="flex-1">
                            <p
                              className={`text-sm ${
                                notification.is_read ? "" : "font-medium"
                              }`}
                            >
                              {notification.title}
                            </p>
                            <p className="text-muted-foreground mt-1 text-xs">
                              {notification.message}
                            </p>
                            <p className="text-muted-foreground mt-1 text-xs">
                              {formatTimeAgo(notification.created_at)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="border-t px-4 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto w-full p-2 text-xs"
                  >
                    View all notifications
                  </Button>
                </div>
              </PopoverContent>
            </TooltipTrigger>
          </Popover>

          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>
        <div className="flex h-fit items-center gap-3 py-2">
          <Avatar>
            <AvatarImage
              src={user.avatar_url}
              alt={`${user.firstname} ${user.lastname}`}
            />
            <AvatarFallback className="bg-foreground text-background">
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
