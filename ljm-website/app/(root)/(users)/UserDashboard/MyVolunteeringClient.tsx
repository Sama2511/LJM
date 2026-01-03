"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import StatusBadge from "@/app/(root)/(users)/components/StatusBadge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import EventDetailsDrawer from "@/app/(root)/(users)/components//EventDetailsSheet";

const ITEMS_PER_PAGE = 6;

export default function MyVolunteeringClient({ data }: { data: any[] }) {
  const [page, setPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const now = new Date();

  const ongoing = useMemo(
    () =>
      data.filter(
        (i) =>
          new Date(`${i.events.date}T${i.events.ends_at}`) >= now
      ),
    [data]
  );

  const past = useMemo(
    () =>
      data.filter(
        (i) =>
          new Date(`${i.events.date}T${i.events.ends_at}`) < now
      ),
    [data]
  );

  const paginate = (items: any[]) => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  };

  const Table = ({ items }: { items: any[] }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            <th className="p-3">Event</th>
            <th>Date</th>
            <th>Time</th>
            <th>Location</th>
            <th>Capacity</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="flex items-center gap-3 p-3">
                <Image
                  src={`https://ogvimirljuiaxibowzul.supabase.co/storage/v1/object/public/event-pics/${item.events.image_url}`}
                  alt=""
                  width={48}
                  height={48}
                  className="rounded-lg object-cover"
                />
                <span className="font-medium">
                  {item.events.title}
                </span>
              </td>
              <td>{item.events.date}</td>
              <td>
                {item.events.starts_at} – {item.events.ends_at}
              </td>
              <td>{item.events.location}</td>
              <td>
                {item.events.current_capacity}/
                {item.events.capacity}
              </td>
              <td>
                <StatusBadge status={item.status} />
              </td>
              <td>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedEvent(item.events)}
                >
                  Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <Tabs defaultValue="ongoing">
        <TabsList>
          <TabsTrigger value="ongoing">
            Ongoing
          </TabsTrigger>
          <TabsTrigger value="past">
            Past
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ongoing">
          <Table items={paginate(ongoing)} />
        </TabsContent>

        <TabsContent value="past">
          <Table items={paginate(past)} />
        </TabsContent>
      </Tabs>

      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                setPage((p) => Math.max(1, p - 1))
              }
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => p + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {selectedEvent && (
        <EventDetailsDrawer
          open={!!selectedEvent}
          onOpenChange={() => setSelectedEvent(null)}
          eventId={selectedEvent.id}
        />
      )}
    </>
  );
}