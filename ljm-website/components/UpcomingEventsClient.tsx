"use client";

import { useState } from "react";
import { EventCard } from "@/components/EventCard";
import EventDetails from "@/app/(root)/(users)/components/EventDetailsSheet";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
};

export function UpcomingEventsClient({ events }: { events: Event[] }) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  return (
    <>
      <div
        className="grid max-w-[95%] grid-flow-col gap-4 overflow-auto pt-5 pb-8
          [&::-webkit-scrollbar]:h-2
          [&::-webkit-scrollbar-thumb]:rounded-2xl
          [&::-webkit-scrollbar-thumb]:bg-primary
          [&::-webkit-scrollbar-track]:rounded-2xl
          [&::-webkit-scrollbar-track]:bg-accent/30"
      >
        {events.map((event) => (
          <EventCard
            key={event.id}
            eventId={event.id}
            title={event.title}
            description={event.description}
            date={event.date}
            time={event.time}
            location={event.location}
            image={event.image}
            isPast={false}
            onDetails={(id) => setSelectedEventId(id)}
          />
        ))}
      </div>

      {selectedEventId && (
        <EventDetails
          eventId={selectedEventId}
          open={!!selectedEventId}
          onOpenChange={(open) => !open && setSelectedEventId(null)}
        />
      )}
    </>
  );
}
