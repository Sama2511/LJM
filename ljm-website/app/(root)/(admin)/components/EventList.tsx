import { FetchEvent } from "@/actions/events";
import { Calendar } from "lucide-react";
import React from "react";
import EventMngtCard from "./DashEventCard";
import {
  GetUserVolunteerRequests,
  VolunteerCapacity,
} from "@/actions/volunteer";
import { getUser } from "@/app/utils/server";

export default async function EventList() {
  const eventsData = await FetchEvent();
  const capacityData = await VolunteerCapacity();

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
  return (
    <div>
      {eventsData.data?.length === 0 && (
        <div className="flex flex-col items-center justify-center px-5 py-20">
          <Calendar size={50} className="mb-5" />
          <h2 className="font-chillax mb-2 text-2xl font-semibold text-gray-800">
            No Events Created Yet
          </h2>
          <p className="mb-6 max-w-md text-center text-gray-600">
            Click the button above to add event details and share them with your
            community.
          </p>
        </div>
      )}
      <div className="flex flex-wrap justify-center gap-10 py-10 pr-5 md:pl-5 @[830]:justify-start">
        {eventsData.data?.map((event) => (
          <EventMngtCard
            key={event.id}
            title={event.title}
            description={event.description}
            date={formatDate(event.date)}
            time={`${formatTime(event.starts_at)} - ${formatTime(event.ends_at)}`}
            location={event.location}
            image={`https://ogvimirljuiaxibowzul.supabase.co/storage/v1/object/public/event-pics/${event.image_url}`}
            maxCapacity={event.capacity}
            capacity={
              capacityData.data?.find((ev) => ev.event_id === event.id)
                ?.capacity || 0
            }
            id={event.id}
          />
        ))}
      </div>
    </div>
  );
}
