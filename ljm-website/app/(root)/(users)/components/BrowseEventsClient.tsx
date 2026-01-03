"use client";

import { useMemo } from "react";
import VolunteerEventCard from "@/app/(root)/(users)/components/VolunteerEventCard";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type Props = {
  events: any[];
  capacities: any[];
  userRequests: any[];
};

export default function BrowseEventsClient({
  events,
  capacities,
  userRequests,
}: Props) {
  const now = new Date();

  const ongoing = useMemo(
    () =>
      events.filter(
        (event) =>
          new Date(`${event.date}T${event.ends_at}`) >= now
      ),
    [events]
  );

  const past = useMemo(
    () =>
      events.filter(
        (event) =>
          new Date(`${event.date}T${event.ends_at}`) < now
      ),
    [events]
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatTime = (timeString: string) => {
    const [h, m] = timeString.split(":");
    const hour = parseInt(h);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${period}`;
  };

  const renderCards = (items: any[], isPast = false) => (
    <div className="flex flex-wrap gap-8">
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No events to display.
        </p>
      )}

      {items.map((event) => {
        const joined =
          capacities.find((c) => c.event_id === event.id)?.capacity ?? 0;

        const hasRequested = userRequests.some(
          (req) => req.event_id === event.id
        );

        return (
          <VolunteerEventCard
            key={event.id}
            id={event.id}
            title={event.title}
            description={event.description}
            date={formatDate(event.date)}
            time={`${formatTime(event.starts_at)} - ${formatTime(
              event.ends_at
            )}`}
            location={event.location}
            image={`https://ogvimirljuiaxibowzul.supabase.co/storage/v1/object/public/event-pics/${event.image_url}`}
            capacity={joined}
            maxCapacity={event.capacity}
            hasRequested={hasRequested}
            hideCapacity={isPast}
            hideJoinButton={isPast}
          />
        );
      })}
    </div>
  );

  return (
    <Tabs defaultValue="ongoing">
      <TabsList>
        <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>

      <TabsContent value="ongoing">
        {renderCards(ongoing, false)}
      </TabsContent>

      <TabsContent value="past">
        {renderCards(past, true)}
      </TabsContent>
    </Tabs>
  );
}