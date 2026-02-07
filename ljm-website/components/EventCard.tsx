"use client";

import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Props = {
  eventId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  isPast: boolean;

  // parent will open sheet
  onDetails: (eventId: string) => void;
};

export function EventCard({
  eventId,
  title,
  description,
  date,
  time,
  location,
  image,
  isPast,
  onDetails,
}: Props) {
  return (
    <Card
      className={`group relative max-w-82 min-w-82 overflow-hidden rounded-2xl p-0 shadow-md transition-all duration-300 ${
        isPast ? "bg-muted" : "bg-muted hover:-translate-y-2 hover:shadow-xl"
      }`}
    >
      {isPast && (
        <div className="pointer-events-none absolute inset-0 z-10 rounded-xl bg-black/30" />
      )}

      <CardTitle>
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={image || "/dummy-image-square8.png"}
            alt="event image"
            fill
            className={`object-cover ${
              isPast
                ? ""
                : "transition-transform duration-500 group-hover:scale-110"
            }`}
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute bottom-3 left-4">
            <h2 className="text-2xl font-semibold text-white drop-shadow">
              {title}
            </h2>
          </div>
        </div>
      </CardTitle>

      <CardContent className="grid grid-rows-[120px]">
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

          <p className="text-foreground/80 mt-4 line-clamp-3 text-base">
            {description}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-3 px-6 py-6">
        {!isPast && (
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Volunteer
          </Button>
        )}

        <Button variant="outline" onClick={() => onDetails(eventId)}>
          Details
        </Button>
      </CardFooter>
    </Card>
  );
}
