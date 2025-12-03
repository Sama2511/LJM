"use client";

import { DeleteEvent } from "@/actions/events";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Calendar, Clock, MapPin, Trash2 } from "lucide-react";
import { Suspense, useState } from "react";
import EditEventForm from "./EditEventForm";
import LoadingEditEvents from "./LoadingEditEvents";
import Image from "next/image";

type Props = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  maxCapacity: number;
  image?: string;
};

export default function EventMngtCard({
  id,
  title,
  description,
  date,
  time,
  location,
  capacity,
  maxCapacity,
  image,
}: Props) {
  const percentage = (capacity / maxCapacity) * 100;
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    await DeleteEvent(id);
    setIsDeleting(false);
  };

  return (
    <Card className="group bg-muted w-[350px] overflow-hidden rounded-2xl p-0 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <CardTitle>
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={image || "/dummy-image-square8.png"}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            fill
          />

          <div className="absolute inset-0 bg-black/30"></div>

          <div className="absolute bottom-3 left-4">
            <h2 className="text-2xl font-semibold text-white drop-shadow">
              {title}
            </h2>
          </div>
        </div>
      </CardTitle>

      <CardContent className="grid grid-rows-[160px_25px]">
        <div className="mb-6 space-y-3 text-sm text-[#3E5F44]">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{date}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{time}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>{location}</span>
          </div>
          <p className="mb-6 line-clamp-3 text-base text-[#3E5F44]/80">
            {description}
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm text-[#3E5F44]">
            Capacity: {capacity}/{maxCapacity}
          </p>

          <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-[#3E5F44]"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between px-6 pt-2 pb-6 font-semibold">
        <Suspense fallback={<LoadingEditEvents />}>
          <EditEventForm id={id} />
        </Suspense>
        <Button
          asChild
          onClick={handleDelete}
          variant={"destructive"}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Button className="flex gap-2">
              <Spinner /> Delete
            </Button>
          ) : (
            <Button className="flex gap-2">
              <Trash2 className="h-5 w-5" />
              Delete
            </Button>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
