"use server";

import { createClient, getUser } from "@/app/utils/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Get all volunteering requests for current user
 */
export async function GetMyVolunteering() {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    redirect("/error");
  }

  const { data, error } = await supabase
    .from("volunteer_requests")
    .select(`
      id,
      status,
      created_at,
      role_id,
      event_roles (
        role_name
      ),
      events (
        id,
        title,
        date,
        location,
        starts_at,
        ends_at,
        image_url,
        capacity,
        volunteer_requests(count)
      )
    `)
    .eq("user_id", user.id)
    .neq("status", "cancelled")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GetMyVolunteering error:", error.message);
    redirect("/error");
  }

  return { data };
}

/**
 * Cancel volunteering request (by volunteer)
 */
export async function cancelVolunteering(requestId: string) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("volunteer_requests")
    .delete()
    .eq("id", requestId)
    .eq("user_id", user.id)

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/UserDashboard/volunteering");

  return { success: true };
}