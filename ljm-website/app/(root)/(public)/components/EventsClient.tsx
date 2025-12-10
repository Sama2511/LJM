"use client";

import React from "react";
import { PastEventCard, EventCard } from "@/components/EventCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock } from "lucide-react";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  starts_at: string;
  ends_at: string;
  location: string;
  image_url: string;
};

type EventsClientProps = {
  events: Event[];
};

const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getEventEndDate = (event: Event) => {
  return new Date(`${event.date}T${event.ends_at}`);
};

export default function EventsClient({ events }: EventsClientProps) {
  const upcomingEvents = events.filter(
    (event) => getEventEndDate(event) >= new Date(),
  );

  const pastEvents = events.filter(
    (event) => new Date(event.date) < new Date(),
  );

  return (
    <div className="w-full px-6 md:px-10">
      <div className="mb-10 flex flex-col items-center">
        <h1 className="text-foreground font-serif text-5xl font-bold sm:text-6xl lg:text-7xl">
          Events
        </h1>
        <p className="text-muted-foreground mt-5 max-w-[90%] text-center text-xl">
          Join us in making a difference. Explore volunteer opportunities and
          celebrate the memories we've created together.
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">
            Upcoming Events ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past Events ({pastEvents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingEvents.length === 0 ? (
            <div className="bg-muted/30 flex flex-col items-center justify-center rounded-2xl px-5 py-20">
              <div className="bg-muted mb-4 rounded-full p-4">
                <Calendar size={32} className="text-muted-foreground" />
              </div>
              <h2 className="font-chillax mb-2 text-2xl font-semibold">
                No Upcoming Events
              </h2>
              <p className="text-muted-foreground text-center text-sm">
                Check back soon for new volunteer opportunities
              </p>
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-8 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-2xl [&::-webkit-scrollbar-thumb]:bg-[#62605d] [&::-webkit-scrollbar-track]:rounded-2xl [&::-webkit-scrollbar-track]:bg-[#e2dfda]">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  date={formatDate(event.date)}
                  time={`${formatTime(event.starts_at)} - ${formatTime(event.ends_at)}`}
                  location={event.location}
                  image={`https://ogvimirljuiaxibowzul.supabase.co/storage/v1/object/public/event-pics/${event.image_url}`}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {pastEvents.length === 0 ? (
            <div className="bg-muted/30 flex flex-col items-center justify-center rounded-2xl px-5 py-20">
              <div className="bg-muted mb-4 rounded-full p-4">
                <Clock size={32} className="text-muted-foreground" />
              </div>
              <h2 className="font-chillax mb-2 text-2xl font-semibold">
                No Past Events Yet
              </h2>
              <p className="text-muted-foreground text-center text-sm">
                Past events will appear here after they conclude
              </p>
            </div>
          ) : (
            <div className="flex gap-6 overflow-x-auto pb-8 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-2xl [&::-webkit-scrollbar-thumb]:bg-[#62605d] [&::-webkit-scrollbar-track]:rounded-2xl [&::-webkit-scrollbar-track]:bg-[#e2dfda]">
              {pastEvents.map((event) => (
                <PastEventCard
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  date={formatDate(event.date)}
                  time={`${formatTime(event.starts_at)} - ${formatTime(event.ends_at)}`}
                  location={event.location}
                  image={`https://ogvimirljuiaxibowzul.supabase.co/storage/v1/object/public/event-pics/${event.image_url}`}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
