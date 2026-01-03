"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { RequestToVolunteer } from "@/actions/volunteer";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  hideCapacity?: boolean;
  hideJoinButton?: boolean;
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
  hasRequested,
  hideCapacity = false,
  hideJoinButton = false,
}: VolunteerEventCardProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const percentage = (capacity / maxCapacity) * 100;

  const handleRequest = () => {
    startTransition(async () => {
      const res = await RequestToVolunteer(id);

      if (res.success) {
        toast.success("You've joined the event!");
        router.refresh();
      } else {
        toast.error(res.message || "Something went wrong");
      }
    });
  };

  return (
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
      <CardContent className="grid grid-rows-[160px_auto]">
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

          <p className="text-foreground/80 line-clamp-3 text-base">
            {description}
          </p>
        </div>

        {/* 🔹 CAPACITY — СКРЫВАЕМ В PAST */}
        {!hideCapacity && (
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
        )}
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="flex items-center justify-between px-6 pt-2 pb-6 font-semibold">
        {!hideJoinButton && (
          <Button onClick={handleRequest} disabled={hasRequested || isPending}>
            {hasRequested
              ? "Joined"
              : isPending
              ? "Joining…"
              : "Volunteer"}
          </Button>
        )}

        <Button variant="outline">Details</Button>
      </CardFooter>
    </Card>
  );
}