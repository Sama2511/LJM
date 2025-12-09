"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { RequestToVolunteer } from "@/actions/volunteer";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
      <DialogContent
        className="
          bg-muted 
          rounded-2xl 
          shadow-xl 
          p-0 
          overflow-hidden
          max-w-3xl
          w-[92%]

          max-h-[90vh]    /* модал не выходит за экран */
          flex 
          flex-col
        "
      >
        {/* IMAGE */}
        <div className="relative h-60 w-full">
          <Image src={event.image} alt={event.title} fill className="object-cover" />
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          <DialogHeader>
            <DialogTitle className="text-2xl text-[#3E5F44] font-semibold">
              {event.title}
            </DialogTitle>
          </DialogHeader>

          {/* DATE / TIME / LOCATION */}
          <div className="space-y-2 text-[#3E5F44]">
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
            <h3 className="text-lg font-semibold text-[#3E5F44] mb-1">Description</h3>
            <p className="text-[#3E5F44]/80 whitespace-pre-wrap">
              {event.description}
            </p>
          </div>

          {/* CAPACITY */}
          <div>
            <h3 className="text-lg font-semibold text-[#3E5F44] mb-1">Capacity</h3>

            <p className="flex items-center gap-2 text-sm text-[#3E5F44]">
              <Users className="h-4 w-4" /> {event.capacity}/{event.maxCapacity}
            </p>

            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                style={{ width: `${percentage}%` }}
                className="h-full bg-[#3E5F44] rounded-full"
              />
            </div>
          </div>
        </div>

        {/* FIXED FOOTER BUTTON */}
        <div className="p-4 border-t bg-muted">
          <DialogClose asChild>
            <Button className="w-full bg-[#3E5F44] text-white hover:bg-[#2D4A36]">
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
}: VolunteerEventCardProps) {
  const [requested, setRequested] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [detailsOpen, setDetailsOpen] = useState(false);

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
        setRequested(true);
      } else {
        toast.error(res.message || "Something went wrong");
      }
    });
  };

  return (
    <>
      <Card className="group bg-muted w-[320px] overflow-hidden rounded-2xl p-0 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

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
          <div className="mb-6 space-y-3 text-sm text-[#3E5F44]">

            <p className="flex items-center gap-2">
              <Calendar className="h-5 w-5" /> {date}
            </p>

            <p className="flex items-center gap-2">
              <Clock className="h-5 w-5" /> {time}
            </p>

            <p className="flex items-center gap-2">
              <MapPin className="h-5 w-5" /> {location}
            </p>

            <p className="line-clamp-3 text-base text-[#3E5F44]/80">
              {description}
            </p>
          </div>

          {/* CAPACITY BAR */}
          <div>
            <p className="text-sm text-[#3E5F44] mb-2">
              Capacity: {capacity}/{maxCapacity}
            </p>

            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3E5F44] rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </CardContent>

        {/* FOOTER BUTTONS */}
        <CardFooter className="flex items-center justify-between px-6 pt-2 pb-6 font-semibold">
          <Button onClick={handleRequest} disabled={requested || isPending}>
            {requested ? "Requested" : isPending ? "Loading…" : "Request to Volunteer"}
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