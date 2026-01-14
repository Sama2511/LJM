"use server";

import { createClient } from "@/app/utils/server";

export type DashboardStats = {
  totalEvents: number;
  upcomingEvents: number;
  totalVolunteers: number;
  pendingApplications: number;
  totalArticles: number;
  totalDocuments: number;
};

export type RecentApplication = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  status: string;
  created_at: string;
};

export type UpcomingEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  capacity: number;
  current_signups: number;
};

export type RecentVolunteer = {
  id: string;
  user_id: string;
  event_id: string;
  created_at: string;
  users: {
    firstname: string;
    lastname: string;
  };
  events: {
    title: string;
  };
};

export async function FetchDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  // Fetch all counts in parallel
  const [
    eventsResult,
    upcomingEventsResult,
    volunteersResult,
    pendingResult,
    articlesResult,
    documentsResult,
  ] = await Promise.all([
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .gte("date", now.split("T")[0]),
    supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "crew"),
    supabase
      .from("volunteer_form")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("documents").select("*", { count: "exact", head: true }),
  ]);

  return {
    totalEvents: eventsResult.count || 0,
    upcomingEvents: upcomingEventsResult.count || 0,
    totalVolunteers: volunteersResult.count || 0,
    pendingApplications: pendingResult.count || 0,
    totalArticles: articlesResult.count || 0,
    totalDocuments: documentsResult.count || 0,
  };
}

export async function FetchRecentApplications(): Promise<RecentApplication[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("volunteer_form")
    .select("id, firstname, lastname, email, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching recent applications:", error.message);
    return [];
  }

  return data || [];
}

export async function FetchUpcomingEvents(): Promise<UpcomingEvent[]> {
  const supabase = await createClient();
  const now = new Date().toISOString().split("T")[0];

  const { data: events, error } = await supabase
    .from("events")
    .select("id, title, date, time, capacity")
    .gte("date", now)
    .order("date", { ascending: true })
    .limit(5);

  if (error) {
    console.error("Error fetching upcoming events:", error.message);
    return [];
  }

  // Get signup counts for each event
  const eventsWithSignups = await Promise.all(
    (events || []).map(async (event) => {
      const { count } = await supabase
        .from("volunteer_requests")
        .select("*", { count: "exact", head: true })
        .eq("event_id", event.id)
        .eq("status", "approved");

      return {
        ...event,
        current_signups: count || 0,
      };
    })
  );

  return eventsWithSignups;
}

export async function FetchRecentVolunteers(): Promise<RecentVolunteer[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("volunteer_requests")
    .select(
      `
      id,
      user_id,
      event_id,
      created_at,
      users (firstname, lastname),
      events (title)
    `
    )
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching recent volunteers:", error.message);
    return [];
  }

  return (data as unknown as RecentVolunteer[]) || [];
}
