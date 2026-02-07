"use client";

import { useMemo, useState } from "react";
import VolunteerEventCard from "@/app/(root)/(users)/components/VolunteerEventCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

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
  const ITEMS_PER_PAGE = 6;
  const [ongoingPage, setOngoingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);

  const ongoing = useMemo(
    () =>
      events.filter(
        (event) => new Date(`${event.date}T${event.ends_at}`) >= now,
      ),
    [events],
  );

  const past = useMemo(
    () =>
      events.filter(
        (event) => new Date(`${event.date}T${event.ends_at}`) < now,
      ),
    [events],
  );

  const getPageNumbers = (currentPage: number, totalPages: number) => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  const renderPagination = (
    currentPage: number,
    totalPages: number,
    setPage: (page: number) => void,
  ) => {
    if (totalPages <= 1) return null;
    return (
      <Pagination className="py-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
          {getPageNumbers(currentPage, totalPages).map((page, i) =>
            page === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => setPage(page)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

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

  const renderCards = (
    items: any[],
    currentPage: number,
    setPage: (page: number) => void,
    isPast = false,
  ) => {
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const paginated = items.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );

    return (
      <div className="">
        <div className="flex flex-wrap gap-8">
          {items.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No events to display.
            </p>
          )}

          {paginated.map((event) => {
            const joined =
              capacities.find((c) => c.event_id === event.id)?.capacity ?? 0;

            const hasRequested = userRequests.some(
              (req) => req.event_id === event.id,
            );

            return (
              <VolunteerEventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                date={formatDate(event.date)}
                time={`${formatTime(event.starts_at)} - ${formatTime(
                  event.ends_at,
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
        {renderPagination(currentPage, totalPages, setPage)}
      </div>
    );
  };

  return (
    <Tabs defaultValue="ongoing">
      <TabsList className="mb-4">
        <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>
      <TabsContent value="ongoing" className="p-5">
        {renderCards(ongoing, ongoingPage, setOngoingPage, false)}
      </TabsContent>
      <TabsContent value="past" className="p-5">
        {renderCards(past, pastPage, setPastPage, true)}
      </TabsContent>
    </Tabs>
  );
}
