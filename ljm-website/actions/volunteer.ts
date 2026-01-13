"use server";

import { createClient } from "@/app/utils/server";

export async function JoinEvent(eventId: string, roleId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Not authenticated" };
  }

  const { data: role } = await supabase
    .from("event_roles")
    .select("capacity")
    .eq("id", roleId)
    .single();

  if (!role) {
    return { success: false, message: "Role not found" };
  }

  const { count } = await supabase
    .from("volunteer_requests")
    .select("*", { count: "exact", head: true })
    .eq("role_id", roleId)
    .eq("status", "approved");

  if (count !== null && count >= role.capacity) {
    return { success: false, message: "This role is full" };
  }

  const { error } = await supabase.from("volunteer_requests").insert({
    event_id: eventId,
    user_id: user.id,
    role_id: roleId,
    status: "approved",
  });

  if (error) return { success: false, message: error.message };

  return { success: true };
}

export async function GetEventRolesWithCapacity(eventId: string) {
  const supabase = await createClient();

  const { data: roles, error: rolesError } = await supabase
    .from("event_roles")
    .select("id, role_name, capacity")
    .eq("event_id", eventId);

  if (rolesError) {
    return { error: rolesError.message };
  }

  const { data: counts, error: countsError } = await supabase
    .from("volunteer_requests")
    .select("role_id")
    .eq("event_id", eventId)
    .eq("status", "approved");

  if (countsError) {
    return { error: countsError.message };
  }

  const roleCounts: Record<string, number> = {};
  counts?.forEach((req) => {
    if (req.role_id) {
      roleCounts[req.role_id] = (roleCounts[req.role_id] || 0) + 1;
    }
  });

  const rolesWithCapacity = roles?.map((role) => ({
    ...role,
    filled: roleCounts[role.id] || 0,
    available: role.capacity - (roleCounts[role.id] || 0),
  }));

  return { data: rolesWithCapacity };
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

export async function GetEventVolunteers(eventId: string) {
  const supabase = await createClient();

  // First get volunteer requests with roles
  const { data: requests, error: requestsError } = await supabase
    .from("volunteer_requests")
    .select(
      `
      id,
      status,
      created_at,
      user_id,
      role_id,
      event_roles:role_id (
        id,
        role_name
      )
    `,
    )
    .eq("event_id", eventId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (requestsError) {
    console.error("Error fetching event volunteers:", requestsError.message);
    return { error: requestsError.message };
  }

  if (!requests || requests.length === 0) {
    return { data: [] };
  }

  // Get unique user IDs
  const userIds = [...new Set(requests.map((r) => r.user_id))];

  // Fetch user details from users table
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id, firstname, lastname, email, avatar_url")
    .in("id", userIds);

  if (usersError) {
    console.error("Error fetching user details:", usersError.message);
    return { error: usersError.message };
  }

  // Create a map for quick user lookup
  const userMap = new Map(users?.map((u) => [u.id, u]));

  // Combine the data
  const data = requests.map((request) => ({
    ...request,
    users: userMap.get(request.user_id) || {
      id: request.user_id,
      firstname: "Unknown",
      lastname: "User",
      email: "",
      avatar_url: null,
    },
  }));

  return { data };
}

export async function RemoveVolunteerFromEvent(
  requestId: string,
  eventTitle: string,
) {
  const supabase = await createClient();

  const { data: request } = await supabase
    .from("volunteer_requests")
    .select(
      `
      user_id,
      event_id,
      events:event_id (title)
    `,
    )
    .eq("id", requestId)
    .single();

  if (!request) {
    return { error: "Volunteer request not found" };
  }

  // Delete the volunteer request
  const { error } = await supabase
    .from("volunteer_requests")
    .delete()
    .eq("id", requestId);

  if (error) {
    console.error("Error removing volunteer:", error.message);
    return { error: error.message };
  }

  // Send notification to the user
  await supabase.from("notifications").insert({
    type: "removed_from_event",
    title: "Removed from Event",
    message: `You have been removed from the event "${eventTitle}" by an administrator. Please contact us if you have any questions.`,
    reference_type: "event",
    reference_id: request.event_id,
    user_id: request.user_id,
  });

  return { success: true };
}
