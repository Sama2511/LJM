"use server";

import { createClient } from "@/app/utils/server";
import { revalidatePath } from "next/cache";

export interface Testimonial {
  id: string;
  user_id: string;
  event_id: string;
  event_title: string;
  comment: string;
  reply?: string | null;
  created_at: string;
}

export async function submitTestimonial({
  eventId,
  eventTitle,
  comment,
}: {
  eventId: string;
  eventTitle: string;
  comment: string;
}) {
  const supabase = await createClient();

  if (!comment || comment.length < 10) {
    throw new Error("Testimonial must be at least 10 characters");
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) throw new Error("User not authenticated");

  const { error } = await supabase.from("testimonials").insert({
    user_id: user.id,
    event_id: eventId,
    event_title: eventTitle,
    comment,
  });

  if (error) throw error;

  revalidatePath("/UserDashboard");
  revalidatePath("/dashboard/UserTestimonialsManagement");
}

export async function getUserTestimonials() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) return [];

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Testimonial[];
}
