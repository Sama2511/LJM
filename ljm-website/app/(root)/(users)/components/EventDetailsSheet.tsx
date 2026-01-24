

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { FetchEventForEdit } from "@/actions/events";

type Props = {
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function EventDetails({ eventId, open, onOpenChange }: Props) {
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isPastEvent = eventData && new Date(eventData.date) < new Date();


  async function loadEvent() {
    setLoading(true);
    const res = await FetchEventForEdit(eventId);
    if (res.data) setEventData(res.data);
    setLoading(false);
  }

  useEffect(() => {
    if (open) loadEvent();
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="bg-muted w-[380px] sm:w-[420px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-xl">Event Details</SheetTitle>
        </SheetHeader>

        {loading || !eventData ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-6 px-4 pb-10">
            {/* IMAGE */}
            <div className="relative w-full h-48 rounded-lg overflow-hidden shadow">
              <Image
                src={`https://ogvimirljuiaxibowzul.supabase.co/storage/v1/object/public/event-pics/${eventData.image_url}`}
                alt={eventData.title}
                fill
                className="object-cover"
              />
            </div>

            {/* TITLE */}
            <h2 className="text-2xl font-semibold text-foreground">
              {eventData.title}
            </h2>

            {/* DATE & TIME INFO */}
            <div className="space-y-3 text-foreground">
              <p className="flex items-center gap-2">
                <Calendar className="h-5 w-5" /> {eventData.date}
              </p>

              <p className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {eventData.starts_at} – {eventData.ends_at}
              </p>

              <p className="flex items-center gap-2">
                <MapPin className="h-5 w-5" /> {eventData.location}
              </p>
            </div>

            {/* DESCRIPTION */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Description
              </h3>
              <p className="text-foreground/80 leading-relaxed">
                {eventData.description}
              </p>
            </div>

            {/* CAPACITY */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Capacity
              </h3>

              <p className="text-sm text-foreground mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                {eventData.current_capacity}/{eventData.capacity} total spots filled
              </p>

              <div className="bg-secondary h-2 w-full rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: `${
                      (eventData.current_capacity / eventData.capacity) * 100
                    }%`,
                  }}
                />
              </div>

              {/* Roles breakdown */}
              {eventData.roles && eventData.roles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Roles:</p>
                  {eventData.roles.map((role: any) => (
                    <div key={role.id} className="flex justify-between text-sm text-foreground/80">
                      <span>{role.role_name}</span>
                      <span>{role.filled}/{role.capacity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
              
              {isPastEvent && (
                <a href={`/testimonials?eventId=${eventData.id}&eventTitle=${encodeURIComponent(eventData.title)}`}
                  className="w-full block text-center bg-primary text-white px-3 py-2 rounded-md hover:bg-primary/90 transition"
                >
                  Leave Testimonial
                </a>
              )}

            {/* CLOSE BUTTON */}
            <SheetClose asChild>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Close
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}