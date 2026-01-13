"use client";

import { DeleteEvent } from "@/actions/events";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Calendar, Clock, MapPin, Trash2, Users } from "lucide-react";
import { Suspense, useState } from "react";
import EditEventForm from "./EditEventForm";
import LoadingEditEvents from "./LoadingEditEvents";
import ManageVolunteersDialog from "./ManageVolunteersDialog";
import Image from "next/image";

type Role = {
  role_name: string;
  capacity: number;
};

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
  roles?: Role[];
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
  roles = [],
}: Props) {
  const percentage = (capacity / maxCapacity) * 100;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await DeleteEvent(id);
    setIsDeleting(false);
  };

  return (
    <Card className="group bg-muted max-w-[335px] min-w-[335px] overflow-hidden rounded-2xl p-0 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
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
          <p className="text-foreground/80 mb-6 line-clamp-3 text-base">
            {description}
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-foreground text-sm">
              Capacity: {capacity}/{maxCapacity}
            </p>
            {roles.length > 0 && (
              <div className="group/roles relative">
                <div className="text-foreground/70 hover:text-foreground flex cursor-pointer items-center gap-1 text-sm">
                  <Users className="h-4 w-4" />
                  {roles.length} {roles.length === 1 ? "role" : "roles"}
                </div>
                <div className="bg-popover absolute right-0 bottom-full z-50 mb-2 hidden min-w-[200px] rounded-md border p-3 shadow-lg group-hover/roles:block">
                  <p className="text-foreground mb-2 text-sm font-semibold">
                    Roles:
                  </p>
                  {roles.map((role, index) => (
                    <div
                      key={index}
                      className="text-foreground/80 flex justify-between gap-4 text-sm"
                    >
                      <span>{role.role_name}</span>
                      <span className="text-foreground/60">
                        {role.capacity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-background h-2 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 px-6 pt-2 pb-6 font-semibold">
        <div className="flex w-full items-center justify-between">
          <Suspense fallback={<LoadingEditEvents />}>
            <EditEventForm id={id} />
          </Suspense>
          <AlertDialog>
          <AlertDialogTrigger>
            <Button asChild variant={"destructive"} disabled={isDeleting}>
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
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                event.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button asChild variant="destructive" onClick={handleDelete}>
                <AlertDialogAction>Delete</AlertDialogAction>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>

        {/* Manage Volunteers Button */}
        <ManageVolunteersDialog
          eventId={id}
          eventTitle={title}
          volunteerCount={capacity}
        />
      </CardFooter>
    </Card>
  );
}
