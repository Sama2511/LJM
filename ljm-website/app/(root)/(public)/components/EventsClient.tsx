"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/EventCard";
import PublicEventDetailsSheet from "@/app/(root)/(public)/components/PublicEventDetailsSheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock } from "lucide-react";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string; // "YYYY-MM-DD"
  starts_at: string; // "HH:mm:ss" or "HH:mm"
  ends_at: string; // "HH:mm:ss" or "HH:mm"
  location: string;
  image_url: string;
};

export default function EventsClient({ events }: { events: Event[] }) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatTime = (timeString: string) => {
    const [h, m] = timeString.split(":");
    const hour = parseInt(h, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${period}`;
  };

  const isPastEvent = (event: Event) =>
    new Date(`${event.date}T${event.ends_at}`) < new Date();

  const upcomingEvents = useMemo(
    () => events.filter((e) => !isPastEvent(e)),
    [events],
  );

  const pastEvents = useMemo(
    () => events.filter((e) => isPastEvent(e)),
    [events],
  );

  return (
    <>
      <div className="font-chillax flex w-full flex-col items-center text-foreground">
      <div className="mt-15 mb-30 text-center">
        <h1 className="text-foreground mt-10 text-4xl font-medium sm:text-6xl lg:text-7xl">
          Events
        </h1>
          <p className="text-muted-foreground mt-5 max-w-[90%] text-center text-xl">
            Join us in making a difference. Explore volunteer opportunities and
            celebrate the memories we've created together.
          </p>
        </div>
       

        {/* ✅ TABS */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">
              Upcoming Events ({upcomingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Events ({pastEvents.length})
            </TabsTrigger>
          </TabsList>

          {/* UPCOMING */}
          <TabsContent value="upcoming" className="mt-6">
            {upcomingEvents.length === 0 ? (
              <div className="bg-muted/30 flex flex-col items-center justify-center rounded-2xl px-5 py-20">
                <div className="bg-muted mb-4 rounded-full p-4">
                  <Calendar size={32} className="text-muted-foreground" />
                </div>
                <h2 className="mb-2 text-2xl font-semibold">
                  No Upcoming Events
                </h2>
                <p className="text-muted-foreground text-center text-sm">
                  Check back soon for new volunteer opportunities
                </p>
              </div>
            ) : (
              <div className="[&::-webkit-scrollbar-thumb]:bg-muted-foreground [&::-webkit-scrollbar-track]:bg-muted flex gap-6 overflow-x-auto pb-8 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-2xl [&::-webkit-scrollbar-track]:rounded-2xl">
                {upcomingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    eventId={event.id}
                    title={event.title}
                    description={event.description}
                    date={formatDate(event.date)}
                    time={`${formatTime(event.starts_at)} - ${formatTime(
                      event.ends_at,
                    )}`}
                    location={event.location}
                    image={`https://ogvimirljuiaxibowzul.supabase.co/storage/v1/object/public/event-pics/${event.image_url}`}
                    isPast={false}
                    onDetails={(id) => setSelectedEventId(id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* PAST */}
          <TabsContent value="past" className="mt-6">
            {pastEvents.length === 0 ? (
              <div className="bg-muted/30 flex flex-col items-center justify-center rounded-2xl px-5 py-20">
                <div className="bg-muted mb-4 rounded-full p-4">
                  <Clock size={32} className="text-muted-foreground" />
                </div>
                <h2 className="mb-2 text-2xl font-semibold">
                  No Past Events Yet
                </h2>
                <p className="text-muted-foreground text-center text-sm">
                  Past events will appear here after they conclude
                </p>
              </div>
            ) : (
              <div className="[&::-webkit-scrollbar-thumb]:bg-muted-foreground [&::-webkit-scrollbar-track]:bg-muted flex gap-6 overflow-x-auto pb-8 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-2xl [&::-webkit-scrollbar-track]:rounded-2xl">
                {pastEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    eventId={event.id}
                    title={event.title}
                    description={event.description}
                    date={formatDate(event.date)}
                    time={`${formatTime(event.starts_at)} - ${formatTime(
                      event.ends_at,
                    )}`}
                    location={event.location}
                    image={`https://ogvimirljuiaxibowzul.supabase.co/storage/v1/object/public/event-pics/${event.image_url}`}
                    isPast={true}
                    onDetails={(id) => setSelectedEventId(id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* ✅ ONE sheet here */}
      {selectedEventId && (
        <PublicEventDetailsSheet
          eventId={selectedEventId}
          open={true}
          onOpenChange={(open) => {
            if (!open) setSelectedEventId(null);
          }}
        />
      )}
    </>
  );
}
