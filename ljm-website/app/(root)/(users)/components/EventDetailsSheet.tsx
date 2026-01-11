

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
            <h2 className="text-2xl font-semibold text-[#3E5F44]">
              {eventData.title}
            </h2>

            {/* DATE & TIME INFO */}
            <div className="space-y-3 text-[#3E5F44]">
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
              <h3 className="text-lg font-semibold text-[#3E5F44] mb-1">
                Description
              </h3>
              <p className="text-[#3E5F44]/80 leading-relaxed">
                {eventData.description}
              </p>
            </div>

            {/* CAPACITY */}
            <div>
              <h3 className="text-lg font-semibold text-[#3E5F44] mb-1">
                Capacity
              </h3>

              <p className="text-sm text-[#3E5F44] mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                {eventData.current_capacity}/{eventData.capacity} total spots filled
              </p>

              <div className="bg-secondary h-2 w-full rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-[#3E5F44] rounded-full"
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
                  <p className="text-sm font-medium text-[#3E5F44]">Roles:</p>
                  {eventData.roles.map((role: any) => (
                    <div key={role.id} className="flex justify-between text-sm text-[#3E5F44]/80">
                      <span>{role.role_name}</span>
                      <span>{role.filled}/{role.capacity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CLOSE BUTTON */}
            <SheetClose asChild>
              <Button className="w-full bg-[#3E5F44] hover:bg-[#2c4633] text-white">
                Close
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}