"use client";

import React, { useState } from "react";
import EventMngtCard from "./DashEventCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type Role = {
  role_name: string;
  capacity: number;
};

type EventItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  maxCapacity: number;
  capacity: number;
  roles: Role[];
};

const ITEMS_PER_PAGE = 9;

export default function PaginatedEventGrid({
  events,
}: {
  events: EventItem[];
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = events.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getPageNumbers = () => {
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

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-10 py-10 pr-5 md:pl-5 @[830]:justify-start">
        {paginatedEvents.map((event) => (
          <EventMngtCard
            key={event.id}
            title={event.title}
            description={event.description}
            date={event.date}
            time={event.time}
            location={event.location}
            image={event.image}
            maxCapacity={event.maxCapacity}
            capacity={event.capacity}
            id={event.id}
            roles={event.roles}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="py-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {getPageNumbers().map((page, i) =>
              page === "ellipsis" ? (
                <PaginationItem key={`ellipsis-${i}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
