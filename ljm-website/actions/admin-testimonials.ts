"use server";

import { createClient } from "@/app/utils/server";

export async function updateTestimonialReply(id: string, reply: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("testimonials")
    .update({ reply })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
