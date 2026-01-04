"use server";

import { createClient } from "@/app/utils/server";

export async function JoinEvent(eventId: string) {
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
    status: "approved",
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

export async function ApproveApplication(formId: string) {
  const supabase = await createClient();

  const { data: application } = await supabase
    .from("volunteer_form")
    .select("user_id")
    .eq("id", formId)
    .single();

  const { error } = await supabase
    .from("volunteer_form")
    .update({ status: "Approved" })
    .eq("id", formId);

  if (error) {
    console.error("Error approving application:", error.message);
    return { error: error.message };
  }

  if (application) {
    await supabase.from("notifications").insert({
      type: "application_approved",
      title: "Crew Application Approved",
      message:
        "Congratulations! Your crew application has been approved. Welcome to the team!",
      reference_type: "application",
      reference_id: formId,
      user_id: application.user_id,
    });
  }

  return { success: true };
}

export async function RejectApplication(formId: string) {
  const supabase = await createClient();

  const { data: application } = await supabase
    .from("volunteer_form")
    .select("user_id")
    .eq("id", formId)
    .single();

  const { error } = await supabase
    .from("volunteer_form")
    .update({ status: "Rejected" })
    .eq("id", formId);

  if (error) {
    console.error("Error rejecting application:", error.message);
    return { error: error.message };
  }

  if (application) {
    await supabase.from("notifications").insert({
      type: "application_rejected",
      title: "Crew Application Update",
      message:
        "Thank you for your interest. Unfortunately, your crew application was not approved at this time.",
      reference_type: "application",
      reference_id: formId,
      user_id: application.user_id,
    });
  }

  return { success: true };
}
