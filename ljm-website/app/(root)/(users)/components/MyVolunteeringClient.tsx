"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import EventDetailsDrawer from "@/app/(root)/(users)/components/EventDetailsSheet";
import { cancelVolunteering } from "@/actions/my-volunteering";

const ITEMS_PER_PAGE = 5;

export default function MyVolunteeringClient({ data }: { data: any[] }) {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [ongoingPage, setOngoingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelRequestId, setCancelRequestId] = useState<string | null>(null);

  const now = new Date();

  const ongoing = useMemo(
    () =>
      data.filter(
        (i) => new Date(`${i.events.date}T${i.events.ends_at}`) >= now,
      ),
    [data],
  );

  const past = useMemo(
    () =>
      data.filter(
        (i) => new Date(`${i.events.date}T${i.events.ends_at}`) < now,
      ),
    [data],
  );

  const paginate = (items: any[], currentPage: number) => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  };

  const getTotalPages = (items: any[]) => {
    return Math.ceil(items.length / ITEMS_PER_PAGE);
  };

  function openCancelDialog(requestId: string) {
    setCancelRequestId(requestId);
    setCancelDialogOpen(true);
  }

  async function confirmCancel() {
    if (!cancelRequestId) return;

    setLoadingId(cancelRequestId);
    setCancelDialogOpen(false);

    const res = await cancelVolunteering(cancelRequestId);

    if (res?.error) {
      toast.error("Failed to cancel event");
    } else {
      toast.success("You have cancelled the event");
    }

    setLoadingId(null);
    setCancelRequestId(null);
  }

  const VolunteeringTable = ({
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
      <div className="bg-card rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead>Event</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Location</TableHead>
              {showCapacity && <TableHead>Capacity</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item) => {
              const joined = item.events.volunteer_requests?.[0]?.count ?? 0;
              const max = item.events.capacity ?? 0;
              const percent = max > 0 ? Math.min((joined / max) * 100, 100) : 0;

              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <span className="font-medium">{item.events.title}</span>
                  </TableCell>

                  <TableCell>
                    <span className="text-muted-foreground">
                      {item.event_roles?.role_name || "—"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm">{item.events.date}</span>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm">
                      {item.events.starts_at} – {item.events.ends_at}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm">{item.events.location}</span>
                  </TableCell>

                  {showCapacity && (
                    <TableCell>
                      <div className="mb-1 text-xs text-muted-foreground">
                        {joined}/{max}
                      </div>
                      <div className="h-2 max-w-[120px] rounded-full bg-muted">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </TableCell>
                  )}

                  <TableCell className="text-right">
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
                          onClick={() => openCancelDialog(item.id)}
                        >
                          {loadingId === item.id ? "Cancelling..." : "Cancel"}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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
          <VolunteeringTable items={paginatedItems} showCancel showCapacity />
        </TabsContent>

        <TabsContent value="past">
          <VolunteeringTable
            items={paginatedItems}
            showCancel={false}
            showCapacity={false}
          />
        </TabsContent>
      </Tabs>

      {currentItems.length > ITEMS_PER_PAGE && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePrevious}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
            <PaginationItem>
              <span className="text-muted-foreground px-4 text-sm">
                Page {currentPage} of {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={handleNext}
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

      {selectedEvent && (
        <EventDetailsDrawer
          open={!!selectedEvent}
          onOpenChange={() => setSelectedEvent(null)}
          eventId={selectedEvent.id}
        />
      )}

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Volunteering</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your registration for this event?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep it</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive"
              onClick={confirmCancel}
            >
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
