import React from "react";
import { EventCard } from "@/components/EventCard";
import { FetchEvent } from "@/actions/events";
import { Calendar } from "lucide-react";

const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
};

export async function UpcomingEvents() {
  const events = await FetchEvent();

  return (
    <>
      {events.data?.length === 0 && (
        <div className="flex flex-col items-center justify-center px-5 py-20">
          <Calendar size={50} className="mb-5" />
          <h2 className="font-chillax mb-2 text-2xl font-semibold text-gray-800">
            No Upcoming Events
          </h2>
        </div>
      )}
      <div className="grid max-w-[95%] grid-flow-col gap-4 overflow-auto pt-5 pb-8 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-2xl [&::-webkit-scrollbar-thumb]:bg-[#62605d] [&::-webkit-scrollbar-track]:rounded-2xl [&::-webkit-scrollbar-track]:bg-[#e2dfda]">
        {events.data?.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            description={event.description}
            date={new Date(event.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            time={`${formatTime(event.starts_at)} - ${formatTime(event.ends_at)}`}
            location={event.location}
            image={`https://ogvimirljuiaxibowzul.supabase.co/storage/v1/object/public/event-pics/${event.image_url}`}
          />
        ))}
      </div>
    </>
  );
}
