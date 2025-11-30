import React from "react";
import EventForm from "../../components/dashboardNav/EventForm";
import { FetchEvent } from "@/actions/events";
import EventMngtCard from "../../components/ui/DashEventCard";

export default async function page() {
  const eventsData = await FetchEvent();
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
    <div className="w-full">
      <div className="flex justify-between pt-15 pr-10">
        <h1 className="font-chillax text-3xl font-semibold">
          Event Management
        </h1>
        <EventForm />
      </div>
      <div className="grid grid-cols-4 gap-10 px-5 py-10">
        {eventsData.data?.map((event, index) => (
          <EventMngtCard
            key={index}
            title={event.title}
            description={event.description}
            date={formatDate(event.date)}
            time={`${formatTime(event.starts_at)} - ${formatTime(event.ends_at)}`}
            location={event.location}
            image={`https://ogvimirljuiaxibowzul.supabase.co/storage/v1/object/public/event-pics/${event.image_url}`}
            maxCapacity={event.capacity}
            capacity={2}
          />
        ))}
      </div>
    </div>
  );
}
