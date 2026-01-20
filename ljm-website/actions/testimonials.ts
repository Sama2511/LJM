// actions/testimonials.ts
"use client"; // we can call this from client components

import { createClient } from "@/app/utils/server"; // server-side Supabase client

export interface Testimonial {
  id: string;
  user_id: string;
  event_id: string;
  event_title: string;
  comment: string;
  reply?: string | null;
  created_at: string;
}

// -----------------------------
// Submit a new testimonial
// -----------------------------
export async function submitTestimonial(params: {
  eventId: string;
  eventTitle: string;
  comment: string;
}) {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) throw new Error("User not authenticated");

  const { data: insertedTestimonial, error } = await supabase
    .from("testimonials")
    .insert({
      user_id: user.id,
      event_id: params.eventId,
      event_title: params.eventTitle,
      comment: params.comment,
    })
    .select()
    .single();

  if (error) throw error;

  return insertedTestimonial as Testimonial;
}

// -----------------------------
// Fetch all testimonials for the logged-in user
// -----------------------------
export async function getUserTestimonials() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) return [];

  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return testimonials as Testimonial[];
}
