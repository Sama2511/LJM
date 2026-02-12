"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/app/utils/client";

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

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

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

  const refreshNotifications = async () => {
    if (user) {
      await loadNotifications(user.id);
    }
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

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        notifications,
        unreadCount,
        markAllAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
