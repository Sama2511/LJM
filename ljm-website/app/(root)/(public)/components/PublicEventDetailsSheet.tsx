"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { FetchEventForEdit } from "@/actions/events";

type Props = {
  eventId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function PublicEventDetailsSheet({
  eventId,
  open,
  onOpenChange,
}: Props) {
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !eventId) return;

    const loadEvent = async () => {
      setLoading(true);
      const res = await FetchEventForEdit(eventId);
      if (res.data) setEventData(res.data);
      setLoading(false);
    };

    loadEvent();
  }, [open, eventId]);

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
            <div className="relative h-48 w-full overflow-hidden rounded-lg shadow">
              <Image
                src={`https://ogvimirljuiaxibowzul.supabase.co/storage/v1/object/public/event-pics/${eventData.image_url}`}
                alt={eventData.title}
                fill
                className="object-cover"
              />
            </div>

            <h2 className="text-2xl font-semibold text-[#3E5F44]">
              {eventData.title}
            </h2>

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

            <div>
              <h3 className="mb-1 text-lg font-semibold text-[#3E5F44]">
                Description
              </h3>
              <p className="text-[#3E5F44]/80 leading-relaxed">
                {eventData.description}
              </p>
            </div>

            <SheetClose asChild>
              <Button className="w-full bg-[#3E5F44] text-white hover:bg-[#2c4633]">
                Close
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}