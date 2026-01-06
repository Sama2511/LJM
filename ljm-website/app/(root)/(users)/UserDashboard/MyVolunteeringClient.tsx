"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import EventDetailsDrawer from "@/app/(root)/(users)/components/EventDetailsSheet";
import { cancelVolunteering } from "@/actions/my-volunteering";

const ITEMS_PER_PAGE = 5;

export default function MyVolunteeringClient({ data }: { data: any[] }) {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [ongoingPage, setOngoingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const now = new Date();

  const ongoing = useMemo(
    () => data.filter((i) => new Date(`${i.events.date}T${i.events.ends_at}`) >= now),
    [data]
  );

  const past = useMemo(
    () => data.filter((i) => new Date(`${i.events.date}T${i.events.ends_at}`) < now),
    [data]
  );

  const paginate = (items: any[], currentPage: number) => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  };

  const getTotalPages = (items: any[]) => {
    return Math.ceil(items.length / ITEMS_PER_PAGE);
  };

  async function handleCancel(requestId: string) {
    toast("Cancel this event?", {
      action: {
        label: "Yes, cancel",
        onClick: async () => {
          setLoadingId(requestId);

          const res = await cancelVolunteering(requestId);

          if (res?.error) {
            toast.error("Failed to cancel event");
          } else {
            toast.success("You have cancelled the event");
          }

          setLoadingId(null);
        },
      },
    
      cancel: {
        label: "No",
        onClick: () => {},
      },
    });
  }

  const Table = ({
    items,
    showCancel,
    showCapacity,
  }: {
    items: any[];
    showCancel: boolean;
    showCapacity: boolean;
  }) => {
    if (items.length === 0) {
      return (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground text-sm">No events found</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        {/* ширина колонок */}
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="p-4 w-[220px]">Event</th>
              <th className="w-[120px]">Date</th>
              <th className="w-[150px]">Time</th>
              <th className="w-[120px]">Location</th>
              {showCapacity && <th className="w-[180px]">Capacity</th>}
              <th className="w-[120px]" />
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const joined = item.events.volunteer_requests?.[0]?.count ?? 0;
              const max = item.events.capacity ?? 0;
              const percent = max > 0 ? Math.min((joined / max) * 100, 100) : 0;

              return (
                <tr key={item.id} className="border-b align-middle">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <Image
                        src={`https://ogvimirljuiaxibowzul.supabase.co/storage/v1/object/public/event-pics/${item.events.image_url}`}
                        alt=""
                        width={56}
                        height={56}
                        className="rounded-lg object-cover"
                      />
                      <span className="font-medium truncate">{item.events.title}</span>
                    </div>
                  </td>

                  <td className="truncate">{item.events.date}</td>
                  <td className="truncate">
                    {item.events.starts_at} – {item.events.ends_at}
                  </td>
                  <td className="truncate">{item.events.location}</td>

                  {showCapacity && (
                    <td>
                      <div className="text-xs mb-1">
                        {joined}/{max}
                      </div>

                      {/* просто коротше — max-w */}
                      <div className="h-2 max-w-[120px] rounded-full bg-green-100">
                        <div
                          className="h-2 rounded-full bg-green-600"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </td>
                  )}

                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedEvent(item.events)}
                      >
                        Details
                      </Button>

                      {showCancel && (
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={loadingId === item.id}
                          onClick={() => handleCancel(item.id)}
                        >
                          {loadingId === item.id ? "Cancelling..." : "Cancel"}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const currentPage = activeTab === "ongoing" ? ongoingPage : pastPage;
  const currentItems = activeTab === "ongoing" ? ongoing : past;
  const totalPages = getTotalPages(currentItems);
  const paginatedItems = paginate(currentItems, currentPage);

  const handlePrevious = () => {
    if (activeTab === "ongoing") {
      setOngoingPage((p) => Math.max(1, p - 1));
    } else {
      setPastPage((p) => Math.max(1, p - 1));
    }
  };

  const handleNext = () => {
    if (activeTab === "ongoing") {
      setOngoingPage((p) => Math.min(totalPages, p + 1));
    } else {
      setPastPage((p) => Math.min(totalPages, p + 1));
    }
  };

  return (
    <>
      <Tabs defaultValue="ongoing" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="ongoing">
          <Table items={paginatedItems} showCancel showCapacity />
        </TabsContent>

        <TabsContent value="past">
          <Table items={paginatedItems} showCancel={false} showCapacity={false} />
        </TabsContent>
      </Tabs>

      {currentItems.length > ITEMS_PER_PAGE && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePrevious}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="text-sm text-muted-foreground px-4">
                Page {currentPage} of {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={handleNext}
                className={
                  currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

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