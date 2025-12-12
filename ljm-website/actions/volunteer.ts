"use server";

import { createClient } from "@/app/utils/server";

export async function RequestToVolunteer(eventId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Not authenticated" };
  }

  const { error } = await supabase.from("volunteer_requests").insert({
    event_id: eventId,
    user_id: user.id,
  });

  if (error) return { success: false, message: error.message };

  return { success: true };
}

export async function VolunteerCapacity() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("approved_events").select("*");

  if (error) {
    console.error("Error fetching volunteer capacity:", error.message);
    return { error: error.message };
  }

  return { data };
}

export async function GetUserVolunteerRequests(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("volunteer_requests")
    .select("event_id, status")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user volunteer requests:", error.message);
    return { error: error.message };
  }

  return { data };
}
