"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { UserCog, UserMinus, Users } from "lucide-react";
import {
  GetEventVolunteers,
  RemoveVolunteerFromEvent,
} from "@/actions/volunteer";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Volunteer = {
  id: string;
  status: string;
  created_at: string;
  user_id: string;
  role_id: string;
  users: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    avatar_url?: string;
  };
  event_roles: {
    id: string;
    role_name: string;
  };
};

type Props = {
  eventId: string;
  eventTitle: string;
  volunteerCount: number;
};

export default function ManageVolunteersDialog({
  eventId,
  eventTitle,
  volunteerCount,
}: Props) {
  const [open, setOpen] = useState(false);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(
    null,
  );
  const router = useRouter();

  const getInitials = (firstname: string, lastname: string) =>
    `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const loadVolunteers = async () => {
    setLoading(true);
    const result = await GetEventVolunteers(eventId);
    if (result.data) {
      setVolunteers(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      loadVolunteers();
    }
  }, [open, eventId]);

  const handleRemoveClick = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setRemoveDialogOpen(true);
  };

  const handleConfirmRemove = () => {
    if (!selectedVolunteer) return;

    startTransition(async () => {
      const result = await RemoveVolunteerFromEvent(
        selectedVolunteer.id,
        eventTitle,
      );

      if (result.error) {
        toast.error("Failed to remove volunteer");
      } else {
        toast.success(
          `${selectedVolunteer.users.firstname} ${selectedVolunteer.users.lastname} has been removed from the event`,
        );
        // Refresh the list
        await loadVolunteers();
        router.refresh();
      }

      setRemoveDialogOpen(false);
      setSelectedVolunteer(null);
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex w-full items-center gap-2">
            <UserCog className="h-4 w-4" />
            Manage Volunteers ({volunteerCount})
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Manage Volunteers
            </DialogTitle>
            <DialogDescription>
              {eventTitle} - {volunteers.length} volunteer
              {volunteers.length !== 1 ? "s" : ""} assigned
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner />
                <span className="text-muted-foreground ml-2">
                  Loading volunteers...
                </span>
              </div>
            ) : volunteers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Users className="text-muted-foreground mb-4 h-12 w-12" />
                <p className="text-muted-foreground">
                  No volunteers assigned to this event yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {volunteers.map((volunteer) => (
                  <div
                    key={volunteer.id}
                    className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-4 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={volunteer.users.avatar_url} />
                        <AvatarFallback className="bg-foreground text-background">
                          {getInitials(
                            volunteer.users.firstname,
                            volunteer.users.lastname,
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {volunteer.users.firstname} {volunteer.users.lastname}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {volunteer.users.email}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {volunteer.event_roles?.role_name || "No role"}
                          </Badge>
                          <span className="text-muted-foreground text-xs">
                            Joined {formatDate(volunteer.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveClick(volunteer)}
                      disabled={isPending}
                    >
                      <UserMinus className="mr-1 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Volunteer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold">
                {selectedVolunteer?.users.firstname}{" "}
                {selectedVolunteer?.users.lastname}
              </span>{" "}
              from this event? They will be notified about this action.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleConfirmRemove}
              disabled={isPending}
              asChild
            >
              <AlertDialogAction>
                {isPending ? (
                  <>
                    <Spinner /> Removing...
                  </>
                ) : (
                  "Remove Volunteer"
                )}
              </AlertDialogAction>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
