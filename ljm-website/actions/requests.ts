"use server";

import { createClient } from "@/app/utils/server";

const volunteerSelect = `
  *,
  users!inner(id, firstname, lastname, email, avatar_url),
  events!inner(id, title, date)
`;

export async function FetchPendingrequests(searchQuery?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("volunteer_form")
    .select(volunteerSelect)
    .eq("status", "Pending");

  if (searchQuery) {
    query = query.or(
      `firstname.ilike.%${searchQuery}%,lastname.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`,
      { foreignTable: "users" }
    );
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return { error: error.message };
  return { data };
}

export async function FetchAcceptedrequests(searchQuery?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("volunteer_form")
    .select(volunteerSelect)
    .eq("status", "Approved");

  if (searchQuery) {
    query = query.or(
      `firstname.ilike.%${searchQuery}%,lastname.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`,
      { foreignTable: "users" }
    );
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return { error: error.message };
  return { data };
}

export async function FetchRejectedrequests(searchQuery?: string) {
  const supabase = await createClient();
  let query = supabase
    .from("volunteer_form")
    .select(volunteerSelect)
    .eq("status", "Rejected");

  if (searchQuery) {
    query = query.or(
      `firstname.ilike.%${searchQuery}%,lastname.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`,
      { foreignTable: "users" }
    );
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return { error: error.message };
  return { data };
}

/* ------------------------------------------------------------------
   ✅ NEW: Fetch ALL volunteer requests (used for event-based grouping)
------------------------------------------------------------------- */

/* ------------------------------------------------------------------
   ✅ NEW: Fetch ALL volunteer requests (for event-based grouping)
------------------------------------------------------------------- */
export async function FetchAllVolunteerRequests(searchQuery?: string) {
  const supabase = await createClient();

  const volunteerSelect = `
    *,
    users!inner(id, firstname, lastname, email, avatar_url),
    events!inner(id, title, date)
  `;

  let query = supabase.from("volunteer_form").select(volunteerSelect);

  if (searchQuery) {
    query = query.or(
      `firstname.ilike.%${searchQuery}%,lastname.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`,
      { foreignTable: "users" }
    );
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return { data };
}

