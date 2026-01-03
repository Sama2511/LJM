"use server";

import { createClient } from "@/app/utils/server";
import { revalidatePath } from "next/cache";

export async function FetchCrew(searchQuery?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("users")
    .select("*")
    .in("role", ["Kindler", "Kindling", "Flame", "Fire-keepers"]);

  if (searchQuery) {
    query = query.or(
      `firstname.ilike.%${searchQuery}%,lastname.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`,
    );
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching crew members:", error.message);
    return { error: error.message };
  }
  return { data };
}

export async function fetchAdmins(searchQuery?: string) {
  const supabase = await createClient();
  let query = supabase.from("users").select("*").in("role", ["admin"]);

  if (searchQuery) {
    query = query.or(
      `firstname.ilike.%${searchQuery}%,lastname.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`,
    );
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching admin:", error.message);
    return { error: error.message };
  }
  return { data };
}

export async function UpdateUserRole(id: string, newRole: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update({ role: newRole })
    .eq("id", id)
    .select();
  if (error) {
    console.error("Error updating role:", error.message);
    return { success: false, error: error.message };
  }
  revalidatePath("/dashboard/user-management");
  return { success: true, data };
}

export async function MakeUserAdmin(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("users")
    .update({ role: "admin" })
    .eq("id", id);
  if (error) {
    console.error("Error updating role:", error.message);
    return { success: false, error: error.message };
  }
  revalidatePath("/dashboard/user-management");
  return { success: true };
}

export async function RemoveAdminPrivileges(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update({ role: "Kindling" })
    .eq("id", id)
    .select();
  if (error) {
    console.error("Error updating role:", error.message);
    return { success: false, error: error.message };
  }
  revalidatePath("/dashboard/user-management");
  return { success: true, data };
}

export async function BanUser(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update({ status: "banned" })
    .eq("id", id)
    .select();
  if (error) {
    console.error("Error banning user:", error.message);
    return { success: false, error: error.message };
  }
  revalidatePath("/dashboard/user-management");
  return { success: true, data };
}

export async function DeleteUser(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) {
    console.error("Error deleting user:", error.message);
    return { success: false, error: error.message };
  }
  revalidatePath("/dashboard/user-management");
  return { success: true };
}

export async function FetchVolunteerForm(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("volunteer_form")
    .select(
      `
      *,
      users!inner(*)
      `,
    )
    .eq("user_id", userId)
    .single();
  if (error) {
    console.error("Error fetching volunteer form:", error.message);
    return { error: error.message };
  }
  return { data };
}

export async function FetchPendingApplications(searchQuery?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("volunteer_form")
    .select(
      `
      *,
      users!inner(id, firstname, lastname, email, avatar_url, created_at)
      `,
    )
    .eq("status", "Pending");

  if (searchQuery) {
    query = query.or(
      `firstname.ilike.%${searchQuery}%,lastname.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`,
      { foreignTable: "users" },
    );
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching pending applications:", error.message);
    return { error: error.message };
  }
  return { data };
}

export async function FetchAcceptedApplications(searchQuery?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("volunteer_form")
    .select(
      `
      *,
      users!inner(id, firstname, lastname, email, avatar_url, created_at)
      `,
    )
    .eq("status", "Approved");

  if (searchQuery) {
    query = query.or(
      `firstname.ilike.%${searchQuery}%,lastname.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`,
      { foreignTable: "users" },
    );
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching accepted applications:", error.message);
    return { error: error.message };
  }
  return { data };
}

export async function FetchRejectedApplications(searchQuery?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("volunteer_form")
    .select(
      `
      *,
      users!inner(id, firstname, lastname, email, avatar_url, created_at)
      `,
    )
    .eq("status", "Rejected");

  if (searchQuery) {
    query = query.or(
      `firstname.ilike.%${searchQuery}%,lastname.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`,
      { foreignTable: "users" },
    );
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching rejected applications:", error.message);
    return { error: error.message };
  }
  return { data };
}
