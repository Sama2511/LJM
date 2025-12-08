import React, { Suspense } from "react";
import { PastEventCard } from "@/components/EventCard";
import { UpcomingEvents } from "@/components/UpcomingEvents";
import { FetchEvent } from "@/actions/events";
import { Calendar } from "lucide-react";
import EventLoading from "../../(admin)/components/EventLoading";

export default async function page() {
  const events = await FetchEvent();
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };
  return (
    <section className="my-10 flex w-full flex-col items-center gap-6 px-10">
      <div className="mb-10 flex flex-col items-center">
        <h1 className="text-foreground font-serif text-5xl font-bold sm:text-6xl lg:text-7xl">
          Events
        </h1>
        <h2 className="mt-5 max-w-[90%] text-center text-xl">
          Explore our collection of articles, guides, and resources to help you
          navigate end-of-life care decisions and find support during difficult
          times.
        </h2>
      </div>
      <h3 className="mt-10 text-2xl font-semibold">Upcoming Events</h3>
      <Suspense fallback={<EventLoading />}>
        <UpcomingEvents />
      </Suspense>

      {/*  */}
      {/* Past events area  */}
      {/*  */}
      <h3 className="mt-10 text-2xl font-semibold">Past Events</h3>
      {events.data?.every((event) => new Date(event.date) >= new Date()) && (
        <div className="flex flex-col items-center justify-center px-5 py-20">
          <Calendar size={50} className="mb-5" />
          <h2 className="font-chillax mb-2 text-2xl font-semibold text-gray-800">
            No past events
          </h2>
        </div>
      )}
      <div className="grid max-w-[95%] grid-flow-col gap-4 overflow-auto pb-8 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-2xl [&::-webkit-scrollbar-thumb]:bg-[#62605d] [&::-webkit-scrollbar-track]:rounded-2xl [&::-webkit-scrollbar-track]:bg-[#e2dfda]">
        {events.data
          ?.filter((event) => new Date(event.date) < new Date())
          .map((event) => (
            <PastEventCard
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
    </section>
  );
}
