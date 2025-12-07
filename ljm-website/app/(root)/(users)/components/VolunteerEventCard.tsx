"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { RequestToVolunteer } from "@/actions/volunteer";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

  const percentage = (capacity / maxCapacity) * 100;

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
    <Card className="group bg-muted w-[320px] overflow-hidden rounded-2xl p-0 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      {/* IMAGE HEADER */}
      <CardTitle>
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={image || "/dummy-image-square8.png"}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            fill
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
          {/* Date + Time */}
          <div className="flex gap-4">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" /> {date}
            </span>

            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5" /> {time}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>{location}</span>
          </div>

          {/* Description */}
          <p className="mb-4 line-clamp-3 text-base text-[#3E5F44]/80">
            {description}
          </p>
        </div>

        {/* CAPACITY PROGRESS */}
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

      {/* FOOTER BUTTONS */}
      <CardFooter className="flex items-center justify-between px-6 pt-2 pb-6 font-semibold">
        <Button
          onClick={handleRequest}
          disabled={requested || isPending}
          className="bg-[#3E5F44] text-white hover:bg-[#2f4834] disabled:opacity-50"
        >
          {requested ? "Requested" : isPending ? "Loading…" : "Request to Volunteer"}
        </Button>

        <Button variant="outline">Details</Button>
      </CardFooter>
    </Card>
  );
}