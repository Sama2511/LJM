"use server";

import { createClient } from "@/app/utils/server";
import { revalidatePath } from "next/cache";

export async function updateTestimonialReply(id: string, reply: string) {
  const supabase = await createClient();

  // Validate input
  if (!id || !reply.trim()) {
    throw new Error("Testimonial ID and reply are required");
  }

  const { error } = await supabase
    .from("testimonials")
    .update({ reply: reply.trim() })
    .eq("id", id);

  if (error) {
    console.error("Error updating testimonial reply:", error);
    throw new Error(error.message);
  }

  // Revalidate the testimonials page to show updated data
  revalidatePath("/admin/UserTestimonialsManagement");
  
  return { success: true };
}