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