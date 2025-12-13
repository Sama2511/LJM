"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { RequestToVolunteer } from "@/actions/volunteer";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

/* DIALOG */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface VolunteerEventCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  capacity: number;
  maxCapacity: number;
  hasRequested?: boolean;
}

function EventDetailsModal({
  open,
  onOpenChange,
  event,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  event: any;
}) {
  if (!event) return null;

  const percentage = (event.capacity / event.maxCapacity) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-muted /* модал не выходит за экран */ flex max-h-[90vh] w-[92%] max-w-3xl flex-col overflow-hidden rounded-2xl p-0 shadow-xl">
        {/* IMAGE */}
        <div className="relative h-60 w-full">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          <DialogHeader>
            <DialogTitle className="text-foreground text-2xl font-semibold">
              {event.title}
            </DialogTitle>
          </DialogHeader>

          {/* DATE / TIME / LOCATION */}
          <div className="text-foreground space-y-2">
            <p className="flex items-center gap-2 text-sm">
              <Calendar className="h-5 w-5" /> {event.date}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <Clock className="h-5 w-5" /> {event.time}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <MapPin className="h-5 w-5" /> {event.location}
            </p>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h3 className="text-foreground mb-1 text-lg font-semibold">
              Description
            </h3>
            <p className="text-foreground/80 whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

          {/* CAPACITY */}
          <div>
            <h3 className="text-foreground mb-1 text-lg font-semibold">
              Capacity
            </h3>

            <p className="text-foreground flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" /> {event.capacity}/{event.maxCapacity}
            </p>

            <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
              <div
                style={{ width: `${percentage}%` }}
                className="bg-fortext-foreground h-full rounded-full"
              />
            </div>
          </div>
        </div>

        {/* FIXED FOOTER BUTTON */}
        <div className="bg-muted border-t p-4">
          <DialogClose asChild>
            <Button className="bg-fortext-foreground w-full text-white hover:bg-[#2D4A36]">
              Close
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ============================================================
   MAIN EVENT CARD
============================================================ */
export default function VolunteerEventCard({
  id,
  title,
  description,
  date,
  time,
  location,
  image,
  capacity,
  maxCapacity,
  hasRequested = false,
}: VolunteerEventCardProps) {
  const [isPending, startTransition] = useTransition();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const router = useRouter();

  const percentage = (capacity / maxCapacity) * 100;

  const eventData = {
    id,
    title,
    description,
    date,
    time,
    location,
    image,
    capacity,
    maxCapacity,
  };

  const handleRequest = () => {
    startTransition(async () => {
      const res = await RequestToVolunteer(id);

      if (res.success) {
        toast.success("Request sent!");
        router.refresh();
      } else {
        toast.error(res.message || "Something went wrong");
      }
    });
  };

  return (
    <>
      <Card className="group bg-muted max-w-[335px] min-w-[335px] overflow-hidden rounded-2xl p-0 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
        {/* IMAGE */}
        <CardTitle>
          <div className="relative h-40 w-full overflow-hidden rounded-t-2xl">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-black/30" />

            <div className="absolute bottom-3 left-4">
              <h2 className="text-2xl font-semibold text-white drop-shadow">
                {title}
              </h2>
            </div>
          </div>
        </CardTitle>

        {/* CONTENT */}
        <CardContent className="grid grid-rows-[160px_25px]">
          <div className="text-foreground mb-6 space-y-3 text-sm">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">{date}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="font-medium">{time}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="font-medium">{location}</span>
            </div>
            <p className="text-foreground/80 mb-6 line-clamp-3 text-base">
              {description}
            </p>
          </div>

          <div>
            <p className="text-foreground mb-2 text-sm">
              Capacity: {capacity}/{maxCapacity}
            </p>

            <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between px-6 pt-2 pb-6 font-semibold">
          <Button onClick={handleRequest} disabled={hasRequested || isPending}>
            {hasRequested
              ? "Requested"
              : isPending
                ? "Loading…"
                : "Request to Volunteer"}
          </Button>

          <Button variant="outline" onClick={() => setDetailsOpen(true)}>
            Details
          </Button>
        </CardFooter>
      </Card>

      {/* MODAL DETAILS */}
      <EventDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        event={eventData}
      />
    </>
  );
}
