"use server";

import { createClient } from "@/app/utils/server";
import { revalidatePath } from "next/cache";

export async function FetchCrew() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .in("role", ["kindler", "kindling", "flame", "flamekeeper"]);
  if (error) {
    console.error("Error fetching crew members:", error.message);
    return { error: error.message };
  }
  return { data };
}

export async function fetchAdmins() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .in("role", ["admin"]);
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
  const { data, error } = await supabase
    .from("users")
    .update({ role: "admin" })
    .eq("id", id)
    .select();
  if (error) {
    console.error("Error updating role:", error.message);
    return { success: false, error: error.message };
  }
  revalidatePath("/dashboard/user-management");
  return { success: true, data };
}

export async function RemoveAdminPrivileges(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update({ role: "kindling" })
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
