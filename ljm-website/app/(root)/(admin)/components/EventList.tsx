import { FetchEvent } from "@/actions/events";
import { Calendar } from "lucide-react";
import React from "react";
import { VolunteerCapacity } from "@/actions/volunteer";
import { createClient } from "@/app/utils/server";
import PaginatedEventGrid from "./PaginatedEventGrid";

export default async function EventList() {
  const supabase = await createClient();
  const eventsData = await FetchEvent();
  const capacityData = await VolunteerCapacity();

  const { data: rolesData } = await supabase.from("event_roles").select("*");

  await new Promise((resolve) => setTimeout(resolve, 2000));
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  const events =
    eventsData.data?.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: formatDate(event.date),
      time: `${formatTime(event.starts_at)} - ${formatTime(event.ends_at)}`,
      location: event.location,
      image: `https://ogvimirljuiaxibowzul.supabase.co/storage/v1/object/public/event-pics/${event.image_url}`,
      maxCapacity: event.capacity,
      capacity:
        capacityData.data?.find((ev) => ev.event_id === event.id)?.capacity ||
        0,
      roles: rolesData?.filter((role) => role.event_id === event.id) || [],
    })) || [];

  return (
    <div>
      {events.length === 0 && (
        <div className="flex flex-col items-center justify-center px-5 py-20">
          <Calendar size={50} className="mb-5" />
          <h2 className="font-chillax text-foreground mb-2 text-2xl font-semibold">
            No Events Created Yet
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md text-center">
            Click the button above to add event details and share them with your
            community.
          </p>
        </div>
      )}
      {events.length > 0 && <PaginatedEventGrid events={events} />}
    </div>
  );
}
