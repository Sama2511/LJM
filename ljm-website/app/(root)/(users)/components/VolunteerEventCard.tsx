"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { JoinEvent, GetEventRolesWithCapacity } from "@/actions/volunteer";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EventDetailsSheet from "@/app/(root)/(users)/components/EventDetailsSheet";

interface Role {
  id: string;
  role_name: string;
  capacity: number;
  filled: number;
  available: number;
}

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const router = useRouter();

  const percentage = (capacity / maxCapacity) * 100;

  const handleOpenRoleDialog = async () => {
    setLoadingRoles(true);
    setIsDialogOpen(true);
    const res = await GetEventRolesWithCapacity(id);
    if (res.data) {
      setRoles(res.data);
    }
    setLoadingRoles(false);
  };

  const handleSelectRole = (roleId: string) => {
    startTransition(async () => {
      const res = await JoinEvent(id, roleId);

      if (res.success) {
        toast.success("You've joined the event!");
        setIsDialogOpen(false);
        router.refresh();
      } else {
        toast.error(res.message || "Something went wrong");
      }
    });
  };

  return (
    <Card className="group bg-muted max-w-75 min-w-75 overflow-hidden rounded-2xl p-0 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
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

            <div className="bg-background h-2 w-full overflow-hidden rounded-full">
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
          <Button
            onClick={handleOpenRoleDialog}
            disabled={hasRequested || isPending}
          >
            {hasRequested ? "Joined" : isPending ? "Joining…" : "Volunteer"}
          </Button>
        )}

        <Button variant="outline" onClick={() => setIsDetailsOpen(true)}>
          Details
        </Button>
      </CardFooter>

      <EventDetailsSheet
        eventId={id}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Select a Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {loadingRoles ? (
              <p className="text-muted-foreground text-center">
                Loading roles...
              </p>
            ) : roles.length === 0 ? (
              <p className="text-muted-foreground text-center">
                No roles available
              </p>
            ) : (
              roles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{role.role_name}</p>
                    <p className="text-muted-foreground text-sm">
                      {role.filled}/{role.capacity} spots filled
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleSelectRole(role.id)}
                    disabled={role.available <= 0 || isPending}
                  >
                    {role.available <= 0
                      ? "Full"
                      : isPending
                        ? "Joining..."
                        : "Join"}
                  </Button>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
