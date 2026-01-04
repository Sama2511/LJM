"use server";

import { createClient } from "@/app/utils/server";

import { eventForm } from "@/lib/schemas";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function CreateEvent(formData: z.infer<typeof eventForm>) {
  const supabase = await createClient();

  const { data: newEvent, error } = await supabase
    .from("events")
    .insert({
      title: formData.title,
      description: formData.description,
      date: formData.date,
      starts_at: formData.starts_at,
      ends_at: formData.ends_at,
      location: formData.location,
      image_url: formData.image_url,
      capacity: formData.capacity,
    })
    .select()
    .single();

  if (error) {
    console.log(error);
    return { success: false, error: error.message };
  }

  const { error: notifError } = await supabase.from("notifications").insert({
    type: "event_created",
    title: "New Event Available",
    message: `${formData.title} is now open for volunteers`,
    reference_type: "event",
    reference_id: newEvent.id,
    user_id: null,
  });

  if (notifError) {
    console.log(notifError);
  }

  revalidatePath("/eventManagement");
  return { success: true };
}

export async function FetchEvent() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching events:", error.message);
    return { error: error.message };
  }

  return { data };
}

export async function DeleteEvent(eventId: string) {
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("title")
    .eq("id", eventId)
    .single();

  const { data: volunteers } = await supabase
    .from("volunteer_requests")
    .select("user_id")
    .eq("event_id", eventId)
    .eq("status", "approved");

  if (volunteers && volunteers.length > 0 && event) {
    const notifications = volunteers.map((volunteer) => ({
      type: "event_cancelled",
      title: "Event Cancelled",
      message: `${event.title} has been cancelled`,
      reference_type: "event",
      reference_id: null,
      user_id: volunteer.user_id,
    }));

    await supabase.from("notifications").insert(notifications);
  }

  await supabase.from("volunteer_requests").delete().eq("event_id", eventId);

  await supabase
    .from("notifications")
    .update({ reference_id: null })
    .eq("reference_type", "event")
    .eq("reference_id", eventId);

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

export async function UpdateEvent(
  eventId: string,
  formData: z.infer<typeof eventForm>,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("events")
    .update({
      title: formData.title,
      description: formData.description,
      date: formData.date,
      starts_at: formData.starts_at,
      ends_at: formData.ends_at,
      location: formData.location,
      image_url: formData.image_url,
      capacity: formData.capacity,
    })
    .eq("id", eventId);

  if (error) {
    console.log(error);
    return { success: false, error: error.message };
  }

  const { data: volunteers } = await supabase
    .from("volunteer_requests")
    .select("user_id")
    .eq("event_id", eventId)
    .eq("status", "approved");

  if (volunteers && volunteers.length > 0) {
    const notifications = volunteers.map((volunteer) => ({
      type: "event_updated",
      title: "Event Updated",
      message: `${formData.title} has been updated. Please check the new details.`,
      reference_type: "event",
      reference_id: eventId,
      user_id: volunteer.user_id,
    }));

    await supabase.from("notifications").insert(notifications);
  }

  revalidatePath("/eventManagement");
  return { success: true };
}
