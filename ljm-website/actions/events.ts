"use server";

import { createClient } from "@/app/utils/server";

import { eventForm } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function CreateEvent(formData: z.infer<typeof eventForm>) {
  const supabase = await createClient();

  const { error } = await supabase.from("events").insert({
    title: formData.title,
    description: formData.description,
    date: formData.date,
    starts_at: formData.starts_at,
    ends_at: formData.ends_at,
    location: formData.location,
    image_url: formData.image_url,
    capacity: formData.capacity,
  });

  if (error) {
    console.log(error);
    return { success: false, error: error.message };
  }
  revalidatePath("/eventManagement");
  return { success: true };
}

export async function FetchEvent() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("events").select("*");

  if (error) {
    console.error("Error fetching events:", error.message);
    return { error: error.message };
  }

  return { data };
}

export async function DeleteEvent(eventId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("events").delete().eq("id", eventId);

  if (error) {
    console.log(error);
    return { success: false, error: error.message };
  }
  revalidatePath("/eventManagement");
  return { success: true };
}

export async function FetchEventForEdit(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching event:", error.message);
    return { error: error.message };
  }

  return { data };
}

