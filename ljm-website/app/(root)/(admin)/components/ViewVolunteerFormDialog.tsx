"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Heart,
  Lightbulb,
  Phone,
  Sparkles,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type VolunteerFormData = {
  id: string;
  created_at: string;
  phone: string | null;
  emergency_contact: string | null;
  activities: string;
  interests: string | null;
  skills: string | null;
  story: string | null;
  availability: string;
  certificate: string;
  inspiration: string;
  status: string;
  user_id: string;
  users: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
};

type ViewVolunteerFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: VolunteerFormData | null;
};

const activityLabels: Record<string, string> = {
  events: "Events",
  gardening: "Gardening",
  companionship: "Companionship",
  transport: "Transport",
  "kitchen-help": "Kitchen Help",
  administration: "Administration",
};

const certificateLabels: Record<string, string> = {
  clearance: "Police Clearance",
  childrenCheck: "Working with Children Check",
};

export default function ViewVolunteerFormDialog({
  open,
  onOpenChange,
  formData,
}: ViewVolunteerFormDialogProps) {
  if (!formData) return null;

  let activities: string[] = [];
  if (formData.activities) {
    if (Array.isArray(formData.activities)) {
      activities = formData.activities;
    } else if (typeof formData.activities === "string") {
      try {
        activities = JSON.parse(formData.activities);
      } catch {
        activities = formData.activities
          .split(",")
          .map((s: string) => s.trim());
      }
    }
  }

  let certificates: string[] = [];
  if (formData.certificate) {
    if (Array.isArray(formData.certificate)) {
      certificates = formData.certificate;
    } else if (typeof formData.certificate === "string") {
      try {
        certificates = JSON.parse(formData.certificate);
      } catch {
        certificates = formData.certificate
          .split(",")
          .map((s: string) => s.trim());
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <UserCircle className="h-6 w-6 text-[#3E5F44]" />
            Crew Application
          </DialogTitle>
          <DialogDescription>
            {formData.users.firstname} {formData.users.lastname} •{" "}
            {formData.users.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <CalendarDays className="h-4 w-4" />
              Submitted on {formatDate(formData.created_at)}
            </div>
            <Badge
              variant={formData.status === "approved" ? "default" : "secondary"}
              className={
                formData.status === "approved"
                  ? "bg-primary"
                  : formData.status === "pending"
                    ? "rounded-xl bg-yellow-500 px-4 py-2 text-sm"
                    : ""
              }
            >
              {formData.status}
            </Badge>
          </div>

          <Separator />

          <div>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-[#3E5F44]">
              <Phone className="h-5 w-5" />
              Contact Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-xs">Phone Number</p>
                <p className="text-sm">{formData.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Emergency Contact</p>
                <p className="text-sm">{formData.emergency_contact || "Not provided"}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-[#3E5F44]">
              <ClipboardList className="h-5 w-5" />
              Activities of Interest
            </h3>
            <div className="flex flex-wrap gap-2">
              {activities.map((activity: string) => (
                <Badge
                  key={activity}
                  variant="outline"
                  className="bg-muted rounded-xl px-4 py-2 text-sm"
                >
                  {activityLabels[activity] || activity}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-[#3E5F44]">
              <CheckCircle2 className="h-5 w-5" />
              Certificates
            </h3>
            <ol className="flex flex-wrap gap-2">
              {certificates.length > 0 ? (
                certificates.map((cert: string) => (
                  <li key={cert}>{certificateLabels[cert] || cert}</li>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  No certificates provided
                </p>
              )}
            </ol>
          </div>

          <Separator />

          <div>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-[#3E5F44]">
              <Lightbulb className="h-5 w-5" />
              Inspiration
            </h3>
            <p className="text-sm leading-relaxed">{formData.inspiration}</p>
          </div>

          <Separator />

          <div>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-[#3E5F44]">
              <CalendarDays className="h-5 w-5" />
              Availability
            </h3>
            <p className="text-sm leading-relaxed">{formData.availability}</p>
          </div>

          {formData.interests && (
            <>
              <Separator />
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-[#3E5F44]">
                  <Heart className="h-5 w-5" />
                  Interests
                </h3>
                <p className="text-sm leading-relaxed">{formData.interests}</p>
              </div>
            </>
          )}

          {formData.skills && (
            <>
              <Separator />
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-[#3E5F44]">
                  <Sparkles className="h-5 w-5" />
                  Skills
                </h3>
                <p className="text-sm leading-relaxed">{formData.skills}</p>
              </div>
            </>
          )}

          {formData.story && (
            <>
              <Separator />
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold text-[#3E5F44]">
                  <UserCircle className="h-5 w-5" />
                  Story
                </h3>
                <p className="text-sm leading-relaxed">{formData.story}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
