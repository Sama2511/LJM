"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  XCircle,
} from "lucide-react";

import StatusBadge from "@/app/(root)/(users)/components/StatusBadge";
import EventDetailsDrawer from "@/app/(root)/(users)/components/EventDetailsSheet";
import { Button } from "@/components/ui/button";
import { cancelVolunteering } from "@/actions/my-volunteering";

type Props = {
  data: any[];
};

function formatTime(time?: string) {
  if (!time || time === "00:00:00") return null;

  const [h, m] = time.split(":").map(Number);
  const hour = h % 12 || 12;
  const period = h >= 12 ? "PM" : "AM";

  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

export default function MyVolunteeringClient({ data }: Props) {
  const [items, setItems] = useState(data);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (!items || items.length === 0) {
    return (
      <p className="text-muted-foreground">
        You haven’t volunteered for any events yet.
      </p>
    );
  }

  // ✅ CANCEL → УДАЛЯЕМ ИВЕНТ ИЗ СПИСКА
  async function handleCancel(requestId: string) {
    setLoadingId(requestId);

    const res = await cancelVolunteering(requestId);

    if (!res?.error) {
      setItems((prev) => prev.filter((item) => item.id !== requestId));
    }

    setLoadingId(null);
  }

  return (
    <>
      <div className="space-y-4">
        {items.map((item) => {
          const start = formatTime(item.events?.starts_at);
          const end = formatTime(item.events?.ends_at);

          return (
            <div
              key={item.id}
              className="
                grid
                grid-cols-[2.2fr_2fr_2fr_1fr_2fr]
                items-center
                gap-4
                rounded-2xl
                bg-[#F1ECE4]
                px-6
                py-4
                transition
                hover:bg-[#E8E3DA]
              "
            >
              {/* EVENT (IMAGE + TITLE) */}
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-lg shrink-0">
                  <Image
                    src={
                      item.events?.image_url
                        ? `https://ogvimirljuiaxibowzul.supabase.co/storage/v1/object/public/event-pics/${item.events.image_url}`
                        : "/dummy-image-square8.png"
                    }
                    alt={item.events?.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="font-semibold text-lg">
                  {item.events?.title}
                </div>
              </div>

              {/* DATE & TIME */}
              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {item.events?.date}
                </div>

                {start && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {start}
                    {end && ` – ${end}`}
                  </div>
                )}
              </div>

              {/* LOCATION */}
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                {item.events?.location}
              </div>

              {/* STATUS */}
              <div className="flex justify-center">
                <StatusBadge status={item.status} />
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedEventId(item.events.id);
                    setOpenDetails(true);
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Details
                </Button>

                {["pending", "approved"].includes(item.status) && (
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={loadingId === item.id}
                    onClick={() => handleCancel(item.id)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    {loadingId === item.id ? "Cancelling..." : "Cancel"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAILS SHEET */}
      {selectedEventId && (
        <EventDetailsDrawer
          eventId={selectedEventId}
          open={openDetails}
          onOpenChange={setOpenDetails}
        />
      )}
    </>
  );
}